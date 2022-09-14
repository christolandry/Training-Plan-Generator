const User = require('../models/User')
const TrainingPlan = require("../models/TrainingPlan");

module.exports = {    
    getIndex: async (req,res)=>{
        try{
            if(req.user) return await TrainingPlan.findOne({userId: req.user.id}) ? res.redirect('/calendar') : res.render('index.ejs')            
            res.render('index.ejs')
        }catch(error){
            console.log(error)
        }
    }
}