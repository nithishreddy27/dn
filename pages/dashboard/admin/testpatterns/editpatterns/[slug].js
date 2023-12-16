import {useState} from 'react';
import axios from 'axios';
import swal from 'sweetalert'
import {useRouter} from 'next/router';

export async function getServerSideProps({params}) {
    const str2 = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/patterns/${str2}`);
    const status = await data.json();
    return {
      props: {companies : status}
    }
  }


export default function handler({companies}){

    const {push} = useRouter();
    const [fdata,setdata] = useState(companies[0].testsections);
    const[formData,setformData] = useState({
        companyname : companies[0].companyname,
        logo : companies[0].logo,
        rolename : companies[0].rolename,
        jobtype : companies[0].jobtype,
        duration : companies[0].duration,
        overallcutoff : companies[0].overallcutoff
    });


    
    const [count,setcount] = useState(1);
    const [section,setsection] = useState('');
    const [title,settitle] = useState('');
    const [noofques,setques] = useState('');
    const [difficulty,setdiffi] = useState('');
    const [duration,setduration] = useState('');

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        }); 
      };

    const changeBasic = (name,value) => {
        formData[name] = value;
    }
    const setfdata = (value,id,name) => {
        for(var i=0;i<fdata.length;i++)
        {
            if(fdata[i]._id == id)
            {
                fdata[i][name] = value;
            }
        }
    }

    const uploadImage = async (event) => {
        const files = event.target.files;
        console.log("Image Loading");
        if (files.length === 1) {
        const base64 = await convertBase64(files[0]);
        getCloudLink(base64);
        return;
        }   
};


   const handleFinalSubmit = async(e)=>{
       e.preventDefault();
       formData.testsections = fdata;
       const result = await axios.put(`${process.env.NEXT_PUBLIC_HOST_URL}/api/patterns/${companies[0].companyname}`,formData);
       swal("Details Updated");
       push('/dashboard/admin/testpatterns');
   }

   const getCloudLink = async(base64) => {
    const stat = axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/upload`,{
        "url_image":base64
    })
    stat.then((res)=>{
            formData.logo = res.data.url;
        console.log(res);
        console.log("Set of Image")
    }).catch((err)=>{
    })
}

    const handleSection = (e) =>{
        e.preventDefault();
        setcount(count+1);
        fdata.push({
            
            section:section,
            title:title,
            noofques:noofques,
            difficulty:difficulty,
            duration:duration
        });
        setsection('');
        settitle('');
        setques('');
        setdiffi('');
        setduration('');
        
    }



    return (
        <>
           <div>
            <br/><br/><br/>
           <h1 className="text-center text-2xl my-6">Update {companies[0].companyname} Test Patterns</h1>
           <form className="grid lg:grid-cols-3 md:grid-cols-2 pt-6 pb-3 mx-5">
                <div className="input-type px-2 py-2">
                    <input type="text" name="companyname" onChange={(e)=>{changeBasic(e.target.name,e.target.value)}} defaultValue={companies[0].companyname}className="border w-full px-5 py-3 focus:outline-none rounded-md focus:border-gray-500" placeholder="Company"/>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="file" name="logo"  onChange={uploadImage} className="w-full px-5 py-3 focus:outline-none rounded-md focus:border-gray-500 text-center" placeholder="Logo" required/>
                    <p className="text-xs px-5">Upload JPG/JPEG</p>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="rolename" onChange={(e)=>{changeBasic(e.target.name,e.target.value)}} defaultValue={companies[0].rolename} className="border w-full px-5 py-3 focus:outline-none rounded-md focus:border-gray-500" placeholder="Role Name"/>
                </div>
                <div className="input-type px-2 py-2">
                <select
                        name="jobtype"
                        onChange={(e)=>{changeBasic(e.target.name,e.target.value)}}
                        className="browser-default custom-select border py-3 w-full rounded px-5">
                        <option value="">Select Category of Company</option>
                        <option value="Assessment Partners" className="hover:bg-orange-200">Assessment Partner</option>
                        <option value="Service Companies" className="hover:bg-orange-200">Service Companies</option>
                        <option value="Product / Dream Companies" className="hover:bg-orange-200">Product/Dream Company</option>
                        <option value="Product / Super Dream" className="hover:bg-orange-200">Product / Super Dream</option>
                        <option value="FAANG / MAANG" className="hover:bg-orange-200">FAANG / MAANG</option>
                </select>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="duration" onChange={(e)=>{changeBasic(e.target.name,e.target.value)}} defaultValue={companies[0].duration} className="border w-full px-5 py-3 focus:outline-none rounded-md focus:border-gray-500" placeholder="Duration"/>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="overallcutoff" onChange={(e)=>{changeBasic(e.target.name,e.target.value)}} defaultValue={companies[0].overallcutoff} className="border w-full px-5 py-3 focus:outline-none rounded-md focus:border-gray-500" placeholder="Overallcut Off"/>
                </div>

                </form>
           </div>
           {fdata.map((company)=>{
               return (
                <>
                <h1 className="text-center text-xl my-6">{company.section}</h1>
                <form className="grid lg:grid-cols-3 md:grid-cols-2 pt-6 pb-3 mx-5" onSubmit={handleSection}>

                <div className="input-type px-2 py-2">
                    <input type="number" name="section"  defaultValue={company.section} onChange={(e)=>{setfdata(e.target.value,company._id,e.target.name)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="Section"/>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="title"  defaultValue={company.title} onChange={(e)=>{setfdata(e.target.value,company._id,e.target.name)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="title"/>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="noofques"  defaultValue={company.noofques} onChange={(e)=>{setfdata(e.target.value,company._id,e.target.name)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="No of Questions"/>
                </div>
                <div className="input-type px-3 py-2 w-full">
                <select
                    name="difficulty"
                    defaultValue={company.difficulty}
                    onChange={(e)=>{setfdata(e.target.value,company._id,e.target.name)}}
                    className="browser-default custom-select border py-3 px-5 mx-auto">
                    <option selected disabled>Difficulty</option>
                    <option value="Varies" className="hover:bg-orange-200">Varies</option>
                    <option value="Easy" className="hover:bg-orange-200">Easy</option>
                    <option value="Medium" className="hover:bg-orange-200">Medium</option>
                    <option value="Hard" className="hover:bg-orange-200">Hard</option>

                </select>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="duration"  defaultValue={company.duration} onChange={(e)=>{setfdata(e.target.value,company._id,e.target.name)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="Duration"/>
                </div>
                </form>
                </>
               )
           })}
           <div>
           <h3 className=" text-2xl text-gray-500 my-6">Add Test Pattern Section - {fdata.length+1}</h3>


                <form className="grid lg:grid-cols-3 md:grid-cols-2 pt-6 pb-3" onSubmit={handleSection}>

                <div className="input-type px-2 py-2">
                    <input type="number" name="section"  value={section} onChange={(e)=>{setsection(e.target.value)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="Section" required/>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="title"  value={title} onChange={(e)=>{settitle(e.target.value)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="title" required/>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="text" name="noofques"  value={noofques} onChange={(e)=>{setques(e.target.value)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="No of Questions" required/>
                </div>
                <div className="input-type px-3 py-2 w-full">
                    <select
                        onChange={(e)=>{setdiffi(e.target.value)}}
                        className="browser-default custom-select border py-3 px-5">
                        <option selected disabled>Difficulty</option>
                        <option value="Varies" className="hover:bg-orange-200">Varies</option>
                        <option value="Easy" className="hover:bg-orange-200">Easy</option>
                        <option value="Medium" className="hover:bg-orange-200">Medium</option>
                        <option value="Hard" className="hover:bg-orange-200">Hard</option>

                    </select>
                </div>
                <div className="input-type px-2 py-2">
                    <input type="number" name="duration"  value={duration} onChange={(e)=>{setduration(e.target.value)}} className="border w-full px-5 py-3 focus:border-gray-500 rounded-md" placeholder="Duration" required/>
                </div>
                <div className="text-center">
                    <button className="rounded border text-gray-800 border-gray-600 cursor-pointer mt-4 px-4 py-2">Add Section {fdata.length+1}</button>
                </div>
                </form>
           </div>
           <div className="p-3 text-center my-5 mx-5">
             <button className="px-4 py-2 border rounded border-gray-800 text-gray-800 bg-gray-100" onClick={handleFinalSubmit}>Update Patterns</button>
        </div>
        </>
    )


}