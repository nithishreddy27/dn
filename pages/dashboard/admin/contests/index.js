import Link from 'next/link'
import React from 'react'
import {useEffect,useState} from 'react';
import axios from "axios";
import {useRouter} from 'next/router';
import { toast } from "react-toastify";
export const getServerSideProps = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/contests`);
  const status = await data.json();
  return {
    props: { contests: status },
  };
};


const index = ({contests}) => {

  const {push} = useRouter();
  const [data,setdata] = useState(contests);

  const deleteHandler = async(id) => {
    const result = await axios.delete(`${process.env.NEXT_PUBLIC_HOST_URL}/api/contests/${id}`);
    if(result)
    {
      toast.success("Deleted");
      push('/dashboard/admin/contests');
    }
  }

  return (
    <div><br/><br/>
        <div className="mt-20 text-center">
        <Link href="/dashboard/admin/contests/newcontest">
            <a className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 inline-block cursor-pointer">
            Post a New Contest
            </a>
        </Link>
        </div>


        <div className="w-full text-center mt-20 mb-10">
         <h2 className="text-3xl font-semibold">Posted Contests</h2>
        </div>

        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 ml-5">
  {data.map((item, index) => (
    <div
      key={index}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 relative"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-center my-3">{item.nameOfEvent}</h2>
        <small className="text-gray-500">{item.conductedBy}</small>
      </div>
      <div className="flex justify-center space-x-2">
        <Link href={`/dashboard/admin/contests/${item._id}`}>
        <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600" >
          View More
        </button>
        </Link>
        <Link href={`/dashboard/admin/contests/editcontest/${item._id}`}>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Edit
        </button>
        </Link>
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  ))}
</div>




           
        </div>
    </div>
  )
}

export default index