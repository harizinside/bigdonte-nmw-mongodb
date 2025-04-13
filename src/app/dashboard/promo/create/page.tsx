'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect, useMemo  } from "react";
import { useRouter } from "next/navigation";
import RichEditor from "@/components/rich-editor/page";
import axios from "axios";
import Image from "next/image";

const CreatePromo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [sk, setSk] = useState("");
  const [slug, setSlug] = useState("");
  const [keywords, setKeywords] = useState(""); 
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [isCustomLink, setIsCustomLink] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // generate preview
    }
  };   

  const generatedSlug = useMemo(() => {
        if (!title) return "";
        return title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }, [title]);
      
      useEffect(() => {
        setSlug(generatedSlug);
      }, [generatedSlug]);

  const handleSubmit = async () => {

    const formattedKeywords = keywords.split(",").map(keywords => keywords.trim()); 
    setLoading(true);
    const formData = new FormData();
    if (isCustomLink) {
        formData.append("title", "");
        formData.append("slug", `default-slug-${Date.now()}`);
        formData.append("image", image || "");
        formData.append("sk", "");
        formData.append("start_date", "");
        formData.append("end_date", ""); 
        formData.append("link", link);
    } else { 
        formData.append("title", title);
        formData.append("description", description);
        formattedKeywords.forEach(keywords => formData.append("keywords", keywords));
        formData.append("slug", slug);
        formData.append("image", image || "");
        formData.append("sk", sk);
        formData.append("start_date", startDate);
        formData.append("end_date", endDate);
        formData.append("link", "");
    }

    try {
        const response = await axios.post(
          "/api/promos",
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
          setMessage("Promo berhasil ditambahkan!");
          setLink("");
          setSk("");
          setStartDate("");
          setEndDate("");
          setTitle("");
          setKeywords("");
          setDescription("");
          setImage(null);
        } else {
          setMessage("Gagal menambahkan Promo.");
        }
    } catch (error) {
        setMessage("Error creating Promo: " + error);
        setIsOpen(true);
    } finally {
        setLoading(false);
    }
};


  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/promo");
  } 
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="dashboard/promo" pageName="Manage Promo" routeSecond="dashboard/promo/create" pageNameSecond="/ Create" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
        </div>

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex justify-between items-center">
              <h3 className="font-semibold text-dark dark:text-white">Create Promo</h3>
              <button
                className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[7px] px-4 text-sm font-medium text-white hover:bg-opacity-90"
                onClick={() => setIsCustomLink((prev) => !prev)}
              >
                {isCustomLink ? "Make Normal Form Promo" : "Make Custom Link Promo"}
              </button>
            </div>
            <div className="p-6.5">
                <div className={`mb-1 flex flex-col gap-4.5 xl:flex-col ${isCustomLink ? 'block' : 'hidden'}`}>
                  <div className="mb-4 flex flex-row gap-4.5 xl:flex-row ">
                      <div className="w-full xl:w-full">
                        <label className="mb-4 block text-body-sm font-medium text-dark dark:text-white">
                          Upload Image
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
                  </div>
                  <div className="mb-3 flex flex-col gap-4.5 xl:flex-row w-full">
                    <div className="w-full xl:w-full">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Custom Link
                      </label>
                      <input
                        type="text"
                        placeholder="Enter custom link"
                        value={link} onChange={(e) => setLink(e.target.value)}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                      />
                  </div>
                  </div>
                  
                </div>

                <div className={`${isCustomLink ? 'hidden' : 'block'}`}>
                  <div className={`mb-7 flex flex-col gap-4.5 xl:flex-row`}>
                    <div className="w-full xl:w-full">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Upload Image
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
                  </div>
                  <div className={`mb-7 flex flex-col gap-4.5 xl:flex-row`}>
                      <div className="w-full xl:w-full">
                          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Promo Title
                            <span className="text-red">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter promo title"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                          />
                      </div>
                    </div>
                    <div className="mb-7 flex flex-col gap-4.5 xl:flex-row w-full">
                      <div className="w-full">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Promo Description</label>
                            <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                              <RichEditor onChange={setDescription}/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-7 flex flex-col gap-4.5 xl:flex-row w-full">
                      <div className="w-full">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Promo S&K</label>
                            <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                              <RichEditor onChange={setSk}/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                      <div className="flex flex-col w-full xl:w-1/2">
                        <div>
                          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Select Start Date
                          </label> 
                          <div className="relative">
                              <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                              />
                              <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col w-full xl:w-1/2">
                        <div>
                          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Select End Date
                          </label> 
                          <div className="relative">
                              <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                              />
                              <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-1 flex flex-col gap-4.5 xl:flex-row">
                      <div className="w-full xl:w-full">
                          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Promo Keywords
                          </label>
                          <input
                            type="text"
                            placeholder="separate with commas (clinic, nmw, skincare)"
                            value={keywords} onChange={(e) => setKeywords(e.target.value)}
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                          />
                      </div>
                    </div>
                </div> 

              <input type="text" value={slug} 
              style={{visibility: 'hidden'}}
               onChange={(e) => setSlug(e.target.value)} readOnly />
              <div className="flex gap-3">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Promo"}
                    </button>
                    <Link href={'/dashboard/promo'}>
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

export default CreatePromo;
