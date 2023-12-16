const {models,model,Schema} = require("mongoose");

const contestSchema  = new Schema({
    nameOfEvent:{
        type:String,   //checked
        required:true
    },
    organizedBy:{
        type:String,    //checked
        required:true
    },
    regstartDt:{ 
        type:Date,    //checked
        required:true
    },
    regendDt:{
        type:Date,  //checked
        required:true
    },
    eventMode:{   //offline/online/hybrid   chcked
        type:String,
        required:true
    },
    eventType:{    // hackathon / solution challenge etc  checked
        type:String,
        required:true
    },
    participationType:{
        type:String,        //checked
        required:true
    },
    teamSize:{
        type:String,     //checked
        required:true
    },
    eventDateandTime:{
        type:Date     //checked
    },
    description:{
        type:String,
        required:true    //checked
    },
    registrationFees:{
        type:String,   //checked
        required:true
    },
    image:{
        type:String,   //checked
    },
    webUrl:{
        type:String,   //checked
        required:true
    },
    
},{ timestamps: true });


const contestmodel = models.contests || model("contests",contestSchema );

export default contestmodel;