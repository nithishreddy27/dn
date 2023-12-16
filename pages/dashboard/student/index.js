import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Filter } from "../../../src/components/Jobs/Filter";
import {
  createResumeMessages,
  verifyCheckIn,
  applyFilters,
} from "../../../src/lib/helper";
import { JobCardSkeleton } from "../../../src/components/Layout/Skeletons/JobCardSkeleton";
import { getLoginSession } from "../../../src/lib/auth";
import { findUser } from "../../../src/lib/user";
import { useJobs } from "../../../src/hooks/useJobs";
import { JobCard } from "../../../src/components/Jobs/JobCard";
import { JobChart } from "../../../src/components/Jobs/JobChart";
import { useResumes } from "../../../src/hooks/useResumes";
import axios from "axios";
import { useCrt } from "../../../src/hooks/useCrt";
import { useNotices } from "../../../src/hooks/useNotices";
import { useSingleAcademic } from "../../../src/hooks/useSingleAcademic";
import crypto from "crypto";
import { useResumeContext } from "../../../src/context/ResumeContext";

const notEligibleStudents = [];

const resources = [
  {
    heading: "Epam Resouces for 2023",
    image:
      "https://res.cloudinary.com/crowdicity-us-east-1/image/upload/w_710,h_500,c_fill/epam-anywhere-logo-240x240-png_ehxcx7",
    href: "/resources/epam",
  },
  {
    heading: "What it takes to be an SDET @Commvault?",
    video: `<iframe src="https://www.youtube.com/embed/2tY_VoACte0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
  },
  {
    heading: "Accolite",
    image:
      "https://res.cloudinary.com/dj7nomqfd/image/upload/v1651482750/Accolite_Digital_Logo_jlrxfj.jpg",
    href: "https://www.linkedin.com/events/campusconnect-jumpstartyourcare6919521526669070336/",
  },
];

const StudentIndex = ({ userDetails, displayDetails }) => {

  const user = JSON.parse(userDetails);
  const { jobs, isLoading } = useJobs(user);
  const { oldAcademic } = useSingleAcademic(undefined, user?.rollNumber?.value);
  const [isEligibleToPay, setIsEligibleToPay] = useState(false);
  const { notices } = useNotices(user);
  const { crtPayment } = useCrt(user?.email);
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [counts, setCounts] = useState([]);
  const { resumes } = useResumes(user);
  const { modules, setmodules } = useResumeContext();
  const currentDate = new Date();

  useEffect(() => {
    if (!jobs || !resumes) return;
    (async () => {
     console.log("jobs",jobs)

      const dataSet = [0, 7, 0, 0];
      dataSet[0] = resumes.length;
      for (let i = 0; i < jobs.length; i++) {
        for (let j = 0; j < jobs[i].eligible.length; j++) {
          if (jobs[i].eligible[j]?.email === user?.email) {
            if (jobs[i].eligible[j].status.applied === null) dataSet[2]++;
            if (jobs[i].eligible[j].status.applied === true) dataSet[3]++;
          }
        }
      }
      setFilteredJobs(jobs);
      setCounts(dataSet);
    })();
  }, [jobs, resumes]);

  const form = useRef(null);

  var allModules = [];
  var flag = false;

  displayDetails[0].payment.history.map((pay) => {
    if (pay.expiryDate) {
      const expDate = new Date(pay.expiryDate);
      if (expDate > currentDate) {
        pay.modules.map((module) => {
          allModules.push(module);
        });
      }
    }
    flag = true;
  });

  useEffect(() => {
    setmodules(allModules);
  }, [flag]);

  useEffect(() => {
    if (!form.current) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", "pl_KAYn8wG1FPR3WX");
    script.async = true;

    form?.current?.appendChild(script);

    return () => {
      form?.current?.removeChild(script);
    };
  }, [form.current]);

  useEffect(() => {
    if (!oldAcademic || !oldAcademic.score) return;
    if (oldAcademic.score.grade <= 10) {
      setIsEligibleToPay(oldAcademic.score.grade >= 6);
    } else if (oldAcademic.score.grade <= 100) {
      setIsEligibleToPay(oldAcademic.score.grade >= 60);
    } else {
      setIsEligibleToPay(false);
    }
    if (
      notEligibleStudents.filter((x) => x === user.rollNumber.value).length > 0
    )
      setIsEligibleToPay(false);
  }, [oldAcademic]);

  useEffect(() => {
    if (!notices || !user) return;
    let count = 0;
    notices.forEach((x) => {
      if (x.seen.filter((x) => x.email === user.email).length === 0) count++;
    });
    if (count > 0) {
      toast.info("You have " + count + " new notice.", { toastId: 1 });
    }
  }, [notices, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const showPopup = verifyCheckIn();
    if (showPopup && counts[0] === 0) {
      const id = Math.floor(Math.random() * 10) % 3;
      toast.info(createResumeMessages[id], { toastId: id });
    }
  }, []);

  return (
    <div className="px-5 pt-1 overflow-auto w-[100%] mt-[9vh]">
      <div className="flex justify-between items-start mt-5">
        <div className="w-[80%] flex">
          <div className="mr-4 rounded-md sticky top-0 left-0 w-[25%]">
            <div className="bg-gray-50">
              <Filter
                applyFilters={applyFilters}
                jobs={jobs}
                setFilteredJobs={setFilteredJobs}
              />
            </div>

            <h1 className="text-center font-semibold">Jobs</h1>
            <JobChart
              counts={[counts[2], counts[3]]}
              labels={["Pending", "Applied"]}
            />
            <h1 className="text-center font-semibold mt-2">Resumes</h1>
            <JobChart
              counts={[counts[0], counts[1]]}
              labels={["Created", "Available"]}
            />
          </div>

          <div className="bg-gray-50 w-[75%] rounded-md p-2">
            <div className="min-w-0">
              <div className="lg:min-w-0">
                <div className="h-full px-1">
                    {console.log("filter",filteredJobs)}
                    <div
                      className="mt-4 relative h-full"
                      style={{ minHeight: "36rem" }}
                    >
                      {!filteredJobs && isLoading ? (
                        <JobCardSkeleton />
                      ) : filteredJobs?.length > 0 ? (
                        <div className="flex flex-col">
                          {filteredJobs?.map((job) => (
                            <JobCard key={job._id} job={job} />
                          ))}
                        </div>
                      ) : (
                        <div className="flex mt-10 pt-32 flex-col justify-center items-center w-full">
                          <div className="relative flex-shrink-0 flex justify-center h-72 w-72">
                            <Image
                              placeholder="blur"
                              blurDataURL="/no_results.png"
                              layout="fill"
                              objectFit="contain"
                              src="/no_results.png"
                              alt=""
                            />
                          </div>
                          <h6 className="text-3xl font-semibold text-gray-400">
                            No Jobs Found
                          </h6>
                        </div>
                      )}
                    </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-2 w-[20%] min-h-[85vh] bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold">Resources</h3>
          <div className="flex flex-col mt-2">
            {resources.map((resource) => (
              <div
                key={resource.heading}
                className="w-full mb-3 rounded bg-white shadow"
              >
                {resource.image && (
                  // <div className="relative w-[90%] mx-auto">
                  <div className="relative h-40">
                    <Image
                      placeholder="blur"
                      blurDataURL={resource.image}
                      layout="fill"
                      objectFit="contain"
                      className=""
                      src={resource.image}
                      alt=""
                    />
                  </div>
                )}
                {resource.video && (
                  <div dangerouslySetInnerHTML={{ __html: resource.video }} />
                )}
                <div className="px-2 py-1 text-[13.5px] text-center font-semibold">
                  {resource.href ? (
                    <a
                      target={"_blank"}
                      className="underline text-orange-700"
                      href={resource.href}
                      rel="noreferrer"
                    >
                      {resource.heading}
                    </a>
                  ) : (
                    <h1 className="">{resource.heading}</h1>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        iframe {
          height: 150px;
          width: 100%;
          padding: 5px;
          margin: 0px auto;
        }
      `}</style>
    </div>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const defaultPassword = "Provast@123";

  const session = await getLoginSession(req);
  const user = (session?._doc && (await findUser(session._doc))) ?? null;
 
  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
 
  
  if(user){
    
    if (!user.detailsAvailable) {
      return {
        redirect: {
          destination: "/auth/user/details",
          permanent: false,
        },
      };
    }
  
    if (user.category !== "student") {
      return {
        redirect: {
          destination: `/dashboard/${user.category}`,
          permanent: false,
        },
      };
    }
  
    if (user.category === "student" && !user.academicsAvailable) {
      return {
        redirect: {
          destination: "/auth/user/academics",
          permanent: false,
        },
      };
    }
    const inputHash = crypto.pbkdf2Sync(defaultPassword, user.salt, 1000, 64, "sha512").toString("hex");
      const passwordsMatch = user.hash === inputHash; 
      if (passwordsMatch) {
        return {
          redirect: {
            destination: "/dashboard/student/profile/changePassword",
            permanent: false,
          },
        };
      }
  
    }
  const displayDetails = new Array();
  await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/payment/${user._id}`)
    .then((res) => res.json())
    .then((res) => {
      displayDetails.push(res);
    });

  const {
    data: { payment },
  } = await axios.get(`${process.env.HOST_URL}/api/payment/${user?._id}`);

  

  //whyy
  const { data: crt } = await axios.get(
    `${process.env.HOST_URL}/api/payment/crt?id=${user?.email}`
  );

  return {
    props: {
      userDetails: JSON.stringify(user),
      college: user.college.name,
      crtPayment: crt.message,
      displayDetails: displayDetails,
    },
  };
};

export default StudentIndex;
