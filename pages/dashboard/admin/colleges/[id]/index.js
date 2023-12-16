import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import crypto from "crypto";
import { useCollege } from "../../../../../src/hooks/useCollege";
import { toast } from "react-toastify";
import axios from "axios";
import { rename } from "../../../../../src/lib/helper";
import moment from "moment";
import { useResumeContext } from "../../../../../src/context/ResumeContext";

const Index = ({ id ,displayDetails,payment,numberOfStudentsRegistered}) => {

  const { college, isError, isLoading } = useCollege(id);

  const [excelFileError, setExcelFileError] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [students, setStudents] = useState([]);
  const { modules, setmodules } = useResumeContext();
  const [module, setmodule] = useState()
  const [template , setTemplate] =useState()
  const [orderId, setorderId] = useState()
  const [numberOfStudents, setnumberOfStudents] = useState()
  const fileType = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];


  const currentDate = new Date();
  var allModules = [];
  var flag = false;

  setmodules(payment.history[0].modules); 

  // setorderId(payment.orderId)
  const collegeOrderId = payment.orderId
  
  const [display,setdisplay] = useState(displayDetails[0].payment.history);
  
  // display.shift();
     const getNoofdays = (old_date) => {
          const year = old_date?.slice(0,4);
          const month = old_date?.slice(5,7);
          const day = old_date?.slice(8,10);
          var dateObj = new Date();
          var mnow = dateObj.getUTCMonth() + 1;
          var dnow = dateObj.getUTCDate();
          var ynow = dateObj.getUTCFullYear()
  
          var a = moment([year, month, day]);
          var b = moment([ynow,mnow,dnow]);
          var k = (a.diff(b, 'days')) 
          if(k>0)
          {
            return k
          }
          return "0"
     }

    async function removeModule(item){
        // await axios
        const data =   await axios.delete(`/api/college/module?module=${item}&orderId=${collegeOrderId}`)
        

    }   


    async function addModule(){
        // await axios
        const data =   await axios.post(`/api/college/module?module=${module}&orderId=${collegeOrderId}`)
        

    }   
    async function addTempalte(){
        // await axios
        const data =   await axios.post(`/api/college/template?name=${template}&orderId=${collegeOrderId}`)
        const m =   await axios.post(`/api/college/module?module=standardTemplate&orderId=${collegeOrderId}`)

    }   


    async function changeOrderId(){
      
      const data = await axios.post("/api/college/details/orderId",{
        orderId,
        id
      }) 

     
    }


    async function changeNumberOfStudents(){
      
      const data = await axios.post("/api/college/students/studentCount",{
        id,
        numberOfStudents
      }) 

     
    }




  const getName = (name) => {
    let studentName = {
      firstName: "",
      middleName: "",
      lastName: "",
    };
    if (name.length === 1) {
      studentName.firstName = name[0];
    } else if (name.length === 2) {
      studentName.firstName = name[0];
      studentName.lastName = name[1];
    } else if (name.length === 3) {
      studentName.firstName = name[0];
      studentName.middleName = name[1];
      studentName.lastName = name[2];
    } else {
      studentName.firstName = name[0];
      studentName.middleName = name[2];
      for (let i = 2; i < name.length; i++) {
        studentName.lastName += name[i];
      }
    }
    return studentName;
  };

  const getPercentage = (percentage) => {
    if (!percentage) return "";
    let n = percentage.length;
    if (percentage[n - 1] === "%") return percentage.substring(0, n - 1);
    return percentage;
  };

  const getCampus = (campus) => {
    return campus.split(" Campus")[0];
  };

  const handleFile = (e) => {
    if (!college) return;
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          if (e.target.result !== null) {
            const workbook = XLSX.read(e.target.result, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const res = data.map((x) => {
              const name = x["Name of Student"].split(" ");
              const studentName = getName(name);
              // new Date(
              //   Date.UTC(
              //     x["Date of Birth"].split("-")[0],
              //     x["Date of Birth"].split("-")[1],
              //     x["Date of Birth"].split("-")[2]
              //   )
              // )
              return {
                email: x["Email Id"].toLowerCase().trim() ?? null,
                detailsAvailable: true,
                academicsAvailable: true,
                profile: {
                  ...studentName,
                  gender: x["Gender"] ?? null,
                  dob: x["Date of Birth"] ?? null,
                  verified: false,
                  frozen: false,
                },
                approved: true,
                category: "student",
                rollNumber: {
                  value: x["Roll No"].toUpperCase() ?? null,
                  frozen: false,
                  verified: false,
                },
                college: {
                  name: college.collegeName,
                  campus: getCampus(x["College"].split(" - ")[1].trim()),
                  program: x["Program"],
                  specialisation: x["Specialisation"],
                  code: college._id,
                },
                phone: {
                  value: x["Phone Number"] ?? null,
                  frozen: false,
                  verified: false,
                },
              };
            });
            setStudents(res);
          } else {
            setStudents([]);
          }
        };
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
    }
  };

  const handleCreate = async () => {
    let total = students.length,
      createdCount = 0;
    const failedAccounts = [];
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      try {
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto
          .pbkdf2Sync("Provast@123", salt, 1000, 64, "sha512")
          .toString("hex");
        await axios.post("/api/auth/user/details", {
          ...s,
          hash,
          salt,
        });
        createdCount += 1;
      } catch (e) {
        failedAccounts.push({
          account: s,
          reason: e.response.data.message,
        });
      }
    }
    if (total === createdCount) {
      toast.success("All Users Are Successfully Created!");
    } else {
      toast.error(
        "Account creation failed for " + failedAccounts.length + " Students."
      );
    }
  };

  const handleEducation = (e) => {
    if (!college) return;
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          if (e.target.result !== null) {
            const workbook = XLSX.read(e.target.result, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const res = data.map((x) => {
              return {
                rollNumber: x["Roll No"] ?? "",
                education: [
                  {
                    institution: college.collegeName,
                    program: x["Program"].toUpperCase().trim() ?? "",
                    branch: x["Specialisation"] ?? "",
                    educationType: "Full Time",
                    score: {
                      typeOfGrade: "CGPA",
                      grade: x["Current course CGPA"] ?? 0,
                    },
                    batch: {
                      from: 2020,
                      to: 2023,
                    },
                    current: true,
                    verified: false,
                    frozen: false,
                  },
                  {
                    institution: x["UG School/College"],
                    program: x["UG Program"] ?? "",
                    board: x["UG Board/University"] ?? "",
                    branch: x["UG Branch/Specialization"]
                      ? rename(x["UG Branch/Specialization"]).trim()
                      : "",
                    educationType: "Full Time",
                    score: {
                      typeOfGrade: "Percentage",
                      grade: x["UG percentage"] ?? 0,
                    },
                    batch: {
                      from: 2018,
                      to: 2020,
                    },
                    current: false,
                    verified: false,
                    frozen: false,
                  },
                  {
                    institution: x["Class 12 School"],
                    program: "Class XIIth",
                    board: x["Class 12 Board"] ?? "",
                    educationType: "Full Time",
                    score: {
                      typeOfGrade: "Percentage",
                      grade: x["Class 12 %"] ?? 0,
                    },
                    batch: {
                      from: 0,
                      to: 2016,
                    },
                    current: false,
                    verified: false,
                    frozen: false,
                  },
                  {
                    institution: x["Class 10 School"],
                    program: "Class Xth",
                    board: x["Class 10 Board"] ?? "",
                    educationType: "Full Time",
                    score: {
                      typeOfGrade: "Percentage",
                      grade: x["Class 10 %"] ?? 0,
                    },
                    batch: {
                      from: 0,
                      to: 2014,
                    },
                    current: false,
                    verified: false,
                    frozen: false,
                  },
                ],
              };
            });
            setStudents(res);
          } else {
            setStudents([]);
          }
        };
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
    }
  };
  const handleEducationCreate = async () => {
    let total = students.length,
      createdCount = 0;
    const branch = new Set();
    const failedAccounts = [];
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      try {
        await axios.post("/api/auth/user/academics", {
          ...s,
        });
        createdCount += 1;
        branch.add(s.education.branch);
      } catch (e) {
        if (e.response.data.message !== "Details Already Exists") {
          failedAccounts.push({
            account: s,
            reason: e.response.data.message,
          });
        }
      }
    }
    if (total === createdCount) {
      toast.success("All Users Are Successfully Created!");
    } else {
      toast.error(
        "Account creation failed for " + failedAccounts.length + " Students."
      );
    }
  };

  const handlePayment = (e) => {
    if (!college) return;
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          if (e.target.result !== null) {
            const workbook = XLSX.read(e.target.result, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            let res = [];
            data.forEach((x) => {
              res.push({
                user: Math.floor(Math.random() * 100000) + "",
                amount:
                  x["total payment amount"] !== "On Campus Paid"
                    ? Number(x["total payment amount"])
                    : 7500,
                email: x["Email Id"].toString().trim().toLowerCase(),
                address: {
                  country: "India",
                  postal: "500035",
                },
                phone: x["Phone Number"] + "",
              });
            });
            setStudents(res);
          } else {
            setStudents([]);
          }
        };
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
    }
  };
  const handlePaymentCreate = async () => {
    let total = students.length,
      createdCount = 0;
    const failedAccounts = [];
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      try {
        await axios.put("/api/payment/crt", {
          ...s,
        });
        createdCount += 1;
      } catch (e) {
        // if (e.response.data.message !== "Details Already Exists") {
        failedAccounts.push({
          account: s,
          reason: e.response.data.message,
        });
        // }
      }
    }
    if (total === createdCount) {
      toast.success("All Payments Are Successfully Created!");
    } else {
      toast.error(
        "Payment creation failed for " + failedAccounts.length + " Students."
      );
    }
  };

  const handlePlaced = (e) => {
    if (!college) return;
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFileError(null);
          if (e.target.result !== null) {
            const workbook = XLSX.read(e.target.result, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const res = data.map((x) => {
              return {
                rollNumber: x["Roll Number"],
                placed: x["Placed"],
              };
            });
            alert(123);
            setStudents(res);
          } else {
            setStudents([]);
          }
        };
      } else {
        setExcelFileError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
    }
  };

  const handlePlacedStudent = async () => {
    let total = students.length,
      createdCount = 0;
    const failedAccounts = [];
    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      try {
        await axios.put("/api/auth/user/placed", {
          ...s,
        });
        createdCount += 1;
      } catch (e) {
        // if (e.response.data.message !== "Details Already Exists") {
        failedAccounts.push({
          account: s,
          reason: e.response.data.message,
        });
        // }
      }
    }
    if (total === createdCount) {
      toast.success("Placed status have been updated for all!");
    } else {
      toast.error(
        "Payment creation failed for " + failedAccounts.length + " Students."
      );
    }
  };
  return (
    <div className="pt-[10vh]">
      {/* <div className="pt-[14vh]  sm:container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Payment History</h1>
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-orange-500  text-white text-base">
                    <th className="px-6 py-3 text-left font-medium  uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Expiry Date</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Days Left</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left  font-medium  uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white  divide-gray-300 ">
                 {display?.length > 1 ? display.map((item)=>{
                    return(
                    <tr className='border-b border-gray-500'>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-red-400">{item.paymentId}</td>
                        <td className="px-6 py-4 whitespace-nowrap  text-gray-800">{item.expiryDate?.slice(0,10)}</td>
                        <td className="px-6 py-4 whitespace-nowrap  text-gray-800">{getNoofdays(item.expiryDate)} Days </td>
                        <td className="px-6 py-4 whitespace-nowrap  text-gray-800">{item.plan}</td>
                        <td className="px-6 py-4 whitespace-nowrap  text-gray-800">₹{item.amount}</td>
                        {getNoofdays(item.expiryDate) > 0 ? <td className="px-6 py-4 whitespace-nowrap text-green-500">Active</td> : <td className="px-6 py-4 whitespace-nowrap text-red-500">Expired</td>} 
                    </tr>
                    )
                 }) : <tr>
                        <td></td><td></td><td>No Payment History Found</td>
                  </tr>}
            </tbody>
        </table>
    </div> */}

    <div>
      <h1 className="text-2xl font-semibold text-center my-5">All Modules</h1>
      {modules && (
        <div className="grid sm:grid-cols-2 grid-cols-1 mx-auto sm:container gap-[1px] ">
          {
        modules.map((item)=>(
          <div>
              <div className="flex justify-center border shadow-lg py-3 px-6"> 
                <span className="mx-4 grow" >{item}</span>
                <button onClick={()=>{removeModule(item)}} className="bg-transparent hover:bg-red-500 text-red-700 font-medium hover:text-white py-1 px-4 border border-red-500 hover:border-transparent rounded text-xs">Delete</button>
              </div>
          </div>
        ))
      }
        </div>
      )}
    </div>

      <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 sm:container mx-auto my-5">
    <div className="my-2 ">
      <div className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Add Module</div>
        <div className="flex gap-2">
        <input type="text" className="focus:ring-0 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500" name="module" id="module"  value={module}  onChange={(e)=>{setmodule(e.currentTarget.value)}}/>
        <button onClick={addModule} className="bg-orange-500 hover:bg-orange-700 text-white font-medium m-1 px-3 rounded">Submit</button>
        </div>
    </div>


    <div className="my-2">
       <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"> Number Of Students :  </p>
       <div className="flex gap-2">
        <input type="text" className="focus:ring-0 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500" name="numberOfStudents" id="numberOfStudents"  value={numberOfStudents}  onChange={(e)=>{setnumberOfStudents(e.currentTarget.value)}}/>
        <button onClick={changeNumberOfStudents} className="bg-orange-500 hover:bg-orange-700 text-white font-medium m-1 px-3 rounded">Submit</button>
        </div>
    </div>



    <div className="my-2">
      <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">order Id </p>
      <div className="flex gap-2">
      <p>{payment.history.orderId}</p>
      {/* <form action="/api/college/details/orderId" method="POST"> */}
        <input type="text" className="focus:ring-0 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500" name="user" id="user" value={id}  onChange={()=>{}}/>
        <input type="text" className="focus:ring-0 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500" name="orderId" id="orderId"  value={orderId}  onChange={(e)=>{setorderId(e.currentTarget.value)}}/>
        <button onClick={changeOrderId} className="bg-orange-500 hover:bg-orange-700 text-white font-medium m-1 px-3 rounded">Submit</button>
        </div>
      {/* </form> */}
    </div>
    </div>
    <div className="my-2 w-[50%] mx-24">
      <div className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Add Template Name</div>
        <div className="flex gap-2">
        <input type="text" className="focus:ring-0 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-500" name="module" id="module"  value={template}  onChange={(e)=>{setTemplate(e.currentTarget.value)}}/>
        <button onClick={addTempalte} className="bg-orange-500 hover:bg-orange-700 text-white font-medium m-1 px-3 rounded">Submit</button>
        </div>
    </div>

      <div className="sm:container mx-auto grid sm:grid-cols-2 mb-8 gap-2">
        
      <div className="my-2">
        
          <label
            htmlFor="photo"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Upload Spreadsheet
          </label>
          <div className="flex gap-2">
          <input
            className=" appearance-none block w-full p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            label="Choose File"
            type="file"
            name="image"
            id="profileImg"
            onChange={handleFile}
          />
          {excelFileError &&
            toast.error(excelFileError, {
              toastId: excelFileError,
            })}
        
        <button onClick={handleCreate} className="bg-transparent hover:bg-orange-500 text-orange-700 font-medium hover:text-white border border-orange-500 hover:border-transparent rounded m-1 px-3 text-sm">Create</button>
        </div>
      </div>

      <div className="my-2">
      
          <label
            htmlFor="photo"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Upload Spreadsheet
          </label>
            <div className="flex">
          <input
            label="Choose File"
            className=" appearance-none block w-full p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            type="file"
            name="image"
            id="profileImg"
            onChange={handleEducation}
          />
          {excelFileError &&
            toast.error(excelFileError, {
              toastId: excelFileError,
            })}
        
        <button onClick={handleEducationCreate} className="w-[30%] bg-transparent hover:bg-orange-500 text-orange-700 font-medium hover:text-white border border-orange-500 hover:border-transparent rounded m-1 px-3 text-sm">Create Education</button>
        </div>
      </div>

      <div className="my-2">
        <div className="">
          <label
            htmlFor="photo"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Upload Spreadsheet
          </label>
            <div className="flex gap-2">
          <input
            label="Choose File"
            className=" appearance-none block w-full p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            type="file"
            name="image"
            id="profileImg"
            onChange={handlePayment}
          />
          {excelFileError &&
            toast.error(excelFileError, {
              toastId: excelFileError,
            })}
        
          <button onClick={handlePaymentCreate} className="w-[30%] bg-transparent hover:bg-orange-500 text-orange-700 font-medium hover:text-white border border-orange-500 hover:border-transparent rounded m-1 px-3 text-sm">Create Payment</button>
          </div>
        </div>
      </div>

      <div className="my-2">
        
          <label
            htmlFor="photo"
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >
            Upload Spreadsheet
          </label>
          <div className="flex gap-2">
          <input
            label="Choose File"
            className=" appearance-none block w-full p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            type="file"
            name="image"
            id="profileImg"
            onChange={handlePlaced}
          />
          {excelFileError &&
            toast.error(excelFileError, {
              toastId: excelFileError,
            })}
        
        <button onClick={handlePlacedStudent} className="w-[40%] bg-transparent hover:bg-orange-500 text-orange-700 font-medium hover:text-white border border-orange-500 hover:border-transparent rounded m-1 px-3 text-sm">Update Placed Students</button>
        </div>
      </div>
    
      </div>

    </div>
  );
};

export const getServerSideProps = async ({ req, res, query }) => {
  
  const displayDetails = new Array();
  await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/payment/${query._id}`).then((res) => res.json()).then((res)=>{displayDetails.push(res)})

   const {
    data: { payment },
  } = await axios.get(`${process.env.HOST_URL}/api/payment/${query?._id}`);


  const numberOfStudents =  await axios.get(`${process.env.HOST_URL}/api/college/students/studentCount?user=${query?._id}`)
  
  if(payment){
    const orderId = payment.orderId
    var numberOfStudentsRegistered
    const data = await axios.get(`${process.env.NEXT_PUBLIC_HOST_URL}/api/college/details/orderId?orderId=${orderId}`)
    numberOfStudentsRegistered = data.data.students.length
  }

  return {
    props: {
      id: query._id,
      displayDetails:displayDetails,
      payment:payment,
      numberOfStudentsRegistered:numberOfStudentsRegistered
    },
  };
};

export default Index;
