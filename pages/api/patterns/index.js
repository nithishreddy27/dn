import {addCompany,getAllPatternsCompany} from '../../../src/lib/testpatterns'
import connectDB from "../../../src/lib/connectDB";

export default async function handler(req,res){
    await connectDB();
    const method = req.method;
    switch(method)
    {
        case "GET":
            await getAllPatternsCompany(req,res);
            break;
        case "POST":
            await addCompany(req,res);
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