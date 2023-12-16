import {addImagetoCloudinary} from '../../../src/lib/testpatterns'
import connectDB from "../../../src/lib/connectDB";


export default function handler(req,res)
{
    connectDB();
    const method = req.method;
    switch(method)
    {
        case "POST":
            addImagetoCloudinary(req,res);
            break;
        default:
            res.send("Default");
            break;
    }
    
}