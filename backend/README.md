<h1 align="center">
   Setting Backend
</h1>

## Primary Setup
<i>In this first step we will ensure that all packages needed to run the backend are installed</i>

run ```npm install``` (This command will perform the installation of all necessary packages)

## Database Setup
<i>In this step we will configure the database, creating data (which already have models)</i>

run ```npm run knex:migrate```(This command will create all the tables needed to run the backend)

run ```npm run knex:seed```(This command will populate the ''items'' table with title and images)

## Final Setup
<i>With all the settings ready, now we just need to run the server</i>

run ```npm run dev```(This command will run the server on port 3333)



