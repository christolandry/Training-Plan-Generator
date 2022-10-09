const TrainingPlan = require("../models/TrainingPlan");
const Workouts = require("../models/Workouts");

module.exports = {
    getCalendar: async (request, response) => {
        try{
            const userTrainingPlan = await TrainingPlan.findOne({userId: request.user.id})
            if(!userTrainingPlan) response.redirect('/')
            const data = {
                distance: userTrainingPlan.distance, 
                weeklySchedule: userTrainingPlan.weeklySchedule, 
                weeklyTotals: userTrainingPlan.weeklyTotals, 
                mileage: userTrainingPlan.mileage,
                startDate: userTrainingPlan.startDate,
            }
            response.render('plan.ejs', {userTrainingPlan: data})
        }catch(error){
            console.log(error)
        }
    },
    postGenerateCalendar: async (request, response) =>{
    try{
        //extract user input from request
        const goalDistance = Number(request.body.goalDistance)
        const planDuration = Number(request.body.planDuration)
        const maxMileage = Number(request.body.maxMileage)
        const maxLR = Number(request.body.maxLR)
        const pace = Number(request.body.minutes) + Number(request.body.seconds) / 60
        const week = JSON.parse(request.body.weekSchedule)

        //generate run data.
        let startDate = generateStartDate(request.body.startDate)
        let longRuns = generateLongRuns(planDuration, goalDistance, maxLR)
        let primaryWorkouts = generatePrimaryWorkouts(planDuration, goalDistance, pace, week.runningDays)
        let secondaryWorkouts = generateSecondaryWorkouts(planDuration, goalDistance, pace)
        let weeklyMileage = generateWeeklyMileage(week.runningDays, planDuration, maxMileage, pace, longRuns, primaryWorkouts, secondaryWorkouts)
        let maintenanceRuns = generateMaintenanceRuns(planDuration, weeklyMileage, pace, week.runningDays)
        let weeklySchedule = await generateWeeklySchedule(planDuration, week, longRuns, primaryWorkouts, secondaryWorkouts, maintenanceRuns, weeklyMileage, pace)

        //store data in the database
        await TrainingPlan.create({
            distance: goalDistance,
            weeklySchedule: weeklySchedule[0],
            weeklyTotals: weeklySchedule[1],
            mileage: weeklyMileage,
            startDate: startDate,
            userId: request.user.id,
          });        
        response.redirect("/calendar")
    }catch(error){
        console.log(error)
    }
  },
};

function generateStartDate(enteredDate){
    let startDate = new Date(enteredDate)
    startDate.setDate(startDate.getUTCDate() - startDate.getDay() - 1)
    return startDate
}

