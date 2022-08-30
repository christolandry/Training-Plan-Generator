// Global Variables

let step = 0, longRun = 0, slr = 0, pwo = 0, swo = 0; runningDays = 0;
let taken = [0,0,0,0,0,0,0];
let week = {}
let days = document.querySelectorAll('.day');
let directions = [
    "To start off, choose which day of the week you want to be your long run day.",
    "Great! Now choose which day you'd like for your harder workout of the week",
    "Next up is selecting a day for your secondary workout",
    "Choose the day for your secondary long run",
    "Choose your regular run days, prioritizing scheduling to avoid two days off in a row",
    "Congrats, now you weekly running schedule."]


document.addEventListener('DOMContentLoaded', function() {    
    document.querySelector("#submitDays").addEventListener('click', firstDirection);
 });

function firstDirection(){
    //Remove the number of running days select and submit.
    document.querySelector("#daysOfRunning").style.display = "none";
    document.querySelector("#submitDays").style.display = "none";
    runningDays = document.querySelector("#daysOfRunning").value;
    //Directions Change
    changeDirections(0);
    //Add an event listener to each element with the class of day that runs addSteps when clicked.
    //If you pass in a function with parameters it will execte immediately, so do an empty function 
    days.forEach((current, dayOfTheWeek) => current.addEventListener('click',() => directionAdder(dayOfTheWeek)))
}

 function directionAdder(i){
    if(runningDays == 4){
        stepsFor4DaysOfRunning(i);
    }else if(runningDays == 5){
        stepsFor5DaysOfRunning(i);
    }else if(runningDays == 6){
        stepsFor6DaysOfRunning(i);
    }else{
        stepsFor7DaysOfRunning(i);
    }
}

function stepsFor4DaysOfRunning(i){
    switch(step){
        case 0:
            setlongRun(i);
            preparePWO(i);
            break;
        case 1:
            if(setPWO(i)) prepareSWO(i);
            break;
        case 2: 
            if(setSWO(i)) prepareMR(i);
            break;
        case 3: 
            if(setMR(i))  {
                restAll();
                passInfoToServer();
            }
            break;
    }
}

function stepsFor5DaysOfRunning(i){
    switch(step){
        case 0:
            setlongRun(i);
            preparePWO(i);
            break;
        case 1:
            if(setPWO(i)) prepareSWO(i);
            break;
        case 2: 
            if(setSWO(i)) prepareMR(i);
            break;
        case 3:
            if(setMR(i)) prepareMR(i);
            break;
        case 4: 
            if(setMR(i)) {
                restAll();
                passInfoToServer();
            }
            break;
    }
}

function stepsFor6DaysOfRunning(i){
    switch(step){
        case 0:
            setlongRun(i);
            preparePWO(i);
            break;
        case 1:
            if(setPWO(i)) prepareSWO(i);
            break;
        case 2: 
            if(setSWO(i)) prepareSecondaryLongRun(i);
            break;
        case 3:
            if(setSecondaryLongRun(i)) prepareMR(i);
            break;
        case 4:
            if(setMR(i)) prepareMR(i);
            break;
        case 5: 
            if(setMR(i))  {
                restAll();
                passInfoToServer();
            }
            break;
    } 
}

function stepsFor7DaysOfRunning(i){
    switch(step){
        case 0:
            setlongRun(i);
            preparePWO(i);
            break;
        case 1:
            if(setPWO(i)) prepareSWO(i);
            break;
        case 2: 
            if(setSWO(i)) prepareSecondaryLongRun(i);
            break;
        case 3:
            if(setSecondaryLongRun(i)) prepareMR(i);
            break;
        case 4:
            if(setMR(i)) prepareMR(i);
            break;
        case 5:
            if(setMR(i)) prepareMR(i);
            break;
        case 6: 
            if(setMR(i, false))  {
                restAll();
                passInfoToServer();
            }
            break;
    }
}

function setlongRun(i){
    //Set day as long run and color it
    changeBlock(i, "00cbff", 'Long Run');
    //Add this day to the taken array, increment step and print the next directions
    increment(i);
    longRun = i;
    week[i] = "longRun"
}

function preparePWO(i){
    //Directions Change
    changeDirections(1);
    //close the day after the long run
    changeBlock(((i + 1) % 7), 'F9E6E6', 'Not this day')
}

function setPWO(i){
    if(days[i].innerHTML == 'Open')
        {
            //Set day as PWO and color it
            changeBlock(i, 'e65b08', 'Primary Workout')
            //Add this day to the taken array, increment step and print the next directions
            increment(i);
            pwo = i;
            week[i] = "primaryWorkout"
            return(true)
        }
    return(false)
}

function prepareSWO(i){
    //Directions Change
    changeDirections(2);
    //close out the day after the workout as long as it's not the long run day
    if(pwo + 1 != longRun) {
        changeBlock(((i + 1) % 7), 'f9e6e6', 'Not this day');
    }
    //close out the day before the workout, can't subtract 1 as it would go negative, adding 6 has the same effect when using the remainder operation.
    changeBlock(((i + 6) % 7), 'f9e6e6', 'Not this day');
}

function setSWO(i){
    if(days[i].innerHTML == 'Open') {
        //Set day as SWO and color it
        changeBlock(i, 'ffff33', "Secondary Workout");
        //Add this day to the taken array, increment step and print the next directions
        increment(i);
        swo = i;
        week[i] = "secondaryWorkout"
        return true
    }
    return false
}

function prepareSecondaryLongRun(i){
    //Directions Change
    changeDirections(3);
    //Set all non-taken days closed
    closeAll(taken);
    //Open days for MR+.  Days not next to a long run.
    openSecondaryLongRun(taken);
}

function setSecondaryLongRun(i){
    if(days[i].innerHTML == 'Open'){
        //Set day as Secondary Long Run
        changeBlock(i, '15D8FF', 'Secondary Long Run');
        //Add this day to the taken array and increment step. 
        increment(i);
        slr = 1;
        week[i] = "secondaryLongRun"
        return true
    }
    return false
}

function prepareMR(i){
    //Directions Change
    changeDirections(4);
    //Set all non-taken days closed
    closeAll(taken);
    //Open up where there are two or more days in a row not taken.
    if(!openMultiple(taken)){
        openAll(taken);
    }
}

function setMR(i, strides = true){
    if(days[i].innerHTML == 'Open') {
        //Set day as regular run and color it
        strides ? changeBlock(i, '87CEFA', 'Regular Run & Strides') : changeBlock(i, '87CEFA', 'Regular Run');
        //Add this day to the taken array and increment step. 
        increment(i);
        openAll(taken);
        week[i] = strides ? "maintenanceRunStrides" : "maintenanceRun"
        return true;
    }
    return false
}



function increment(i){
    taken[i] = 1;
    step++;
}

function changeDirections(i){
    document.querySelector('#question').innerHTML = directions[i];
}

function changeBlock(day, color, text) {
    document.querySelector('#day' + day).innerText = text;
    document.querySelector('#day' + day).style.backgroundColor = "#" + color;
}

function closeAll(taken) {
    for (let k = 0; k < 7; k++) {
        if (taken[k] == 0) changeBlock(k, 'f9e6e6', 'Not this day');
    }
}

function openMultiple(taken) {
    let changed = false;
    for (let k = 0; k < 7; k++){
        if (taken[k] == 0 && taken[((k + 1) % 7)] == 0 && taken[((k + 6) % 7)] == 0){
            changeBlock(k, 'b8d7b5', 'Open');
            changed = true; 
        }
    }
    if (changed) return changed;
    for (let k = 0; k < 7; k++) {
        if (taken[k] == 0 && taken[((k + 1) % 7)] == 0) {
            changeBlock(k, 'b8d7b5', 'Open');
            changeBlock(((k + 1) % 7), 'b8d7b5', 'Open');
            changed = true;
        }
    }
    return changed;
}

function openAll(taken) {
    for (let k = 0; k < 7; k++) {
        if (taken[k] == 0) {
            changeBlock(k, 'b8d7b5', 'Open');
        }
    }
}

function openSecondaryLongRun(taken){
    let changed = false;
    for (let k = 0; k < 7; k++){
        //Open all days that are not nex to the long run or sandwiched between the two workouts
        if (taken[k] == 0 && ((k + 1) % 7) != longRun && ((k + 6) % 7) != longRun && !(((k + 1) % 7) == swo && ((k + 6) % 7) == pwo) && !(((k + 1) % 7) == pwo && ((k + 6) % 7) == swo)){
            changeBlock(k, 'b8d7b5', 'Open');
            changed = true; 
        }
    }
}

function restAll() {
    for (let k = 0; k < 7; k++) {
        if (taken[k] == 0) {
            changeBlock(k, 'CDF0F7', 'Rest Day');
            week[k] = "rest"
        }
    }
    changeDirections(5);
}

function passInfoToServer(){
    let weekSchedule = document.getElementById("weekSchedule")
    week.runningDays = runningDays
    weekSchedule.value = JSON.stringify(week)
    console.log(week)
}