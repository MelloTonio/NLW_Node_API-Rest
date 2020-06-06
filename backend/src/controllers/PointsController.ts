import knex from '../database/connection'
import {Request,Response} from 'express'


class PointsController {
    async index(request:Request,response:Response){
        const {city, uf, items} = request.query

        const parsedItems = String(items).split(',').map(item => Number(item.trim()))


        const points = await knex('points')
            .join('point_items','points.id','=','point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*') 



        const serializedPoints = points.map(point => {
            return ({
                ...point,
                image_url: `http://192.168.15.52:3333/uploads/${point.image}`
                
            })
            
        })

        
        return response.json(serializedPoints)
    }

    
    async show(request:Request,response:Response){
        const { id } = request.params
        
        const point = await knex('points').where('id',id).first()

        if(!point){
            return response.status(400).json({message: 'Id não encontrado! '})
        }
        
        const serializedPoint = {
                ...point,
                image_url: `http://192.168.15.52:3333/uploads/${point.image}`
            
            }
        
        

        // Junte a tabela items com a point_items aonde o id dos items for igual ao id do point_items
        // Ele irá fazer isso apenas no item que foi requisitado no request.params
        const items = await knex('items').join('point_items','items.id','=','point_items.item_id')
        .where('point_items.point_id',id)
        .select('items.title')
        
        return response.json({point:serializedPoint,items})
    }
    async create(request:Request,response:Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
        
        //Impede que seja criado um novo point se o item não existe
        const trx = await knex.transaction()

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf, 
        }
        
        // Insere na tabela 'points' os devidos campos dos pontos de coleta
        const insertedIds = await trx('points').insert(point)
    

        const point_id = insertedIds[0]
    
        // Faz um map para unir id do item e o id dos pontos
        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id:number)=>{
            return{
                item_id,
                point_id
            }
        })
    
        // Tenta unir um ponto de coleta com seus respectivos itens.
        await trx('point_items').insert(pointItems)

        await trx.commit()
    
        return response.json({
            id:point_id,
            ...point,})
    }
}

export default PointsController
 