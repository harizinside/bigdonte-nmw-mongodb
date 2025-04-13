'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

const CreatePopup = () => {
    const [image, setImage] = useState<File | null>(null);
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setImage(e.target.files[0]);
        setPreviewImage(URL.createObjectURL(e.target.files[0]));
      }
    };
  
    const handleSubmit = async () => {
      if (!link) {
        setMessage("Please fill in all required fields!");
        setIsOpen(true);
        return;
      }
  
      setLoading(true);
  
      try {
        const formData = new FormData();
        formData.append("link", link); 
        if (image) {
          formData.append("image", image);
        }
        formData.append("status", "1");

        const response = await axios.post(
          "/api/popups",
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
          setMessage("Popup berhasil ditambahkan!");
          setLink("");
          setImage(null);
        } else {
          setMessage("Gagal menambahkan Popup.");
        }
      } catch (error) {
        setMessage("Error creating popup: " + error);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    const handlePush = () => {
      setIsOpen(false);
      router.push("/dashboard/popup");
    }
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="dashboard/popup" pageName="Manage Popup" routeSecond="" pageNameSecond="/ Create" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
        </div>

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Create Popup
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-5">
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
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Popup Link
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter popup link (Ex: Https://nmwclinic.co.id)"
                      value={link} onChange={(e) => setLink(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Popup"}
                    </button>
                    <Link href={'/dashboard/popup'}>
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

export default CreatePopup;
