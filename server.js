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
        console.log(`Connected to ${dbName} database`)
        db = client.db(dbName)
    })

//middleware
app.set('view engine', 'ejs') 
app.use(express.static('public')) 
app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 

//routes
app.get('/',async (request, response)=>{  
    response.render('index.ejs') 
    // .catch(error => console.error(error))
})

app.post('/generatePlan', (request, response) =>{
    try{
        const goalDistance = Number(request.body.goalDistance)
        const planDuration = Number(request.body.planDuration)
        const maxMileage = Number(request.body.maxMileage)
        const maxLR = Number(request.body.maxLR)

        let LR = generateLongRuns(planDuration, goalDistance, maxLR)
        
        
        




        response.render('plan.ejs', {distance: goalDistance, longRuns: LR})
    }catch(error){
        console.log(error)
    }
    
})


function generateLongRuns(duration, race, maxLR){
    let longRuns = Array(duration).fill(0)
    console.log(`longruns: ${longRuns}`)
    console.log(`duration: ${duration}  race: ${race}`)   
    if(duration === 16 && race === 26){
        longRuns[15] = race
        longRuns[14] = Math.floor(maxLR * 0.6)
        longRuns[13] = Math.floor(maxLR * 0.8)
        longRuns[12] = maxLR
        longRuns[11] = Math.floor(maxLR * 0.85)
        longRuns[10] = maxLR
        longRuns[9] = Math.floor(maxLR * 0.85)
        longRuns[8] = maxLR
        longRuns[7] = longRuns[9]-1
        longRuns[6] = longRuns[8]-1
        longRuns[5] = longRuns[7]
        longRuns[4] = longRuns[6]-1
        longRuns[3] = longRuns[4]-2
        longRuns[2] = longRuns[3]-2
        longRuns[1] = longRuns[2]-2
        longRuns[0] = longRuns[1]-2
        console.log("hello")
    }
    console.log(`longruns: ${longRuns}`)
    console.log(`length: ${longRuns.length}`)
    return longRuns
}





app.listen(process.env.PORT || PORT, ()=>{ 
    console.log(`Server running on port ${PORT}`)
})