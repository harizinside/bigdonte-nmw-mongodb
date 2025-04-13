'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo  } from "react";
import RichEditor from "@/components/rich-editor/page";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const CreatePatients = () => { 
    const { slugServices, slugServicesList, slugServicesPatient } = useParams(); // Ambil ID dokter dari URL
    const slugServicesString = Array.isArray(slugServices) ? slugServices.join("/") : slugServices;
    const slugServicesListString = Array.isArray(slugServicesList) ? slugServicesList.join("/") : slugServicesList;
    const slugServicesPatientString = Array.isArray(slugServicesPatient) ? slugServicesPatient.join("/") : slugServicesPatient;
    const router = useRouter();
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageSecond, setImageSecond] = useState<File | null>(null); 
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [keywords, setKeywords] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewImageSecond, setPreviewImageSecond] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) { 
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    };

    const handleImageChangeSecond = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileSecond = e.target.files?.[0];
      if (fileSecond) { 
        setImageSecond(fileSecond);
        setPreviewImageSecond(URL.createObjectURL(fileSecond));
      }
    };

    const generatedSlug = useMemo(() => {
      if (!name) return "";
      return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }, [name]);
    
    useEffect(() => {
      setSlug(generatedSlug);
    }, [generatedSlug]);
  
    const handleSubmit = async () => {
      if (
        !name || 
        !description || !image || !imageSecond
      ) {
        setMessage("Please fill in all required fields!");
        setIsOpen(true);
        return;
      }      

      const formattedKeywords = keywords.split(",").map(keywords => keywords.trim()); 
    
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", slug || "default-slug");
        formData.append("slugServices", slugServicesString || "");
        formData.append("slugServicesList", slugServicesListString || "");
        formData.append("slugServicesType", slugServicesPatientString || "");
        formData.append("description", description);
        formData.append("image", image);
        formData.append("imageSecond", imageSecond);
        formattedKeywords.forEach(keywords => formData.append("keywords", keywords));
        
        const response = await axios.post(
          "/api/patients",
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        if (response.status === 201) {
          setIsOpen(true);
          setMessage("Patients berhasil ditambahkan!");
          setName("");
          setSlug("");
          setDescription("");
          setKeywords("");
          setImage(null);
          setImageSecond(null);
        } else {
          setMessage("Gagal menambahkan Patients.");
        }
      } catch (error) {
        setMessage("Error creating Patients: " + error);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    };    
  
    const handlePush = () => {
      setIsOpen(false);
      router.push(`/dashboard/services/${slugServices}/${slugServicesList}/${slugServicesPatient}`);
    }

    const formatSlugToTitle = (slug: string) => {
      return slug
        .split("-") // Pisahkan berdasarkan "-"
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama jadi kapital
        .join(" "); // Gabungkan kembali dengan spasi
    };
  
    const formattedTitle = formatSlugToTitle(Array.isArray(slugServices) ? slugServices[0] : slugServices);
    const formattedTitleList = formatSlugToTitle(Array.isArray(slugServicesList) ? slugServicesList[0] : slugServicesList);
    const formattedTitlePatient = formatSlugToTitle(Array.isArray(slugServicesPatient) ? slugServicesPatient[0] : slugServicesPatient);

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="dashboard/services" pageName="Manage Services" routeSecond={`dashboard/services/${slugServices}`} pageNameSecond={`/ ${formattedTitle}`} routeThird={`dashboard/services/${slugServices}/${slugServicesList}`} pageNameThird={`/ ${formattedTitleList}`} routeFour={`dashboard/services/${slugServices}/${slugServicesList}/${slugServicesPatient}`} pageNameFour={`/ ${formattedTitlePatient} Patient`} routeFive={`/dashboard/services/${slugServices}/${slugServicesList}/${slugServicesPatient}/create`} pageNameFive="/ Create" />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9"> 
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            {/* <form action="#"> */}
              <div className="p-6.5 ">
                <div className="flex gap-4.5 xl:flex-row mb-7 ">
                    <div className="w-full xl:w-1/2 ">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Image Patient
                        </label>
                        <div
                          id="FileUpload"
                          className="relative block w-full h-65 cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-500 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
                          >
                          <input
                              type="file"
                              onChange={handleImageChange}
                              name="profilePhoto"
                              id="profilePhoto"
                              accept="image/png, image/jpg, image/jpeg"
                              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          />
                            <div className="flex flex-col items-center justify-center">
                                {/* Preview image di sini */}
                                {(previewImage) && (
                                <Image
                                    width={800}
                                    height={800}
                                    src={previewImage}
                                    alt="Preview"
                                    priority
                                    className="w-full h-full object-cover rounded-xl mb-3 absolute top-0 left-0 z-1"
                                />
                                )}
                                <div className="bg-black/40 absolute w-full h-full top-0 left-0 z-9 rounded-xl"></div>
                                <div className="absolute bottom-10 w-100 text-center z-10">
                                    <p className="mt-2.5 text-body-sm text-white font-medium">
                                    <span className="text-orange-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="mt-1 text-body-xs text-white">
                                    SVG, PNG, JPG (max, 2MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Image Patient Second
                        </label>
                        <div
                          id="FileUpload"
                          className="relative block w-full h-65 cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-500 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
                          >
                          <input
                              type="file"
                              onChange={handleImageChangeSecond}
                              name="profilePhoto"
                              id="profilePhoto"
                              accept="image/png, image/jpg, image/jpeg"
                              className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                          />
                            <div className="flex flex-col items-center justify-center">
                                {/* Preview image di sini */}
                                {(previewImageSecond) && (
                                <Image
                                    width={800}
                                    height={800}
                                    src={previewImageSecond}
                                    alt="Preview"
                                    priority
                                    className="w-full h-full object-cover rounded-xl mb-3 absolute top-0 left-0 z-1"
                                />
                                )}
                                <div className="bg-black/40 absolute w-full h-full top-0 left-0 z-9 rounded-xl"></div>
                                <div className="absolute bottom-10 w-100 text-center z-10">
                                    <p className="mt-2.5 text-body-sm text-white font-medium">
                                    <span className="text-orange-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="mt-1 text-body-xs text-white">
                                    SVG, PNG, JPG (max, 2MB)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4.5 xl:flex-row mb-7 ">
                  <div className="w-full xl:w-full">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter service name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                  </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Patient Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor onChange={setDescription}/>
                    </div>
                  </div>
                </div>
                <div className="mb-0 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-full">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Patient Keywords
                      </label>
                      <input
                        type="text"
                        placeholder="separate with commas (clinic, nmw, skincare)"
                        value={keywords} onChange={(e) => setKeywords(e.target.value)}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                      />
                  </div>
                </div>
                <input type="text" value={slug} style={{visibility: 'hidden'}} onChange={(e) => setSlug(e.target.value)} readOnly />
                <div className="flex gap-3 mt-1">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Patient"}
                    </button>
                    <Link href={`/dashboard/services/${slugServices}/${slugServicesList}/${slugServicesPatient}`}>
                        <button className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
                            Cancel
                        </button>
                    </Link>
                </div>
              </div>
              
          </div>
        </div>

      </div>
      {/* Modal */}
      <div className={`fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white text-center rounded-2xl p-6 py-9 w-1/3 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            {message.includes('Error') || message.includes('Please fill in all required fields!') ? (
              <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            ) : (
              <svg className="w-28 h-28 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/><path strokeLinecap="round" d="m16 24l6 6l12-12"/></g></svg>
            )}
          </div>
          <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">{message}</p>
          <button 
            onClick={() => message.includes('Error') || message.includes('Please fill in all required fields!') ? setIsOpen(false) : handlePush()} 
            className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
            OK
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreatePatients;