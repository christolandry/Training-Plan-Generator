const User = require('../models/User')
const TrainingPlan = require("../models/TrainingPlan");

module.exports = {    
    getIndex: async (req,res)=>{
        try{
            if(req.user) return await TrainingPlan.findOne({userId: req.user.id}) ? res.redirect('/calendar') : res.render('index.ejs', {user: true})            
            res.render('index.ejs', {user: false})
        }catch(error){
            console.log(error)
        }
    }
}