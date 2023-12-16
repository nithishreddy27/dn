import connectDB from "../../../src/lib/connectDB";
import contest from '../../../models/contest';

export default async function handler(req,res){
    connectDB();
    const method = req.method;
    const {contestid} = req.query;
    switch(method)
    {
        case "GET":
            const data = await contest.find({"_id":contestid});
            if(data)
            {
                return res.json(data);
            }
            else
            {
                return res.status(500).json({"Error":"500 Internal Server Error"})
            }
            break;
        case "PUT":
            const result = await contest.updateOne({_id : contestid}, req.body);
            if(result)
            {
                return res.json(result)
            }
            return res.status(500).json({"Error" : "500 Internal Server Error"})
            break
        case "DELETE":
            // if(contestid)
            // {
            //     const status = await contest.deleteOne({_id: contestid });
            //     return res.json(status);
            //     break;
            // }
            // else 
            // {
            //     return res.json({"status":"Contest id is undefined"});
            // }
            break;
        default:
            res.send("Default");
            break;
    }





}