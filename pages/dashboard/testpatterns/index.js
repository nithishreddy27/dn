import Link from "next/link";
import axios from "axios";
import swal from "sweetalert";
import {useEffect} from'react';
import { useRouter } from "next/router";
import { Loading } from "../../../src/components/Reusables/Loading";
export const getServerSideProps = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/patterns`);
  const status = await data.json();
  return {
    props: { companie: status },
  };
};

import React, { useState }  from "react";

const viewpatterns = ({ companie }) => {
  const { push } = useRouter();
  const [companies, setcompanies] = useState(companie);

  const [loading,setloading]=useState(true);
  
  useEffect(()=>{
     setloading(false);
  },[companies]);

  return (

    <div className=" max-w-2xl min-h-screen mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-4 mt-[12vh] bg-gray-50 ">
         {loading && <Loading />}
      <div className="flex pl-6 py-3 relative ">
        <h1 className="text-3xl py-4 fon font-extralight">Test Patterns</h1>
      </div>


      {/* mt-3 " */}
      <div className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8">
        {companies.filter((company) => company.jobtype === "Service Companies").slice(0,4).map((company) => {
          return (
            <div className="w-full rounded shadow py-4 group relative flex flex-col justify-between">
              <Link
                href={`/dashboard/student/testpatterns/${company.companyname}`}
              >
                 <div className="h-[100%]">
                  <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-75 lg:aspect-none">
                    <img
                      src={company.logo}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                  <div className="py-2 bg-gray-100 my-4 h-[20%] flex space-x-2   relative">
                    <div className="text-lg font-semibold text-gray-700">
                      <span className="pl-3">{company.companyname}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
        
      </div>
      <div className="my-5 mx-auto">
           <center><Link href={"/auth/login"} className="relative"><span className="bg-orange-500 rounded-md hover:bg-orange-600 hover:cursor-pointer absolute  p-3 text-white mt-3  ">Load More</span></Link></center>
        </div>
    </div>
  );
};

export default viewpatterns;