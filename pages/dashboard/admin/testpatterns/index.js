import Link from "next/link";
import axios from "axios";
import swal from "sweetalert";
import { useRouter } from "next/router";
import { GrEdit } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
export const getServerSideProps = async () => {
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/patterns`);
  const status = await data.json();
  return {
    props: { companie: status },
  };
};

import React, { useState } from "react";

const viewpatterns = ({ companie }) => {
  const { push } = useRouter();
  const [companies, setcompanies] = useState(companie);

  const handleDelete = async (cname) => {
    companies = companies.filter((company) => company.companyname != cname);
    const status = await axios.delete(
      `http://localhost:3000/api/patterns/${cname}`
    );
    if (status)
      swal(cname + " Data Deleted", {
        icon: "success",
      });
    push("/dashboard/admin/testpatterns");
  };

  return (
    <div className=" max-w-2xl min-h-screen mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-4 mt-[12vh] bg-gray-50 ">
      <div className="flex pl-6 py-3 relative ">
        <h1 className="text-3xl py-4 fon font-extralight">Test Patterns</h1>
        <div className="pt-5">
          <button className="px-5 py-2 right-16 absolute  border-gray-800 rounded  text-white bg-orange-500 hover:bg-orange-600 mx-2 cursor-pointer">
            <Link href={`/dashboard/admin/testpatterns/addtestpatterns`}>
              Add Company
            </Link>
          </button>
        </div>
      </div>

      {/* mt-3 " */}
      <div className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8">
        {companies.map((company) => {
          return (
            <div className=" w-full rounded shadow py-4 group relative flex flex-col justify-between">
              <Link
                href={`/dashboard/admin/testpatterns/${company.companyname}`}
              >
                <div className="h-[100%]">
                  <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-75 lg:aspect-none">
                    <img
                      src={company.logo}
                      className="w-full h-full object-scale-down  "
                    />
                  </div>
                  <div className="py-2 bg-gray-100 my-4 h-[20%] flex space-x-2   relative">
                    <div className="text-lg font-semibold text-gray-700">
                      <span className="pl-3">{company.companyname}</span>
                    </div>
                    <div className="pt-1 absolute right-1 pl-3 pr-1">
                      <button className="text-gray-400  cursor-pointer">
                        <Link
                          href={`/dashboard/admin/testpatterns/editpatterns/${company.companyname}`}
                        >
                          <GrEdit size="18px" />
                        </Link>
                      </button>
                      <button
                        className="pl-1 text-gray-500 cursor-pointer"
                        onClick={(e) => {
                          handleDelete(company.companyname);
                        }}
                      >
                        <MdDelete size="18px" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default viewpatterns;