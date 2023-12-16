import connectDB from "../../../src/lib/connectDB";
import contest from '../../../models/contest';
export default async function handler(req,res){
    await connectDB();
    const method = req.method;
    switch(method)
    {
        case "GET":
            const data = await contest.find();
            return res.json(data);
            break;
        case "POST":
            try
            {
                const data = new contest(req.body);
                const status = data.save();
                return res.json({"status":"saved"});
            }
            catch(err)
            {
                return res.json(err);
            }
            break;
        case "PUT":
            break
        case "DELETE":
            // await deleteCompany(req,res);
            break;
        default:
            res.send("Default");
            break;
    }
    
}