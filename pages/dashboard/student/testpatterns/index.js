import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState,useEffect } from "react";
import { Heading } from "../../../../src/components/Layout/Heading";
import { Loading } from "../../../../src/components/Reusables/Loading";
import { getLoginSession } from "../../../../src/lib/auth";
import { findUser } from "../../../../src/lib/user";
import crypto from "crypto";
import { useResumeContext } from "../../../../src/context/ResumeContext";
import { useModelContext } from "../../../../src/context/ModalContext";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ResumeIndex = ({ user,companies,displayDetails }) => {

  const currentDate = new Date();
  const { setIsOpen, setForm } = useModelContext();
  const { modules ,setmodules } = useResumeContext();
  const [plan, setplan] = useState();
 
  var allModules = [];
  var flag = false;
  console.log("display",displayDetails[0].payment.history)
  displayDetails[0]?.payment.history.map((pay) => {
    if (pay.expiryDate) {
      const expDate = new Date(pay.expiryDate);
      if (expDate > currentDate) {
        pay.modules.map((module) => {
          allModules.push(module);
        });
      }
    }
    else{
      pay.modules.map((module) => {
        allModules.push(module);
        // console.log("payemnt insie",module)
      });
    }
    flag = true;
  });

  useEffect(() => {
    setmodules(allModules);
    // console.log("mod",modules)
    if(allModules?.includes("Premium")){
      setplan("Premium")

    }else{
      if(allModules.includes("Essential")){
        setplan("Essential")
        // plan = "Essientail"
      }
      else{
        if(allModules.includes("Basic")){
          setplan('Basic')
          // plan = "Basic"
        }
        else{
          setplan("Free")
          // plan = "Free"
        }
      }
    }
  }, [flag]);

  console.log(modules)
  // console.log("comp",companies);
  const [tab, setTab] = useState("Assessment Partners");
  const tabs = [
    { name: "Assessment Partners", current: tab === "Assessment Partners" },
    { name: "Service Companies", current: tab === "Service Companies" },
    { name: "Product/Dream Companies", current: tab === "Product/Dream Companies" },
    { name: "Product/Super Dream", current: tab === "Product/Super Dream" },
    { name: "FAANG/MAANG", current: tab === "FAANG/MAANG" },
  ];
  const router = useRouter();
  const [loading,setloading] = useState(false);

  return (
    <React.Fragment>
      <Head>
        <title>Test Patterns</title>
        <meta name="description" content="Get your resume ready for free." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && <Loading />}


      {(
        <main className="px-8 relative mt-[10vh]">
          <h1 className="text-center pt-10 text-lg tracking-tight font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Test Patterns
          </h1>
          <Heading
            description={`${
              tab === "Service Companies"
                ? "Get Access to Test Patterns of all Different Kind of Companies."
                : tab === "Assessment Partners"
                ? "Get Access to Test Patterns of all Different Kind of Companies."
                : tab === "Product/Dream Companies"
                ? "Get Access to Test Patterns of all Different Kind of Companies."
                : tab === "Product/Super Dream"
                ? "Get Access to Test Patterns of all Different Kind of Companies."
                : tab === "FAANG/MAANG"
                ? "Get Access to Test Patterns of all Different Kind of Companies."
                : ""
            } `}
          />
          {/* Tabs */}
          <div className="my-10">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>
              {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
              <select
                id="tabs"
                name="tabs"
                className="block w-full focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
                value={tabs.find((tab) => tab.current).name}
                onChange={(e) => setTab(e.target.value)}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      onClick={() => setTab(tab.name)}
                      className={classNames(
                        tab.current
                          ? "border-[#ef481d] text-[#ef481d] bg-gray-100 rounded-t-md"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                        "w-1/4 py-4 px-1 text-center border-b-2 font-medium text-md cursor-pointer"
                      )}
                      aria-current={tab.current ? "page" : undefined}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <section className="my-10">
            {tab === "Service Companies" && (
                <div
                data-aos="fade-up"
                className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8"
              >
                {companies.filter((company) => company.jobtype === "Service Companies").sort((a, b) => a.companyname.localeCompare(b.companyname)).map((product,index) => (
                  
                         <div className={`w-25 h-25 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-46 lg:h-50 xl:w-56 xl:h-60 rounded shadow-md py-6 group relative flex flex-col justify-between cursor-pointer ${
                          plan=="Free" ? "hover:shadow-lg" : "relative"
                        }`}
                         onClick={()=>{
                          if(plan == "Free"){
                            setForm("paymentForm")
                            setIsOpen(true)
                            return;
                          }
                          else{
                            router.push(`/dashboard/student/testpatterns/${product.companyname}`)
                          }
                        }}>
                         
                           <div className="h-[100%]">
                            {plan=="Free" && (
                              <div className="absolute z-10 top-[43%] right-[43%] flex items-center justify-center h-10 w-10 bg-gray-900 bg-opacity-70 rounded-full p-1 ">
                                {/* {console.log(template.heading)} */}
                                <VscLock size={20} color="white" />
                              </div>
                            )}
                             <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-90 lg:aspect-none">
                               <img
                                 src={product.logo}
                                 className="w-full h-full object-scale-down  "
                               />
                             </div>
                             <div className="text-lg text-center font-semibold text-gray-700 my-2">
                               <br/>
                               <span className="">{product.companyname}</span>
                             </div>
                           </div>
                           
                           </div>
                         
                ))}
              </div>
              
            )}
            {tab === "Assessment Partners" && (
             <div
             data-aos="fade-up"
             className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8"
           >
                 {companies.filter((company) => company.jobtype === "Assessment Partners").sort((a, b) => a.companyname.localeCompare(b.companyname)).map((product,index) => (
                      <div className="w-25 h-25 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-46 lg:h-50 xl:w-56 xl:h-60 rounded shadow-md py-6 group relative flex flex-col justify-between cursor-pointer">
                        <Link
                      href={`/dashboard/student/testpatterns/${product.companyname}`}  
                      >
                        <div className="h-[100%]">
                          <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-90 lg:aspect-none">
                            <img
                              src={product.logo}
                              className="w-full h-full object-scale-down  "
                            />
                          </div>
                          <div className="text-lg text-center font-semibold text-gray-700 my-2">
                            <br/>
                            <span className="">{product.companyname}</span>
                          </div>
                        </div>
                        </Link>
                    </div>
                ))}
              </div>
            )}
            {tab === "Product/Dream Companies" && (
                <div
                data-aos="fade-up"
                className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8"
              >
                    {companies.filter((company) => company.jobtype === "Product/Dream Companies").sort((a, b) => a.companyname.localeCompare(b.companyname)).map((product,index) => (
                         <div className={`w-25 h-25 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-46 lg:h-50 xl:w-56 xl:h-60 rounded shadow-md py-6 group relative flex flex-col justify-between cursor-pointer ${
                          (plan=="Basic" || plan=="Free") ? "hover:shadow-lg" : "relative"
                        }`}
                         onClick={()=>{
                          if(plan == "Free" || plan=="Basic"){
                            setForm("paymentForm")
                            setIsOpen(true)
                            return;
                          }
                          else{
                            router.push(`/dashboard/student/testpatterns/${product.companyname}`)
                          }
                        }}>
                        
                           <div className="h-[100%]">
                           {(plan=="Free" || plan=="Basic") && (
                              <div className="absolute z-10 top-[43%] right-[43%] flex items-center justify-center h-10 w-10 bg-gray-900 bg-opacity-70 rounded-full p-1 ">
                                {/* {console.log(template.heading)} */}
                                <VscLock size={20} color="white" />
                              </div>
                            )}
                             <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-90 lg:aspect-none">
                               <img
                                 src={product.logo}
                                 className="w-full h-full object-scale-down"
                               />
                             </div>
                             <div className="text-lg text-center font-semibold text-gray-700 my-2">
                               <span className="">{product.companyname}</span>
                             </div>
                           </div>
                           
                         
                       </div>
                   ))}
                 </div>
            )}
            {tab === "Product/Super Dream" && (
                 <div
                 data-aos="fade-up"
                 className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8"
               >
                     {companies.filter((company) => company.jobtype === "Product/Super Dream").sort((a, b) => a.companyname.localeCompare(b.companyname)).map((product,index) => (
                          <div className={`w-25 h-25 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-46 lg:h-50 xl:w-56 xl:h-60 rounded shadow-md py-6 group relative flex flex-col justify-between cursor-pointer ${
                            (plan=="Free" || plan=="Basic" || plan=="Essential") ? "hover:shadow-lg" : "relative"
                          }`}
                          onClick={()=>{
                            if(plan == "Free" || plan=="Basic" || plan=="Essential"){
                              setForm("paymentForm")
                              setIsOpen(true)
                              return;
                            }
                            else{
                              router.push(`/dashboard/student/testpatterns/${product.companyname}`)
                            }
                          }}
                          >
                         
                            <div className="h-[100%]">
                            {(plan=="Free" || plan=="Basic" || plan=="Essential") && (
                              <div className="absolute z-10 top-[43%] right-[43%] flex items-center justify-center h-10 w-10 bg-gray-900 bg-opacity-70 rounded-full p-1 ">
                                {/* {console.log(template.heading)} */}
                                <VscLock size={20} color="white" />
                              </div>
                            )}
                              <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-90 lg:aspect-none">
                                <img
                                  src={product.logo}
                                  className="w-full h-full object-scale-down"
                                />
                              </div>
                              <div className="text-lg text-center  font-semibold text-gray-700 my-2 ">
                                <br/>
                                <span className="">{product.companyname}</span>
                              </div>
                            </div>
                            
                         
                        </div>
                    ))}
                  </div>
            )}
            {tab === "FAANG/MAANG" && (
                 <div
                 data-aos="fade-up"
                 className="mt-3 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8"
               >
                     {companies.filter((company) => company.jobtype === "FAANG/MAANG").sort((a, b) => a.companyname.localeCompare(b.companyname)).map((product,index) => (
                          <div className={`w-25 h-25 sm:w-30 sm:h-30 md:w-35 md:h-35 lg:w-46 lg:h-50 xl:w-56 xl:h-60 rounded shadow-md py-6 group relative flex flex-col justify-between cursor-pointer ${
                            (plan=="Free" || plan=="Basic" || plan=="Essential") ? "hover:shadow-lg" : "relative"
                          }`}
                          onClick={()=>{
                            if(plan == "Free" || plan=="Basic" || plan=="Essential"){
                              setForm("paymentForm")
                              setIsOpen(true)
                              return;
                            }
                            else{
                              router.push(`/dashboard/student/testpatterns/${product.companyname}`)
                            }
                          }}>
                          
                            <div className="h-[100%]">
                            {(plan=="Free" || plan=="Basic" || plan=="Essential") && (
                              <div className="absolute z-10 top-[43%] right-[43%] flex items-center justify-center h-10 w-10 bg-gray-900 bg-opacity-70 rounded-full p-1 ">
                                <VscLock size={20} color="white" />
                              </div>
                            )}
                              <div className="bg-white h-[80%] aspect-w-1 aspect-h-1 rounded-md overflow-hidden opacity-80 group-hover:opacity-90 lg:aspect-none">
                                <img
                                  src={product.logo}
                                  className="w-full h-full object-scale-down"
                                />
                              </div>
                              <div className="text-lg text-center font-semibold text-gray-700 my-2">
                                <br/>
                                <span className="">{product.companyname}</span>
                              </div>
                            </div>
                          
                        </div>
                    ))}
                  </div>
            )}
          </section>
        </main>
      )}
      <style jsx>{`
        .box {
          position: relative;
          border-radius: 5px;
          width: 250px;
          height: 45vh;
          margin-top: 30px;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          transition: background 0.5s ease;
        }

        .box:hover .overlay {
          display: block;
          background: rgba(0, 0, 0, 0.7);
        }

        .box:hover .overlay-create {
          display: block;
          background: rgba(0, 0, 0, 0.7);
        }

        .box-image {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
        }

        .title {
          position: absolute;
          width: 100%;
          left: 0;
          top: 42%;
          font-weight: 700;
          font-size: 30px;
          text-align: center;
          text-transform: uppercase;
          color: white;
          z-index: 1;
          transition: top 0.5s ease;
        }

        .title-create {
          position: absolute;
          width: 100%;
          left: 0;
          top: 42%;
          font-weight: 700;
          font-size: 30px;
          text-align: center;
          text-transform: uppercase;
          color: gray;
          z-index: 1;
          transition: top 0.5s ease;
        }

        .box:hover .title {
          top: 30%;
        }

        .box:hover .title-create {
          top: 30%;
        }

        .button {
          position: absolute;
          width: 100%;
          left: 0;
          top: 60%;
          text-align: center;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .button a {
          width: 70%;
          padding: 12px 48px;
          text-align: center;
          color: white;
          border: solid 2px white;
          z-index: 1;
        }

        .box:hover .button {
          opacity: 1;
        }
      `}</style>
    </React.Fragment>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const session = await getLoginSession(req);
  const user = (session?._doc && (await findUser(session._doc))) ?? null;


  
  const defaultPassword = "Provast@123";
  const inputHash = crypto
    .pbkdf2Sync(defaultPassword, user.salt, 1000, 64, "sha512")
    .toString("hex");
  const passwordsMatch = user.hash === inputHash;
  if (passwordsMatch) {
    return {
      redirect: {
        destination: "/dashboard/student/profile/changePassword",
        permanent: false,
      },
    };
  }
  const data = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/patterns`);
  const status = await data.json();
  const displayDetails = new Array();
  await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/payment/${user._id}`)
    .then((res) => res.json())
    .then((res) => {
      displayDetails.push(res);
    });
  return {
    props: {
        user: JSON.stringify(user),
        companies : status,
        displayDetails:displayDetails
    },
    };
};

export default ResumeIndex;

