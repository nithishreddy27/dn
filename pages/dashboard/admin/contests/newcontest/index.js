import Link from 'next/link'
import React from 'react'
import { useReducer, useState } from "react";
import {useRouter} from 'next/router';
import { DropDown} from "../../../../../src/components/Reusables/Dropdown";
import Editor from "../../../../../src/components/Jobs/Editor";
import { eventMode , eventType , participationType } from '../../../../../src/lib/helper';
import { CheckBox } from '../../../../../src/components/Reusables/CheckBox';
import axios from "axios";
import { toast } from "react-toastify";
import {Loading} from '../../../../../src/components/Reusables/Loading'
import { setDate } from 'date-fns';
// https://api.cloudinary.com/v1_1/:cloud_name/:action


const index = () => {
    const [description, setDescription] = useState("");
    const [image,setimage] = useState('');
    const [loading, setloading] = useState(false);
    const handleCallBack = (data) => {
        setDescription(data);
      };


    const {push} = useRouter();

    const handleImageUpload = async (event) => {
        setloading(true);
        const file = event.target.files[0];
        const formD = new FormData();
        formD.append("file", file);
        formD.append("upload_preset", "my_uploads");
    
        const data = await fetch(
          "https://api.cloudinary.com/v1_1/djmhakv9l/image/upload",
          {
            method: "POST",
            body: formD,
          }
        )
          .then((r) => r.json())
          .then((r) => {
            console.log(r.secure_url);
            setimage(r.secure_url);
          });
        setloading(false);
      };

    const [nameOfEvent,setNameOfEvent] = useState('');
    const [organizedBy,setOrganizedBy] = useState('');
    const [dateAndTime ,setDateandTime] = useState('');
    const [teamSize,setTeamSize] = useState('');
    const [imgSrc,setimgSrc] = useState('');
    const [regStartDate,setregStartDate] = useState('');
    const [regEndDate,setregEndDate] = useState('');
    const [regFees,setRegFees] = useState('');
    const [url,setUrl] = useState('');
    const [selectedEvent,setSelectedEvent] = useState(eventType[0]);
    const [selectedEventMode,setSelectedEventMode] = useState(eventMode[0]);
    const [pType,setPType] = useState(participationType[0]);

    const submitHandler = async(e) => {
        e.preventDefault();
        if(!nameOfEvent || !organizedBy || !regStartDate || !regEndDate || !eventMode || !eventType || !participationType || !teamSize || !eventDateandTime || !description || !registrationFees || !image || !webUrl)
        {
            toast.error("Enter all the Details.. All Details are necessary to fill the form");
        }
        setloading(true);
        const data = {
            nameOfEvent:nameOfEvent,
            organizedBy:organizedBy,
            regstartDt: regStartDate,
            regendDt:regEndDate,
            eventMode:selectedEventMode.name,
            eventType:selectedEvent.name,
            participationType:pType.name,
            teamSize:teamSize,
            eventDateandTime:dateAndTime,
            description:description,
            registrationFees:regFees,
            image:image,
            webUrl:url
        }
        console.log(data);
        const r = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/contests`,data);
        console.log(r);
        setloading(false);
        toast.success("Contest Posted");
        push('/dashboard/admin/contests');
    }

  return (
    <div>
        {loading && <Loading />}
        <br/><br/><br/><br/>
        <div>
        <button className="space-x-2 text-orange-500 hover:text-orange-700 cursor-pointer mx-4">
            <Link href="/dashboard/admin/contests">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
                </svg></Link>
        </button>
        <h2 className="text-center text-2xl mb-5"><b>Post the new Contest</b></h2>
        </div>

        {/**********************************   Form Logic Begins ***********************/}


<div className="mx-4 sm:mx-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-[20%]">
        <div className="flex flex-col mb-4">
            <div>Name of the Event</div>
            <input
                type="text"
                id="nameofevent"
                name="nameofevent"
                onChange={(e)=>{setNameOfEvent(e.target.value)}}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                placeholder="Name of the Event"
                required
            />
        </div>

        <div className="flex flex-col mb-4"> 
            <p>conducted by</p>
            <input
                type="text"
                id="organizedBy"
                name="organizedBy"
                onChange={(e)=>{setOrganizedBy(e.target.value)}}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                placeholder="Conducted By"
                required
            />
        </div>

        <div className="flex flex-col mb-4"> 
        <p className="">Event Date and Time</p>
            <input
                type="datetime-local"
                id="eventDateandTime"
                name="eventDateandTime"
                onChange={(e)=>{setDateandTime(e.target.value)}}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                required
            />
             
        </div>

        <div className="flex flex-col mb-4"> 
        <div className="mb-5">Event Type</div>
            <DropDown
                options={eventType}
                selectedOption={selectedEvent}
                setSelectedOption={setSelectedEvent}
            />
             
        </div>
        <div className="flex flex-col mb-4"> 
        <div className="mb-5">Event Mode</div>
            <DropDown
                
                options={eventMode}
                selectedOption={selectedEventMode}
                setSelectedOption={setSelectedEventMode}
            />
            
        </div>
        <div className="flex flex-col mb-4"> 
        <p className="">Participation Type</p>
            <DropDown
                  options={participationType}
                  selectedOption={pType}
                  setSelectedOption={setPType}
            />
             
        </div>
           
        <div className="flex flex-col mb-4"> 
        <p className="">Registration Start Date</p>
            <input
                type="datetime-local"
                id="dateandtime"
                name="dateandtime"
                onChange={(e)=>{setregStartDate(e.target.value)}}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                required
            />
            
        </div>
        <div className="flex flex-col mb-4"> 
        <p className="">Registration End Date</p>
            <input
                type="datetime-local"
                id="dateandtime"
                name="dateandtime"
                onChange={(e)=>{setregEndDate(e.target.value)}}
                className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                required
            />
            
        </div>
        <div className="flex flex-col mb-4"> 
                <div>Team size</div>
               <input type="number"
                      id="teams"
                      name="teamSize"
                      onChange={(e)=>{setTeamSize(e.target.value)}}
                      className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                      placeholder="Team Size"
                required />

            </div>
    </div>
    <center><div className="mx-7 w-1/2 my-8">
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Description
            </label>
            <Editor input={description} dataCallBack={handleCallBack} />
            <p className="mt-2 text-sm text-gray-500">Few lines to describe about the contest</p>
    </div></center>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-20">
        <div className="flex flex-col mb-4"> 
                <input
                    type="number"
                    id="registrationFees"
                    name="registrationFees"
                    onChange={(e)=>setRegFees(e.target.value)}
                    placeholder='Registration Fees'
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                    required
                />
                
            </div>
            <div className="flex flex-col mb-4"> 
                <input
                    type="url"
                    id="webUrl"
                    name="webUrl"
                    onChange={(e)=>{setUrl(e.target.value)}}
                    placeholder='Contest URL  https://examplecontest.com'
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-200 rounded-md"
                    required
                />
                
            </div>

    </div>
    <center><div className = "mx-7 w-1/2 my-8">
        <input
            className="mt-2 appearance-none block w-full p-1 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            label="Choose File"
            type="file"
            name="logo"
            id="logo"
            onChange={handleImageUpload}
        />  
        <small>{image}</small>
    </div> </center>

</div>

<center>
    <div className="mb-10">
        <button className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-xl mb-10" onClick={submitHandler}>Post</button>
    </div>
</center>
            
    </div>
  )
}

export default index