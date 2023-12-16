import connectDB from "../../../src/lib/connectDB";

export default async function handler(req, res) {
    const email = req.query.user
    switch (req.method) {
      case "GET":
        await findApiUser(email);
        break;
      
    }
  }



  export async function findApiUser(email) {
    console.log("inside api",email)
    // This is an in memory store for users, there is no data persistence without a proper DB
    // try {
    //   await connectDB();
    //   const data = await User.findOne({ email });
    //   return data;
    // } catch (e) {
    //   return null;
    // }
    return email
  }