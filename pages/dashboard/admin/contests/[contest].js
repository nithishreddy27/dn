import React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUsers, faLink } from '@fortawesome/free-solid-svg-icons';


export async function getServerSideProps({ params }) {
  const ids = params.contest;
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/contests/${ids}`);
  const status = await data.json();
  return {
    props: { contests: status },
  };
}

const Contest = ({ contests }) => {
  const [data, setdata] = useState(contests[0]);
  console.log(data);

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-lg shadow-md relative overflow-hidden mt-20">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-1">
        <h2 className="text-2xl font-bold text-center mb-4 text-orange-500">{data.nameOfEvent} by <small className="text-gray-500">{data.organizedBy}</small></h2>
        <div dangerouslySetInnerHTML={{ __html: data.description }} />
        
      </div>
      <div className="sm:col-span-1 shadow-lg ">
        <div className="relative w-full ">
        <div className="text-center mb-6">
          <a
            href={data.webUrl}
            className="bg-orange-500 text-white py-3 px-6 rounded-full inline-block transform hover:scale-105 transition-transform duration-300 text-xl"
          >
            Apply
          </a>
        </div>
        <div className='flex justify-center '>

          <img
            src={data.image}
            alt="Event Image"
            className=" h-auto rounded-md border"
            />
            </div>
          <div className="grid grid-cols-2 gap-4 mt-6 mx-2 p-5">
            <div className="col-span-2 flex gap-5">
              <div className="font-bold text-black text-lg mb-2">Event Type</div>
              <p className="text-lg text-orange-500">{data.eventType}</p>
            </div>
            <div className="col-span-2 flex gap-5">
              <div className="font-bold text-black text-lg mb-2">Event Mode</div>
              <p className="text-lg text-orange-500">{data.eventMode}</p>
            </div>
            <div className="col-span-2 flex gap-5">
              <div className="font-bold text-black text-lg mb-2">Registration Period</div>
              <p className="text-lg text-orange-500">
                {data.regstartDt.substring(0, 10) + "   " + data.regstartDt.substring(11, 16) + "    "} to {data.regendDt.substring(0, 10) + "   " + data.regendDt.substring(11, 16)}
              </p>
            </div>
            <div className="col-span-2 flex gap-5">
              <div className="font-bold text-black text-lg mb-2">Participation Type</div>
              <p className="text-lg text-orange-500">
                {data.participationType}
              </p>
            </div>
            {data.participationType === "Teams" ? (
              <div className="col-span-2 flex gap-5">
                <div className="font-bold text-black text-lg mb-2">Team Size</div>
                <p className="text-lg text-orange-500"> {data.teamSize}</p>
              </div>
            ) : null}
            <div className="col-span-2 flex gap-5">
              <div className="font-bold text-black text-lg mb-2">Event Date and Time</div>
              <p className="text-lg text-orange-500">
                {data.eventDateandTime}
              </p>
            </div>
            <div className="col-span-2 flex gap-5">
              <div className="font-bold text-black text-lg mb-2">Event Link</div>
              <p className="text-lg text-orange-500">
                <a href={data.webUrl} target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faLink} className="mr-2" />
                  Visit Event
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Contest;
