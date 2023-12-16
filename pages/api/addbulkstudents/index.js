import connectDB from "../../../src/lib/connectDB";
import User from '../../../models/User';
import Payment from "../../../models/Payment"
import EducationDetails from "../../../models/EducationDetails";
import Personal from "../../../models/Personal";

export default async function handler(req,res){
    connectDB();
    const method = req.method;
    const body = req.body;

  try{
    switch(method) 
    {
        case "POST":
            // const data = await User.insertMany(body.sorted);
            // console.log("data",data)
            for(var i=0 ; i < body.sorted.length ;i++){
                await User.create(body.sorted[i]);
                let userDetails = await User.findOne({email:body.sorted[i].email})
                let userID=userDetails._id
                const payment={user:userID,history:[body.payment[0]],orderId:body.orderId}
                const education = {user:userID,marks:body.education[i].marks}
                const personal = {...body.personal[i],user:userID}
                await Payment.create(payment)
                await EducationDetails.create(education)
                await Personal.create(personal)
            }
            // body.sorted.map(async (user)=>{
            //     let userDetails = await User.findOne({email:user.email})
            //     let userID=userDetails._id
            //     const payment={user:userID,history:[body.payment[0]]}
            //     await Payment.insertMany(payment)
            // })
            
            // return res.json(data);
            return res.json("done");
            break;
        default:
            res.send("Default");
            break;
    }
  }
  catch(error){
    console.log("error",error)
    res.send("error",error)
  }
    
}