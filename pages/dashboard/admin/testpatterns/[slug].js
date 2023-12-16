import React from "react";
import { useRouter } from "next/router";

export async function getServerSideProps({ params }) {
  const str2 = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/patterns/${str2}`
  );
  const status = await data.json();
  return {
    props: { companies: status },
  };
}

const Pattern = ({ companies }) => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div className="min-h-screen">
      <div className="mx-7 pt-[14vh] ">
        <div className="mx-3">
          <h1 className=" text-gray-800 font-semibold my-3 text-2xl">
            {companies[0].companyname} Test Pattern
          </h1>
          <p className="">
            All the details given in the table are a rough estimate. The number
            of questions and time duration depends and may vary on the
            respective companies for which the exam is being conducted.
          </p>
        </div>
        <div className="container mx-auto mt-7 px-4   py-8 ">
          <table className="w-full text-sm text-center shadow ring-1 ring-black ring-opacity-5 text-gray-900 divide-y divide-gray-300 md:rounded-lg">
            <thead className="text-xs text-center  text-gray-900 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-900 text-center">
                  Section
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 ">
                  Title
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 ">
                  No of Questions
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 ">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 ">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {companies[0].testsections.map((item, index) => (
                <tr key={index} className="bg-white ">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.section}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap ">
                    {item.noofques}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap ">
                    {item.difficulty.length > 0 ? item.difficulty : "Varies"}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap">
                    {item.duration} Minutes
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pattern;
