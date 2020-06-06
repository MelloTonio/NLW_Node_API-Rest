import express from 'express';
import routes from './routes'
import path from 'path'
import cors from 'cors'
import {errors} from 'celebrate'
//Métodos HTTP
// GET: Buscar informações no back-end
// POST: Criar uma nova informação no back-end
// PUT: Atualizar uma informação existente no back-end
// DELETE: Remover uma informação do back-end

// Request Param: Parâmetros que vem na própria rota e que identificar um recurso(geralmente usuário)
// Query Param: Parâmetros que vem na própria rota, geralmente opcionais, e que servem para filtro/paginação
// Request Body: Parâmetros criação/atualização de informações
const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname,'..','uploads')))

app.use(errors())

app.listen(3333)