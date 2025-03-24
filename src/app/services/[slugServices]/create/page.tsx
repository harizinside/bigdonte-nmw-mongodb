'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo  } from "react";
import RichEditor from "@/components/rich-editor/page";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

const CreateServiceList = () => { 
    const { slugServices } = useParams(); // Ambil ID dokter dari URL
    const slugServicesString = Array.isArray(slugServices) ? slugServices.join("/") : slugServices;
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imageSecond, setImageSecond] = useState<File | null>(null);
    const [sensitiveContent, setSensitiveContent] = useState<boolean | null>(null);
    const [template, setTemplate] = useState<boolean | null>(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) { 
        setImage(file);
      }
    };

    const handleImageChangeSecond = (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileSecond = e.target.files?.[0];
      if (fileSecond) { 
        setImageSecond(fileSecond);
      }
    };

    const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTemplate(event.target.value === "template-1");
    };

    const handleSelection = (value: boolean) => {
      setSensitiveContent(value);
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
        !name || sensitiveContent === null || 
        !description || !image || !imageSecond
      ) {
        setMessage("Please fill in all required fields!");
        setIsOpen(true);
        return;
      }      
    
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("slug", slug || "default-slug");
        formData.append("slugServices", slugServicesString || "");
        formData.append("sensitive_content", sensitiveContent ? "1" : "0");
        formData.append("description", description);
        formData.append("imageBanner", image);
        formData.append("imageCover", imageSecond);
        
        const response = await axios.post(
          "/api/servicesList",
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
          setMessage("Services List berhasil ditambahkan!");
          setName("");
          setSlug("");
          setDescription("");
          setSensitiveContent(true);
          setImage(null);
          setImageSecond(null);
        } else {
          setMessage("Gagal menambahkan Services List.");
        }
      } catch (error) {
        setMessage("Error creating service: " + error);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    };    
  
    const handlePush = () => {
      setIsOpen(false);
      router.push(`/services/${slugServices}`);
    }

    const formatSlugToTitle = (slug: string) => {
      return slug
        .split("-") // Pisahkan berdasarkan "-"
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama jadi kapital
        .join(" "); // Gabungkan kembali dengan spasi
    };
  
    const formattedTitle = formatSlugToTitle(Array.isArray(slugServices) ? slugServices[0] : slugServices);

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="services" pageName="Manage Services" routeSecond={`services/${slugServices}`} pageNameSecond={`/ ${formattedTitle}`} routeThird="" pageNameThird="/ Create" routeFour="" pageNameFour="" routeFive="" pageNameFive="" />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9"> 
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            {/* <form action="#"> */}
              <div className="p-6.5 ">
                <div className="flex gap-4.5 xl:flex-row mb-7 ">
                    <div className="w-full xl:w-1/3 ">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Banner Image
                        </label>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                    <div className="w-full xl:w-1/3">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Cover Image
                        </label>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChangeSecond}
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                    <div className="w-full xl:w-1/3">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Service Name
                        <span className="text-red">*</span>
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
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Service Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor onChange={setDescription}/>
                    </div>
                  </div>
                </div>

                <div className="mt-7 w-full">
                  <div className="flex gap-4">
                    {/* Tombol untuk TRUE */}
                    <button
                      type="button"
                      onClick={() => handleSelection(true)}
                      className={`w-full xl:w-1/2 px-6 py-2  font-medium rounded-lg transition-all ${
                        sensitiveContent === true ? "bg-red-500 border-red-500 text-white" : "bg-transparent border-red-500 text-red-500"
                      } border-2`}
                    >
                      Sensitive Content
                    </button>

                    {/* Tombol untuk FALSE */}
                    <button
                      type="button"
                      onClick={() => handleSelection(false)}
                      className={`w-full xl:w-1/2 px-6 py-2 font-medium rounded-lg transition-all ${
                        sensitiveContent === false ? "bg-green-500 border-green-500 text-white" : "bg-transparent border-green-500 text-green-500"
                      } border-2`}
                    >
                      Not Sensitive Content
                    </button>
                  </div>
                </div>
                <input type="text" value={slug} style={{visibility: 'hidden'}} onChange={(e) => setSlug(e.target.value)} readOnly />
                <div className="flex gap-3 mt-1">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Service"}
                    </button>
                    <Link href={`/services/${slugServices}`}>
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

export default CreateServiceList;