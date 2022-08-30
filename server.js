//----To Do's-----
//Adjust warm up and cool downs to be less than 20 minutes if going over planned weekly mileage. 
//Add in warm up and cool down to the calendar
//Add in race at the of the calendar


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
    .catch(error => console.error(error))
})

app.post('/generatePlan', (request, response) =>{
    try{
        //extra user input from request
        const goalDistance = Number(request.body.goalDistance)
        const planDuration = Number(request.body.planDuration)
        const maxMileage = Number(request.body.maxMileage)
        const maxLR = Number(request.body.maxLR)
        const pace = Number(request.body.minutes) + Number(request.body.seconds) / 60
        const week = JSON.parse(request.body.weekSchedule)

        //generate run data.
        let longRuns = generateLongRuns(planDuration, goalDistance, maxLR)
        let primaryWorkouts = generatePrimaryWorkouts(planDuration, goalDistance, pace)
        let secondaryWorkouts = generateSecondaryWorkouts(planDuration, goalDistance, pace)
        let weeklyMileage = generateWeeklyMileage(planDuration, maxMileage, pace, longRuns, primaryWorkouts, secondaryWorkouts)
        let maintenanceRuns = generateMaintenanceRuns(planDuration, weeklyMileage, pace, week.runningDays)
        let weeklySchedule = generateWeeklySchedule(planDuration, week, longRuns, primaryWorkouts, secondaryWorkouts, maintenanceRuns, weeklyMileage, pace)

        response.render('plan.ejs', {distance: goalDistance, weeklySchedule: weeklySchedule[0], weeklyTotals: weeklySchedule[1], mileage: weeklyMileage})
    }catch(error){
        console.log(error)
    }
    
})


function generateLongRuns(duration, race, maxLR){
    //Generate long runs array.
    let longRuns = Array(duration).fill(0)  

    if(duration === 16 && race === 26){
        longRuns[15] = 0
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
    }

    return longRuns
}


function generatePrimaryWorkouts(duration, race, pace){
    //Generate Primary Workouts.  Note the the two weeks do not have workouts and are replaced by maintenance runs
    let workouts = Array(duration)
    if(duration === 16 && race === 26){
        
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Fartlek", 20, "min"]
        workouts[3] = ["Fartlek", 24, "min"]
        workouts[4] = ["Fartlek", 28, "min"]
        workouts[5] = ["Hills", 30, "min"]
        workouts[6] = ["Tempo", 34, "min"]
        workouts[7] = ["Tempo", 38, "min"]
        workouts[8] = ["Track", 6, "miles"]
        workouts[9] = ["Track", 7, "miles"]
        workouts[10] = ["Track", 8, "miles"]
        workouts[11] = ["Track", 9, "miles"]
        workouts[12] = ["Track", 10, "miles"]
        workouts[13] = ["Tempo", 38, "min"]
        workouts[14] = ["Tempo", 25, "min"]
        workouts[15] = ["Fartlek", 12, "min"]
    }
    //workouts[week][3] is the mileage for that workout as some workouts are denominated in minutes.
    for(let week = 0; week < duration; week++){
        workouts[week][3] = workouts[week][2] === "miles" ? workouts[week][1] : workouts[week][1] / pace
    }
    return workouts
}

function generateSecondaryWorkouts(duration, race, pace){
    //Generate Primary Workouts.  Note the the two weeks do not have workouts and are replaced by maintenance runs
    let workouts = Array(duration)
    if(duration === 16 && race === 26){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Tempo", 20, "min"]
        workouts[3] = ["Tempo", 24, "min"]
        workouts[4] = ["Tempo", 28, "min"]
        workouts[5] = ["Fartlek", 32, "min"]
        workouts[6] = ["Fartlek", 36, "min"]
        workouts[7] = ["Fartlek", 40, "min"]
        workouts[8] = ["Hills", 45, "min"]
        workouts[9] = ["Tempo", 45, "min"]
        workouts[10] = ["Progression", 50, "min"]
        workouts[11] = ["Tempo", 50, "min"]
        workouts[12] = ["Progression", 45, "min"]
        workouts[13] = ["Track", 6, "miles"]
        workouts[14] = ["Fartlek", 20, "min"]
        workouts[15] = ["Tempo", 18, "min"]
    }
    //workouts[week][3] is the mileage for that workout as some workouts are denominated in minutes.
    for(let week = 0; week < duration; week++){
        workouts[week][3] = workouts[week][2] === "miles" ? workouts[week][1] : workouts[week][1] / pace
    }
    return workouts
}

