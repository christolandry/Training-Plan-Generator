const express = require('express')
const express = require('express')
const app = express() 
const MongoClient = require('mongodb').MongoClient 
const PORT = 2121 
require('dotenv').config() 

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'training-plans'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })

//middleware
app.set('view engine', 'ejs') 
app.use(express.static('public')) 
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 

//routes
app.get('/',async (request, response)=>{  
    const todoItems = await db.collection('test').find().toArray() 
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) 
    .catch(error => console.error(error))
})






app.listen(process.env.PORT || PORT, ()=>{ 
    console.log(`Server running on port ${PORT}`)
})