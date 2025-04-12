'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type FaqsPage = {
  _id: number;
  title: string;
  headline: string;
  description: string;
  image: string;
  keywords: string[];
};

const FaqsPage = () => {

    const [faqsPage, setfaqsPage] = useState<FaqsPage | null>(null);
    const [keywordsString, setKeywordsString] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

      useEffect(() => {
      
        const fetchFaqsPage = async () => {
          try {
            const response = await fetch(`/api/faqsPage`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            });
      
            const responseData = await response.json();
      
            if (responseData) {
              setfaqsPage(responseData);
              setPreviewImage(responseData.image);
              setKeywordsString(responseData.keywords?.join(", ") || "");
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchFaqsPage();
      }, []); // Hapus settings dari dependensi      

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!faqsPage) return;
      
        setfaqsPage({
          ...faqsPage,
          [e.target.name]: e.target.value, // Update field yang diubah
        });
      };  
      
      const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeywordsString(value);
      
        if (faqsPage) {
          setfaqsPage({
            ...faqsPage,
            keywords: value
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k.length > 0),
          });
        }
      };
      
    
      // Fungsi untuk menangani unggah gambar
      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setImage(file);
          setPreviewImage(URL.createObjectURL(file));
        }
      };

      const handleUpdate = async (e: React.FormEvent) => { 
        e.preventDefault();
        if (!faqsPage) return;
        setUpdating(true);
       
        const formData = new FormData();
        formData.append("title", faqsPage.title);
        formData.append("headline", faqsPage.headline);
        formData.append("description", faqsPage.description);
      
        if (image) {
          formData.append("image", image);
        }  

        faqsPage.keywords.forEach(keywords => formData.append("keywords", keywords));
      
        try {
          const res = await fetch(`/api/faqsPage`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            body: formData, // Jangan tambahkan Content-Type
          });          
      
          if (!res.ok) throw new Error("Gagal memperbarui data Page");
      
          setMessage("Page successfully updated!");
          setIsOpen(true);
        } catch (error) {
          console.error("Update error:", error);
          setMessage("Error updating Page: " + error);
          setIsOpen(true);
        } finally {
          setUpdating(false);
        }
      };
        
      const handlePush = () => {
          setIsOpen(false);
        }
    
  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-col sm:items-start sm:justify-between">
        <Breadcrumb route="dashboard/faqs" pageName="Manage Faqs" routeSecond={`dashboard/faqs/faqsPage`} pageNameSecond="/ Faqs Page" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive="" />
      </div>
      <div className="flex flex-col gap-10">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Faqs Page
              </h3>
            </div>
            <div className="p-6.5">
                <form onSubmit={handleUpdate} encType="multipart/form-data">
                    <div className="mb-4 flex flex-col gap-4.5 xl:flex-row ">

                        <div
                        id="FileUpload"
                        className="relative mb-5.5 block w-full h-65 cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-500 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
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
                                {(previewImage || faqsPage?.image) && (
                                <Image
                                    width={800}
                                    height={800}
                                    src={(previewImage || faqsPage?.image) as string}
                                    alt="Preview"
                                    priority
                                    className="w-full h-full object-cover rounded-xl mb-3 absolute top-0 left-0 z-1"
                                />
                                )}
                                <div className="bg-black/40 absolute w-full h-full top-0 left-0 z-9"></div>
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
                    <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Page Title
                            </label>
                            <input
                                type="text"
                                defaultValue={faqsPage?.title}
                                name="title"
                                onChange={handleChange}
                                placeholder="Enter Page Title"
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Page Headline
                            </label>
                            <input
                                type="text"
                                defaultValue={faqsPage?.headline}
                                name="headline"
                                onChange={handleChange}
                                placeholder="Enter Page headline"
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-full">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Page Keywords
                            </label>
                            <input
                                type="text"
                                name="keywords"
                                onChange={handleKeywordsChange}
                                value={keywordsString}
                                placeholder="Separate with commas (clinic, nmw, skincare)"
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                                />
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-full">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Page Description
                            </label>
                            <textarea
                                defaultValue={faqsPage?.description}
                                name="description"
                                onChange={handleChange}
                                placeholder="Enter Page Description"
                                rows={8}
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" onClick={handleUpdate} disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                            {updating ? "Saving..." : "Save Faqs Page"}
                        </button>
                        <Link href={'/dashboard/faqs'}>
                            <button className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
      </div>
      {/* Modal */}
      <div className={`fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white text-center rounded-2xl p-6 py-9 w-1/3 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            {message.includes('Error') ? (
              <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            ) : (
              <svg className="w-28 h-28 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/><path strokeLinecap="round" d="m16 24l6 6l12-12"/></g></svg>
            )}
          </div>
          <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">{message}</p>
          <button 
            onClick={() => message.includes('Error') ? setIsOpen(false) : handlePush()} 
            className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
            OK
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FaqsPage;