function generateWeeklyMileage(duration, maxMileage, pace, longRuns, primaryWorkouts, secondaryWorkouts){
    //weeklyMileage: [total miles for the week, miles left for maintenance runs, warm up duration, cool down duration]
    //units are: [miles, miles, min, min]
    let weeklyMileage = Array(duration), milesAccountedFor
    let percents16Weeks = [0.5, 0.56, 0.66, 0.74, 0.8, 0.88, 0.96, 0.8, 1, 0.84, 1, 0.84, 1, 0.8, 0.6, 0.4]
    
    //
    if(duration === 16){
        for(let week = 0; week < duration; week++){
            //Total miles for the week
            total = Math.floor(maxMileage * percents16Weeks[week])
            //Miles already account for by the: Long Run, Primary Workout, & Secondary Workout
            milesAccountedFor = longRuns[week] + primaryWorkouts[week][3] + secondaryWorkouts[week][3]
            //Minutes left over for the warm up and cool down in the week after all runs except for warm ups and cool downs. 
            let leftOver = (total - milesAccountedFor - 2 * Math.ceil(25/pace)) / 2 * pace
            //Warm up is 2/3 of the left over minutes rounded up to a five min increment then subjected to a maximum and a minimum
            let warmUp = Math.ceil((leftOver * 2 / 3) / 5) * 5
            if(warmUp >= 20) warmUp = 20
            if(warmUp < 10) warmUp = 10
            //Cool down left over minutes after the warm up is taken into account rounded down to a five min increment then subjected to a maximum and a minimum
            let coolDown = Math.floor((leftOver - warmUp) / 5) * 5
            if(coolDown < 10) coolDown = 10
            if(coolDown > 20) coolDown = 20
                     
            //weeklyMileage: [total miles for the week, miles left for maintenance runs, warm up duration, cool down duration]
            //units are: [miles, miles, min, min]
            weeklyMileage[week] = [total, total - milesAccountedFor - (warmUp * 2 + coolDown * 2) / pace, warmUp, coolDown]
        }
    }
    return weeklyMileage
}

function generateMaintenanceRuns(duration, weeklyMileage, pace, runningDays){
    let maintenanceRuns = Array(duration)
    if(runningDays == 5){
        for(let week = 0; week < duration; week++){
            //If there is under 25 minutes worth of running for each maintenance run in the week, assign minimum amount of running for each maintenance run
            if(weeklyMileage[week][1] < (25 / pace) * 2 ) {
                maintenanceRuns[week] = [Math.floor(25/pace), Math.ceil(25/pace)]
            }
            //otherwise divid the remaining miles into two runs rounding down for the first one and up for the second one.
            else{
                maintenanceRuns[week] = [Math.floor(weeklyMileage[week][1] / 2), Math.ceil(weeklyMileage[week][1] / 2)]
            }
        }
    }
    return maintenanceRuns
}

function generateWeeklySchedule(duration, weekInfo, longRuns, primaryWorkouts, secondaryWorkouts, maintenanceRuns, weeklyMileage, pace){
    //weeklySchedule[week][type, amount, unit]
    let weeklySchedule = Array.from({length: duration}, e => Array(7).fill(0)); 
    let type, units, amount, maintenanceRunCount, weeklyTotalMileage, miles
    let weeklyScheduleTotals = Array(duration).fill(0)

    for(let week = 0; week < duration; week++){
        maintenanceRunCount = 0
        weeklyTotalMileage = 0
        for(let day = 0; day < 7; day++){
            switch(weekInfo[day]){
                case "maintenanceRunStrides":
                    type = "Maintenance Run & Strides"
                    units = "miles"
                    amount = maintenanceRuns[week][maintenanceRunCount++]
                    miles = amount
                    break;
                case "secondaryWorkout":
                    type = secondaryWorkouts[week][0]
                    units = secondaryWorkouts[week][2]
                    amount = secondaryWorkouts[week][1]
                    miles = secondaryWorkouts[week][3]
                    break
                case "primaryWorkout":
                    type = primaryWorkouts[week][0]
                    units = primaryWorkouts[week][2]
                    amount = primaryWorkouts[week][1]
                    miles = primaryWorkouts[week][3]
                    break
                case "longRun":
                    type = "Long Run"
                    units = "miles"
                    amount = longRuns[week]
                    miles = amount
                    break
                default:
                    type = "Rest Day"
                    units = ""
                    amount = ""
                    miles = 0
            }
            weeklySchedule[week][day] = [type, amount, units]
            // weeklyTotalMileage += +miles
            weeklyTotalMileage += units === "miles" ? +amount : +amount / pace
        }
        //add in the warm up and cool downs 
        weeklyTotalMileage += weeklyMileage[week][2] * 2 / pace + weeklyMileage[week][3] * 2 / pace
        weeklyScheduleTotals[week] += Math.round(weeklyTotalMileage)
    }
    return [weeklySchedule, weeklyScheduleTotals]
}



app.listen(process.env.PORT || PORT, ()=>{ 
    console.log(`Server running on port ${PORT}`)
})