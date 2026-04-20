"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ApplicationPreview from "@/components/ApplicationPreview";
type Props = {
  data: any;
  photo: string | null;
};

export default function ApplyPage() {
  const params = useParams();
  const jobId = params?.jobId;


  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    position: "",
    experience: "",
    skills: "",
    coverLetter: "",
  });
  const [education, setEducation] = useState([
    { qualification: "", institution: "", year: "" },
  ]);

  const [employment, setEmployment] = useState([
    { company: "", position: "", years: "" },
  ]);


  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = async () => {
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Add your API call or submission logic here
  };

  // const handleDownloadPDF = async () => {
  //   const element = document.getElementById("pdf-content");
  //   if (!element) {
  //     alert("Preview not found!");
  //     return;
  //   }

  //   const html2pdf = (await import("html2pdf.js")).default;

  //   await html2pdf()
  //     .set({
  //       margin: 0.3,
  //       filename: "application.pdf",
  //       image: { type: "jpeg", quality: 1 },
  //       html2canvas: {
  //         scale: 2,
  //         useCORS: true,
  //         backgroundColor: "#ffffff",
  //       },
  //       jsPDF: {
  //         unit: "in",
  //         format: "a4",
  //         orientation: "portrait",
  //       },
  //     })
  //     .from(element)
  //     .save();
  // };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .set({
        margin: 0,
        filename: "Application.pdf",

        image: { type: "jpeg", quality: 1 },

        html2canvas: {
          scale: 3,
          useCORS: true,
          backgroundColor: "#ffffff",
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);
  const [photoName, setPhotoName] = useState("");
  const [passportName, setPassportName] = useState("");
  const [certificateNames, setCertificateNames] = useState<string[]>([]);

  const totalSteps = 6;
  const handleNext = () => setStep((s) => s + 1);
  const handlePrevious = () => setStep((s) => s - 1);

  return (
    <div className="pt-20">

      {/* HERO */}
      <section className="bg-linear-to-br from-[#1C346F] to-[#1C346F]/90 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">
          Apply for Job #{jobId}
        </h1>
      </section>

      {/* CONTENT */}
      <section className="py-10 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">

          <div className=" gap-8">

            {/* FORM */}
            <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white p-6 rounded shadow">

                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-bold mb-4 text-[#19316C]">Personal Info</h2>

                    <Input name="firstName" className="text-[#7E86B5]" placeholder="First Name"
                      value={formData.firstName} onChange={handleChange} />

                    <Input name="lastName" className="text-[#7E86B5] mt-3" placeholder="Last Name"
                      value={formData.lastName} onChange={handleChange} />

                    <Input name="email" className="text-[#7E86B5] mt-3" placeholder="Email"
                      value={formData.email} onChange={handleChange} />

                    <Input name="phone" className="text-[#7E86B5] mt-3" placeholder="Phone"
                      value={formData.phone} onChange={handleChange} />

                    <Input name="country" className="text-[#7E86B5] mt-3" placeholder="Country"
                      value={formData.country} onChange={handleChange} />

                    <Input name="city" className="text-[#7E86B5] mt-3" placeholder="City"
                      value={formData.city} onChange={handleChange} />
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <h2 className="text-xl font-bold mb-4 text-[#19316C]">Professional Info</h2>

                    <Input name="position" className="text-[#7E86B5] mt-3" placeholder="Position"
                      value={formData.position} onChange={handleChange} />

                    <Input name="experience" className="text-[#7E86B5] mt-3" placeholder="Experience (years)"
                      value={formData.experience} onChange={handleChange} />

                    <Textarea name="skills" className="text-[#7E86B5] mt-3" placeholder="Skills"
                      value={formData.skills} onChange={handleChange} />

                    <Textarea name="coverLetter" className="text-[#7E86B5] mt-3" placeholder="Cover Letter"
                      value={formData.coverLetter} onChange={handleChange} />
                  </>
                )}

                {/* STEP 4: Education */}
                {step === 4 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-[#19316C]">
                      Education Details
                    </h2>

                    {education.map((edu, index) => (
                      <div key={index} className="space-y-2 mb-4">
                        <Input
                          placeholder="Qualification"
                          value={edu.qualification}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].qualification = e.target.value;
                            setEducation(updated);
                          }}
                        />

                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].institution = e.target.value;
                            setEducation(updated);
                          }}
                        />

                        <Input
                          placeholder="Year"
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].year = e.target.value;
                            setEducation(updated);
                          }}
                        />
                      </div>
                    ))}

                    <Button
                      onClick={() =>
                        setEducation([...education, { qualification: "", institution: "", year: "" }])
                      }
                    >
                      Add More
                    </Button>
                  </div>
                )}


                {/* STEP 5: Employment History */}
                {step === 5 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-[#19316C]">
                      Employment History
                    </h2>

                    {employment.map((job, index) => (
                      <div key={index} className="space-y-2 mb-4">
                        <Input
                          placeholder="Company"
                          value={job.company}
                          onChange={(e) => {
                            const updated = [...employment];
                            updated[index].company = e.target.value;
                            setEmployment(updated);
                          }}
                        />

                        <Input
                          placeholder="Position"
                          value={job.position}
                          onChange={(e) => {
                            const updated = [...employment];
                            updated[index].position = e.target.value;
                            setEmployment(updated);
                          }}
                        />

                        <Input
                          placeholder="Years"
                          value={job.years}
                          onChange={(e) => {
                            const updated = [...employment];
                            updated[index].years = e.target.value;
                            setEmployment(updated);
                          }}
                        />
                      </div>
                    ))}

                    <Button
                      onClick={() =>
                        setEmployment([...employment, { company: "", position: "", years: "" }])
                      }
                    >
                      Add More
                    </Button>
                  </div>
                )}


                {/* Step 6: Preview */}
                {step === 6 && (
                  <div
                    id="pdf-content"
                    style={{ backgroundColor: "#ffffff", color: "#000000" }}
                    className="p-6 rounded shadow space-y-4"
                  >

                    {/* HEADER */}
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h1 style={{ color: "#1E3A8A" }} className="text-xl font-bold">
                          Gulf Empire Company Pvt. Ltd.
                        </h1>
                        <p style={{ color: "#7E86B5" }}>Minbhawan, Kathmandu, Nepal</p>
                        <p style={{ color: "#7E86B5" }}>Tel: +977-1-4115960</p>
                      </div>

                      <div className="w-24 h-28 border flex items-center justify-center text-xs">
                        {photoPreview && (
                          <img
                            src={photoPreview}
                            alt="photo"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* TITLE */}
                    <div
                      style={{ backgroundColor: "#1E3A8A", color: "#ffffff" }}
                      className="px-2 py-1 font-semibold"
                    >
                      Application For Employment
                    </div>

                    {/* POSITION */}
                    <div className="border p-2 text-center" style={{ color: "#7E86B5" }}>
                      I Wish To Apply For The Post Of:{" "}
                      <span className="font-bold underline" style={{ color: "#000" }}>
                        {formData.position || "________"}
                      </span>
                    </div>

                    {/* PERSONAL DETAILS */}
                    <h3 style={{ color: "#DC2626" }} className="font-semibold mt-3">
                      Personal Details :
                    </h3>

                    <table className="w-full border border-black mt-1">
                      <tbody>
                        <tr>
                          <td className="border p-1 w-1/2" style={{ color: "#7E86B5" }}>
                            Name: {formData.firstName} {formData.lastName}
                          </td>
                          <td className="border p-1" style={{ color: "#7E86B5" }}>
                            Contact: {formData.phone}
                          </td>
                        </tr>

                        <tr>
                          <td className="border p-1" style={{ color: "#7E86B5" }}>
                            Email: {formData.email}
                          </td>
                          <td className="border p-1" style={{ color: "#7E86B5" }}>
                            Location: {formData.city}, {formData.country}
                          </td>
                        </tr>

                        <tr>
                          <td className="border p-1" style={{ color: "#7E86B5" }}>
                            Experience: {formData.experience} years
                          </td>
                          <td className="border p-1" style={{ color: "#7E86B5" }}>
                            Position: {formData.position}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* SKILLS */}
                    <h3 style={{ color: "#DC2626" }} className="font-semibold mt-3">
                      Skills :
                    </h3>
                    <div className="border p-2 min-h-[60px]" style={{ color: "#7E86B5" }}>
                      {formData.skills}
                    </div>

                    {/* QUALIFICATION */}
                    <h3 style={{ color: "#DC2626" }} className="font-semibold mt-3">
                      Qualification Details :
                    </h3>

                    <table className="w-full border border-black mt-1 text-center">
                      <thead>
                        <tr>
                          <th className="border p-1" style={{ color: "#7E86B5" }}>
                            Qualification
                          </th>
                          <th className="border p-1" style={{ color: "#7E86B5" }}>
                            Institution
                          </th>
                          <th className="border p-1" style={{ color: "#7E86B5" }}>
                            Year
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {employment.map((job, i) => (
                          <tr key={i}>
                            <td className="border p-1 text-[#7E86B5]">{job.company}</td>
                            <td className="border p-1 text-[#7E86B5]">{job.position}</td>
                            <td className="border p-1 text-[#7E86B5]">{job.years}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* EMPLOYMENT */}
                    <h3 style={{ color: "#DC2626" }} className="font-semibold mt-3">
                      Employment History :
                    </h3>

                    <table className="w-full border border-black mt-1 text-center">
                      <thead>
                        <tr>
                          <th className="border p-1" style={{ color: "#7E86B5" }}>
                            Company
                          </th>
                          <th className="border p-1" style={{ color: "#7E86B5" }}>
                            Position
                          </th>
                          <th className="border p-1" style={{ color: "#7E86B5" }}>
                            Years
                          </th>
                        </tr>
                      </thead>
                        <tbody>
                          {employment.map((job, i) => (
                            <tr key={i}>
                              <td className="border p-1 text-[#7E86B5]">{job.company}</td>
                              <td className="border p-1 text-[#7E86B5]">{job.position}</td>
                              <td className="border p-1 text-[#7E86B5]">{job.years}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>

                    {/* COVER LETTER */}
                    <h3 style={{ color: "#DC2626" }} className="font-semibold mt-3">
                      Cover Letter :
                    </h3>
                    <div className="border p-2 min-h-[80px]" style={{ color: "#7E86B5" }}>
                      {formData.coverLetter}
                    </div>

                    {/* DECLARATION */}
                    <div className="mt-4 text-xs border p-2" style={{ color: "#7E86B5" }}>
                      I certify that the information provided is true and correct.
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-between mt-6 text-xs" style={{ color: "#7E86B5" }}>
                      <span>Signature: __________</span>
                      <span>Date: {new Date().toLocaleDateString()}</span>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-4">
                      <Button onClick={handleDownloadPDF} variant="outline">
                        Download PDF
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        style={{ backgroundColor: "#CAAD37", color: "#fff" }}
                      >
                        Final Submit
                      </Button>
                    </div>

                  </div>
                )}

                {/* Step 3: Documents & Submit */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-[#19316C] mb-2">
                        Upload Documents
                      </h2>
                      <p className="text-[#7E86B5]">
                        Please upload required documents
                      </p>
                    </div>

                    {/* PHOTO UPLOAD */}
                    <div>
                      <Label htmlFor="photo" className="text-[#7E86B5]">Passport Size Photo *</Label>
                      <div className="mt-2">
                        <label
                          htmlFor="photo"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary"
                        >
                          {photoName ? (
                            <>
                              <FileText className="w-10 h-10 text-[#19316C] mb-2" />
                              <p className="text-sm font-semibold">{photoName}</p>
                              <p className="text-xs text-[#7E86B5]">Click to change</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 text-[#7E86B5] mb-2" />
                              <p className="text-sm text-[#7E86B5]">Upload Photo</p>
                            </>
                          )}
                          <input
                            id="photo"
                            type="file"
                            className="hidden text-[#7E86B5]"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPhotoName(file.name);

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPhotoPreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            required
                          />
                        </label>
                      </div>
                    </div>

                    {/* PASSPORT */}
                    <div>
                      <Label htmlFor="passport" className="text-[#7E86B5]">Passport *</Label>
                      <div className="mt-2">
                        <label
                          htmlFor="passport"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary"
                        >
                          {passportName ? (
                            <>
                              <FileText className="w-10 h-10 text-[#19316C] mb-2" />
                              <p className="text-sm font-semibold">{passportName}</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 text-[#7E86B5] mb-2" />
                              <p className="text-sm text-[#7E86B5]">Upload Passport</p>
                            </>
                          )}
                          <input
                            id="passport"
                            type="file"
                            className="hidden text-[#7E86B5]"
                            onChange={(e) =>
                              setPassportName(e.target.files?.[0]?.name || "")
                            }
                            required
                          />
                        </label>
                      </div>
                    </div>

                    {/* CERTIFICATES */}
                    <div>
                      <Label htmlFor="certificates" className="text-[#7E86B5]">
                        Certificates *
                      </Label>
                      <div className="mt-2">
                        <label
                          htmlFor="certificates"
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary"
                        >
                          {certificateNames.length > 0 ? (
                            <>
                              <FileText className="w-10 h-10 text-[#19316C] mb-2" />
                              <p className="text-sm font-semibold">
                                {certificateNames.length} files selected
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 text-[#7E86B5] mb-2" />
                              <p className="text-sm text-[#7E86B5]">Upload Certificates</p>
                            </>
                          )}
                          <input
                            id="certificates"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                              setCertificateNames(
                                Array.from(e.target.files || []).map((f) => f.name)
                              )
                            }
                            required
                          />
                        </label>
                      </div>
                    </div>

                    {/* OPTIONAL CV */}
                    <div>
                      <Label htmlFor="cv" className="text-[#7E86B5]">CV (Optional)</Label>
                      <input
                        id="cv"
                        type="file"
                        className="mt-2 text-[#7E86B5]"
                        onChange={(e) =>
                          setFileName(e.target.files?.[0]?.name || "")
                        }
                      />
                    </div>

                    {/* SUMMARY */}
                    <div className="bg-[#F3F4F6] p-6 rounded-lg">
                      <h3 className="font-semibold mb-4 text-[#19316C]">Application Summary</h3>
                      <p className="text-sm text-[#7E86B5]">
                        {formData.firstName} {formData.lastName} applying for{" "}
                        {formData.position}
                      </p>
                    </div>
                  </div>
                )}

                {/* NAVIGATION */}
                {/* <div className="flex justify-between mt-6">
                  {step > 1 && (
                    <Button onClick={prev} className="bg-gray-300 text-gray-700 hover:bg-gray-400">
                      Previous
                    </Button>
                  )}

                  {step < 3 && (
                    <Button onClick={next} className="bg-blue-500 text-white hover:bg-blue-600">
                      Next
                    </Button>
                  )}
                </div> */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={step === 1}
                    className=""
                  >
                    Previous
                  </Button>

                  {step < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#19316C] hover:bg-[#19316C]/90"
                    >
                      {step === 5 ? "Preview" : "Next"}
                    </Button>
                  ) : null}
                </div>

              </div>
            </motion.div>

            {/* LIVE PREVIEW
            <div className="bg-gray-100 p-4 rounded shadow overflow-auto max-h-[800px]">
              <ApplicationPreview data={formData} photo={photoPreview} />
            </div> */}

          </div>

        </div >
      </section >
    </div >
  );
}