function generateLongRuns(duration, race, maxLR){
    //Generate long runs array.
    let longRuns = Array(duration).fill(0)  

    if(duration === 16 && race === 26){
        longRuns[15] = 26.2
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


function generatePrimaryWorkouts(duration, race, pace, runningDays){
    //Generate Primary Workouts.  Note the the two weeks do not have workouts and are replaced by maintenance runs
    //workouts[week][type, duration, units, mileage]
    let workouts = Array(duration)
    if(duration === 12 && race === 26 && runningDays == 4){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"] 
        workouts[2] = ["Fartlek", 20, "min"]
        workouts[3] = ["Tempo", 25, "min"]
        workouts[4] = ["Hills", 30, "min"]
        workouts[5] = ["Fartlek", 32, "min"]
        workouts[6] = ["Tempo", 38, "min"]
        workouts[7] = ["Hills", 45, "min"]
        workouts[8] = ["Tempo", 40, "min"]
        workouts[9] = ["Fartlek", 35, "min"]
        workouts[10] = ["Tempo", 25, "min"]
        workouts[11] = ["Fartlek", 12, "min"]
    }
    if(duration === 12 && race === 26 && runningDays > 4){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Fartlek", 20, "min"]
        workouts[3] = ["Fartlek", 24, "min"]
        workouts[4] = ["Fartlek", 28, "min"]
        workouts[5] = ["Hills", 30, "min"]
        workouts[6] = ["Tempo", 34, "min"]
        workouts[7] = ["Tempo", 38, "min"]
        workouts[8] = ["Tempo", 42, "min"]
        workouts[9] = ["Fartlek", 35, "min"]
        workouts[10] = ["Tempo", 25, "min"]
        workouts[11] = ["Tempo", 18, "min"]
    }
    if(duration === 16 && race === 26 && runningDays == 4){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Fartlek", 20, "min"]
        workouts[3] = ["Tempo", 25, "min"]
        workouts[4] = ["Hills", 30, "min"]
        workouts[5] = ["Fartlek", 32, "min"]
        workouts[6] = ["Tempo", 34, "min"]
        workouts[7] = ["Hills", 45, "min"]
        workouts[8] = ["Progression Run", 45, "min"]
        workouts[9] = ["Fartlek", 50, "min"]
        workouts[10] = ["Progression Run", 50, "min"]
        workouts[11] = ["Fartlek", 55, "min"]
        workouts[12] = ["Tempo", 45, "min"]
        workouts[13] = ["Fartlek", 35, "min"]
        workouts[14] = ["Tempo", 25, "min"]
        workouts[15] = ["Fartlek", 12, "min"]
    }
    if(duration === 16 && race === 26 && runningDays > 4){
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
    if(duration === 20 && race === 26 && runningDays == 4){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Fartlek", 20, "min"]
        workouts[3] = ["Tempo", 25, "min"]
        workouts[4] = ["Hills", 30, "min"]
        workouts[5] = ["Fartlek", 32, "min"]
        workouts[6] = ["Tempo", 34, "min"]
        workouts[7] = ["Hills", 45, "min"]
        workouts[8] = ["Progression Run", 45, ,"miles"]
        workouts[9] = ["Track", 6, "miles"]
        workouts[10] = ["Tempo", 50, "min"]
        workouts[11] = ["Track", 7, "miles"]
        workouts[12] = ["Progression Run", 55, "min"]
        workouts[13] = ["Track", 9, "miles"]
        workouts[14] = ["Track", 8, "miles", ,"tempo"]
        workouts[15] = ["Tempo", 50, "min"]
        workouts[16] = ["Track", 10, "miles"]
        workouts[17] = ["Track", 6, "miles", ,"tempo"]
        workouts[18] = ["Tempo", 25, "min"]
        workouts[19] = ["Fartlek", 12, "min"]
    }
    if(duration === 20 && race === 26 && runningDays > 4){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Fartlek", 20, "min"]
        workouts[3] = ["Fartlek", 24, "min"]
        workouts[4] = ["Fartlek", 28, "min"]
        workouts[5] = ["Hills", 30, "min"]
        workouts[6] = ["Tempo", 34, "min"]
        workouts[7] = ["Tempo", 38, "min"]
        workouts[8] = ["Tempo", 42, "min"]
        workouts[9] = ["Tempo", 45, "min"]
        workouts[10] = ["Track", 6, "miles"]
        workouts[11] = ["Track", 7, "miles"]
        workouts[12] = ["Track", 7, "miles", ,"tempo"]
        workouts[13] = ["Track", 8, "miles"]
        workouts[14] = ["Track", 9, "miles"]
        workouts[15] = ["Track", 8, "miles", ,"tempo"]
        workouts[16] = ["Track", 10, "miles"]
        workouts[17] = ["Tempo", 38, "min"]
        workouts[18] = ["Fartlek", 24, "min"]
        workouts[19] = ["Tempo", 12, "min"]
    }
    //workouts[week][3] is the mileage for that workout as some workouts are denominated in minutes.
    for(let week = 0; week < duration; week++){
        workouts[week][3] = workouts[week][2] === "miles" ? workouts[week][1] : workouts[week][1] / pace
    }
    return workouts
}

function generateSecondaryWorkouts(duration, race, pace, runningDays){
    //Generate Primary Workouts.  Note the the two weeks do not have workouts and are replaced by maintenance runs
    //workouts[week][type, duration, units, mileage]
    let workouts = Array(duration)
    if(duration === 12 && race === 26){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Tempo", 20, "min"]
        workouts[3] = ["Tempo", 24, "min"]
        workouts[4] = ["Tempo", 28, "min"]
        workouts[5] = ["Fartlek", 32, "min"]
        workouts[6] = ["Fartlek", 36, "min"]
        workouts[7] = ["Fartlek", 40, "min"]
        workouts[8] = ["Hills", 45, "min"]
        workouts[9] = ["Tempo", 40, "min"]
        workouts[10] = ["Fartlek", 20, "min"]
        workouts[11] = ["Fartlek", 12, "min"]
    }
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
        workouts[10] = ["Progression Run", 50, "min"]
        workouts[11] = ["Tempo", 50, "min"]
        workouts[12] = ["Progression Run", 45, "min"]
        workouts[13] = ["Track", 6, "miles", ,"tempo"]
        workouts[14] = ["Fartlek", 20, "min"]
        workouts[15] = ["Tempo", 18, "min"]
    }
    if(duration === 20 && race === 26){
        workouts[0] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[1] = ["Maintenance Run", Math.ceil(25/pace), "miles"]
        workouts[2] = ["Tempo", 20, "min"]
        workouts[3] = ["Tempo", 24, "min"]
        workouts[4] = ["Tempo", 28, "min"]
        workouts[5] = ["Fartlek", 32, "min"]
        workouts[6] = ["Fartlek", 36, "min"]
        workouts[7] = ["Fartlek", 40, "min"]
        workouts[8] = ["Fartlek", 45, "min"]
        workouts[9] = ["Hills", 45, "min"]
        workouts[10] = ["Progression Run", 50, "min"]
        workouts[11] = ["Tempo", 50, "min"]
        workouts[12] = ["Progression Run", 55, "min"]
        workouts[13] = ["Hills", 48, "min"]
        workouts[14] = ["Progression Run", 55, "min"]
        workouts[15] = ["Tempo", 55, "min"]
        workouts[16] = ["Progression Run", 45, "min"]
        workouts[17] = ["Track", 6, "miles", ,"tempo"]
        workouts[18] = ["Tempo", 25, "min"]
        workouts[19] = ["Fartlek", 12, "min"]
    }
    //workouts[week][3] is the mileage for that workout as some workouts are denominated in minutes.
    for(let week = 0; week < duration; week++){
        workouts[week][3] = workouts[week][2] === "miles" ? workouts[week][1] : workouts[week][1] / pace
    }
    return workouts
}

function generateWeeklyMileage(runningDays, duration, maxMileage, pace, longRuns, primaryWorkouts, secondaryWorkouts){
    //weeklyMileage: [total miles for the week, miles left for maintenance runs, warm up duration, cool down duration]
    //units are: [miles, miles, min, min]
    let weeklyMileage = Array(duration), milesAccountedFor
    let percents ={
        12: [0.5, 0.64, 0.8, 0.9, 0.96, 0.8, 1, 0.8, 1, 0.9, 0.7, 0.4],
        16: [0.5, 0.56, 0.66, 0.74, 0.8, 0.88, 0.96, 0.8, 1, 0.84, 1, 0.84, 1, 0.8, 0.6, 0.4],
        20: [0.5, 0.56, 0.64, 0.72, 0.8, 0.88, 0.8, 0.96, 0.8, 1, 0.84, 1, 0.84, 1, 0.84, 1, 0.94, 0.8, 0.6, 0.4]
    }

    for(let week = 0; week < duration; week++){
        //Total miles for the week
        total = Math.floor(maxMileage * percents[duration][week])
        //Miles already account for by the: Long Run, Primary Workout, Secondary Workout (runningDays 5+), & Secondary Long Run (runningDays 6+)
        milesAccountedFor = longRuns[week] + primaryWorkouts[week][3] + (runningDays > 4 ? secondaryWorkouts[week][3] : 0) + (runningDays > 5 ? longRuns[week] / 2 : 0)
        //Minutes left over for the warm up and cool down in the week after all runs except for warm ups and cool downs. 
        //total - miles accounted for - scondary long run (runningDays 6+) - maintenance run - 2nd maintenance run  - 3rd maintenance run (runningDays 7)
        let leftOverMinutes = (total   - milesAccountedFor 
                                       - (runningDays > 5 ? longRuns[week] / 2 : 0) 
                                       - Math.floor(25/pace) 
                                       - Math.ceil(25/pace)
                                       - (runningDays > 6 ? Math.floor(25/pace) : 0)) / 2 * pace
        //Warm up is 2/3 of the left over minutes rounded up to a five min increment then subjected to a maximum and a minimum
        let warmUp = Math.ceil((leftOverMinutes * 2 / 3) / 5) * 5
        if(warmUp >= 20) warmUp = 20
        if(warmUp < 10) warmUp = 10
        //Cool down left over minutes after the warm up is taken into account rounded down to a five min increment then subjected to a maximum and a minimum
        let coolDown = Math.floor((leftOverMinutes - warmUp) / 5) * 5
        if(coolDown < 10) coolDown = 10
        if(coolDown > 20) coolDown = 20
                    
        //weeklyMileage: [total miles for the week, miles left for maintenance runs, warm up duration, cool down duration]
        //units are: [miles, miles, min, min]
        weeklyMileage[week] = [total, total - milesAccountedFor - (warmUp * 2 + coolDown * 2) / pace, warmUp, coolDown]  
    }
    return weeklyMileage
}

function generateMaintenanceRuns(duration, weeklyMileage, pace, runningDays){
    let maintenanceRuns = Array(duration)
    
    for(let week = 0; week < duration; week++){
        //If there is under 25 minutes worth of running for each maintenance run in the week, assign minimum amount of running for each maintenance run
        if(weeklyMileage[week][1] < (25 / pace) * (runningDays == 7 ? 3 : 2 )) {
            maintenanceRuns[week] = runningDays === 7 ? [Math.floor(25/pace), Math.ceil(25/pace), Math.floor(25/pace)] : [Math.floor(25/pace), Math.ceil(25/pace)]
        }
        //otherwise divid the remaining miles into two runs rounding down for the first one and up for the second one.
        else{
            if(runningDays === 7) maintenanceRuns[week] = [Math.floor(weeklyMileage[week][1] / 3), Math.ceil(weeklyMileage[week][1] / 3), Math.floor(weeklyMileage[week][1] / 3)]
            else maintenanceRuns[week] = [Math.floor(weeklyMileage[week][1] / 2), Math.ceil(weeklyMileage[week][1] / 2)]
        }
    }
    
    return maintenanceRuns
}

async function generateWeeklySchedule(duration, weekInfo, longRuns, primaryWorkouts, secondaryWorkouts, maintenanceRuns, weeklyMileage, pace){
    //weeklySchedule[week][type of run, amount(# of minutes or miles), unit (minutes or miles), title, innerText]
    let weeklySchedule = Array.from({length: duration}, e => Array(7).fill(0)); 
    let type, units, amount, maintenanceRunCount, weeklyTotalMileage, text, title, currentSWO, currentPWO
    let weeklyScheduleTotals = Array(duration).fill(0)

    for(let week = 0; week < duration; week++){
        maintenanceRunCount = 0
        weeklyTotalMileage = 0
        for(let day = 0; day < 7; day++){
            switch (weekInfo[day]){
                case "maintenanceRunStrides":
                    type = "Maintenance Run & Strides"
                    units = "miles"
                    amount = maintenanceRuns[week][maintenanceRunCount++]
                    title = `${maintenanceRuns[week][maintenanceRunCount - 1]} mile MR`
                    text = `${maintenanceRuns[week][maintenanceRunCount - 1]} mile maintenance run`
                    break;
                case "secondaryWorkout":
                    type = secondaryWorkouts[week][0]
                    units = secondaryWorkouts[week][2]
                    amount = secondaryWorkouts[week][1]
                    //             duration                                      unit                                             type
                    title = `${secondaryWorkouts[week][1]} ${secondaryWorkouts[week][2] === "miles" ? 'mile' : 'min'} ${secondaryWorkouts[week][0] === "Maintenance Run" ? "MR" : secondaryWorkouts[week][0]}`
                    if(secondaryWorkouts[week][0] === "Maintenance Run"){
                        text = `${secondaryWorkouts[week][1]} mile maintenance run`
                    }else{                                                  
                        if(secondaryWorkouts[week][4]) currentSWO = await Workouts.findOne({type: secondaryWorkouts[week][0].toLowerCase(), duration: secondaryWorkouts[week][1], text : {$regex : String(secondaryWorkouts[week][4])}})
                        else currentSWO = await Workouts.findOne({type: secondaryWorkouts[week][0].toLowerCase(), duration: secondaryWorkouts[week][1]})
                        text = currentSWO.text
                    }
                    break
                case "primaryWorkout":
                    type = primaryWorkouts[week][0]
                    units = primaryWorkouts[week][2]
                    amount = primaryWorkouts[week][1]
                    //             duration                                      unit                                             type
                    title = `${primaryWorkouts[week][1]} ${primaryWorkouts[week][2] === "miles" ? 'mile' : 'min'} ${primaryWorkouts[week][0] === "Maintenance Run" ? "MR" : primaryWorkouts[week][0]}`
                    if(primaryWorkouts[week][0] === "Maintenance Run"){
                        text = `${primaryWorkouts[week][1]} mile maintenance run`
                    }else{                                                       
                        if(primaryWorkouts[week][4]) currentPWO = await Workouts.findOne({type: primaryWorkouts[week][0].toLowerCase(), duration: primaryWorkouts[week][1], text : {$regex : String(primaryWorkouts[week][4])}})
                        else currentPWO = await Workouts.findOne({type: primaryWorkouts[week][0].toLowerCase(), duration: primaryWorkouts[week][1]})
                        text = currentPWO.text
                    }
                    break
                case "secondaryLongRun":
                    units = "miles"
                    
                    if(week + 1 == duration){
                        amount = 
                        type = "Maintenance Run"
                        title = `${maintenanceRuns[week][0]} mile MR`
                        text = `No Secondary Long Run on race week. Enjoy!`
                    }else{
                        amount = longRuns[week] / 2
                        type = "Secondary Long Run"
                        title = `${longRuns[week] / 2} mile SLR`
                        text = `${longRuns[week] / 2} mile secondary long run`
                    }
                    break
                case "longRun":
                    units = "miles"
                    amount = longRuns[week]
                    if(week + 1 == duration){
                        type = "Race"
                        title = `Race ${longRuns[week]} ${units}`
                        text = `Race Day! <br> Good luck!`
                    }else{
                        type = "Long Run"
                        title = `${longRuns[week]} mile LR`
                        text = `${longRuns[week]} mile long run`
                    }
                    break
                default:
                    type = "Rest Day"
                    units = ""
                    amount = ""
                    title = "Rest Day"
                    text = "Rest Day"
            }
            weeklySchedule[week][day] = [type, amount, units, title, text]
            weeklyTotalMileage += units === "miles" ? +amount : +amount / pace
        }
        //add in the warm up and cool downs 
        weeklyTotalMileage += weeklyMileage[week][2] * 2 / pace + weeklyMileage[week][3] * 2 / pace
        weeklyScheduleTotals[week] += Math.round(weeklyTotalMileage)
    }
    return [weeklySchedule, weeklyScheduleTotals]
}