import connectDB from "../../../src/lib/connectDB";
import testdetails from "../../../models/company_test"

export default async function handler(req,res){
    connectDB();
    const method = req.method;
    const {company} = req.query;
    switch(method)
    {
        case "GET":
            const data = await testdetails.find({"companyname":company})
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
            const result = await testdetails.updateOne({companyname : company}, req.body);
            if(result)
            {
                return res.json(result)
            }
            return res.status(500).json({"Error" : "500 Internal Server Error"})
            break
        case "DELETE":
            const status = await testdetails.deleteOne({companyname: company });
            return res.json(status);
            break;
        default:
            res.send("Default");
            break;
    }





}