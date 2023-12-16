import connectDB from "../../../src/lib/connectDB"
import User from "../../../models/User";
import Resume from "../../../models/Resume";
import { StudentResume } from "../../../src/components/Resumes/StudentResume";

export default async function handler(req,res){
    const passphrase = req.query.passphrase
    await connectDB()
    var resumes = await Resume.find({"public":true})
    res.send({"gello":"ao"})
}