"use client";

import { useState } from "react";

type Props = {
  data: any;
  photo: string | null;
};


export default function ApplicationPreview({ data, photo }: Props) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  return (
    <div
      id="pdf-content"
      className="bg-white p-6 border shadow text-[12px]  mx-auto font-sans relative"
      style={{
        width: "794px",   // ✅ A4 width
        minHeight: "1123px", // ✅ A4 height
        backgroundColor: "#ffffff",
      }}
    >

      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-2">
        <div>
          <h1 className="text-xl font-bold text-blue-900">
            Gulf Empire Company Pvt. Ltd.
          </h1>
          <p className="text-[#7E86B5]">Minbhawan, Kathmandu, Nepal</p>
          <p className="text-[#7E86B5]">Tel: +977-1-4115960</p>
        </div>
        <div className="w-24 h-28 border flex items-center justify-center text-xs">
         {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="photo"
                          className="absolute top-8 right-8 w-28 h-32 border object-cover"
                        />
                      )}
        </div>
      </div>

      {/* TITLE */}
      <div className="bg-blue-900 text-white px-2 py-1 mt-3 font-semibold">
        Application For Employment
      </div>

      {/* POSITION */}
      <div className="border p-2 text-center mt-3 text-[#7E86B5]">
        I Wish To Apply For The Post Of:{" "}
        <span className="font-bold underline">
          {data.position || "________"}
        </span>
      </div>

      {/* PERSONAL DETAILS */}
      <h3 className="text-red-600 font-semibold mt-3">
        Personal Details :
      </h3>

      <table className="w-full border border-black mt-1">
        <tbody>
          <tr className="border">
            <td className="border p-1 w-1/2 text-[#7E86B5]">
              Name: {data.firstName} {data.lastName}
            </td>
            <td className="border p-1 text-[#7E86B5]">
              Contact: {data.phone}
            </td>
          </tr>

          <tr>
            <td className="border p-1 text-[#7E86B5]">
              Email: {data.email}
            </td>
            <td className="border p-1 text-[#7E86B5]">
              Location: {data.city}, {data.country}
            </td>
          </tr>

          <tr>
            <td className="border p-1 text-[#7E86B5]">
              Experience: {data.experience} years
            </td>
            <td className="border p-1 text-[#7E86B5]">
              Position: {data.position}
            </td>
          </tr>
        </tbody>
      </table>

      {/* SKILLS */}
      <h3 className="text-red-600 font-semibold mt-3">
        Skills :
      </h3>
      <div className="border p-2 min-h-[60px] text-[#7E86B5]">
        {data.skills}
      </div>

      {/* QUALIFICATION */}
      <h3 className="text-red-600 font-semibold mt-3">
        Qualification Details :
      </h3>

      <table className="w-full border border-black mt-1 text-center">
        <thead>
          <tr>
            <th className="border p-1 text-[#7E86B5]">Qualification</th>
            <th className="border p-1 text-[#7E86B5]">Institution</th>
            <th className="border p-1 text-[#7E86B5]">Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-1 text-[#7E86B5]">+2 / Bachelor</td>
            <td className="border p-1 text-[#7E86B5]">-</td>
            <td className="border p-1 text-[#7E86B5]">-</td>
          </tr>
        </tbody>
      </table>

      {/* EMPLOYMENT */}
      <h3 className="text-red-600 font-semibold mt-3">
        Employment History :
      </h3>

      <table className="w-full border border-black mt-1 text-center">
        <thead>
          <tr>
            <th className="border p-1 text-[#7E86B5]">Company</th>
            <th className="border p-1 text-[#7E86B5]">Position</th>
            <th className="border p-1 text-[#7E86B5]">Years</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-1 text-[#7E86B5]">-</td>
            <td className="border p-1 text-[#7E86B5]">{data.position}</td>
            <td className="border p-1 text-[#7E86B5]">{data.experience}</td>
          </tr>
        </tbody>
      </table>

      {/* COVER LETTER */}
      <h3 className="text-red-600 font-semibold mt-3">
        Cover Letter :
      </h3>
      <div className="border p-2 min-h-[80px] text-[#7E86B5]">
        {data.coverLetter}
      </div>

      {/* DECLARATION */}
      <div className="mt-4 text-xs border p-2 text-[#7E86B5]">
        I certify that the information provided is true and correct.
      </div>

      {/* FOOTER */}
      <div className="flex justify-between mt-6 text-xs text-[#7E86B5]">
        <span>Signature: __________</span>
        <span>Date: {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}