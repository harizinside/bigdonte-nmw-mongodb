'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreateCatalog = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [documentFile, setDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { 
      setImage(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !image || !documentFile) {
      setMessage("Semua field harus diisi!");
      setIsOpen(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("image", image as Blob);
      formData.append("document", documentFile as Blob);

      const response = await axios.post(
        "/api/catalogs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`, // Ganti `yourToken` dengan token yang sesuai
            "Content-Type": "multipart/form-data",
          }, 
        }
      );

      if (response.status === 201) {
        setIsOpen(true);
        setMessage("Katalog berhasil ditambahkan!");
        setTitle("");
        setDate("");
        setImage(null);
        setDocument(null);
      } else {
        setMessage("Gagal menambahkan katalog.");
      }
    } catch {
      setMessage("Terjadi kesalahan.");
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/catalogs");
  } 

  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="dashboard/catalogs" pageName="Manage Catalogs" routeSecond="" pageNameSecond="/ Create" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
        </div>

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Create Catalog
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Image
                        </label>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Catalog Title
                        <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter catalog title"
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                      />
                    </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Document (PDF)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleDocumentChange}
                          className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                    <div className="flex flex-col w-full xl:w-1/2">
                      <div>
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                          Select Date
                        </label> 
                        <div className="relative">
                            <input 
                              type="date" 
                              value={date} onChange={(e) => setDate(e.target.value)}
                              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                            />
                            <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                              <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Catalog"}
                    </button>
                    <Link href={'/dashboard/catalogs'}>
                        <button type="button" className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
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
        <button type="button"
          onClick={() => message.includes('Error') || message.includes('Please fill in all required fields!') ? setIsOpen(false) : handlePush()} 
          className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
          OK
        </button>
      </div>
    </div>
    </DefaultLayout>
  );
};

export default CreateCatalog;
