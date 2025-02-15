'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const Settings = () => {
    const [settings, setSettings] = useState({ title: "", meta_description: "", favicon: "", logo: "", email: "", phone: "", social_media: "[]", address: "", address_2: "", copyright: "", direct_link: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        const fetchSettings = async () => {
          try {
            const res = await fetch("/api/settings");
            if (!res.ok) throw new Error("Gagal mengambil data");
    
            const result = await res.json();
            setSettings(result)
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchSettings();
      }, []);

      let socialMediaData = [];
        try {
            socialMediaData = JSON.parse(settings.social_media);
            if (!Array.isArray(socialMediaData)) socialMediaData = [];
        } catch {
            socialMediaData = [];
        }
    
  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-col sm:items-start sm:justify-between">
        <Breadcrumb pageName="Settings" pageNameSecond="" route="" />
      </div>
      <div className="flex flex-col gap-10">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Create Doctor
              </h3>
            </div>
            <div className="p-6.5">
                <div className="mb-4 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <form>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-14 p-1 w-14 rounded-full bg-white flex items-center justify-center">
                                <>
                                {(settings.logo) && (
                                    <Image
                                    width="100"
                                    height="100"
                                    src={`https://nmw.prahwa.net/storage/${settings.logo}`} 
                                    alt="Preview" 
                                    className="w-full rounded-lg"
                                    />
                                )}
                                </>
                            </div>
                            <div>
                                <span className="mb-1.5 font-medium text-dark dark:text-white">
                                Edit your logo
                                </span>
                            </div>
                            </div>

                            <div
                            id="FileUpload"
                            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-500 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
                            >
                            <input
                                type="file"
                                name="profilePhoto"
                                id="profilePhoto"
                                accept="image/png, image/jpg, image/jpeg"
                                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                            />
                            <div className="flex flex-col items-center justify-center">
                                <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                    fill="#e36900"
                                    />
                                    <path
                                    d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                    fill="#e36900"
                                    />
                                </svg>
                                </span>
                                <p className="mt-2.5 text-body-sm font-medium">
                                <span className="text-orange-400">Click to upload</span> or
                                drag and drop
                                </p>
                                <p className="mt-1 text-body-xs">
                                SVG, PNG, JPG or GIF (max, 800 X 800px)
                                </p>
                            </div>
                        </div>
                    </form> 
                  </div>
                  <div className="w-full xl:w-1/2">
                    <form>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-14 p-1 w-14 rounded-full bg-white flex items-center justify-center">
                                <>
                                {(settings.favicon) && (
                                    <Image
                                    width="100"
                                    height="100"
                                    src={`https://nmw.prahwa.net/storage/${settings.favicon}`} 
                                    alt="Preview" 
                                    className="w-full rounded-lg"
                                    />
                                )}
                                </>
                            </div>
                            <div>
                                <span className="mb-1.5 font-medium text-dark dark:text-white">
                                Edit your favicon
                                </span>
                            </div>
                            </div>

                            <div
                            id="FileUpload"
                            className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
                            >
                            <input
                                type="file"
                                name="profilePhoto"
                                id="profilePhoto"
                                accept="image/png, image/jpg, image/jpeg"
                                className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                            />
                            <div className="flex flex-col items-center justify-center">
                                <span className="flex h-13.5 w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                                <svg
                                    width="20"
                                    height="20" 
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                    d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                                    fill="#e36900"
                                    />
                                    <path
                                    d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                                    fill="#e36900"
                                    />
                                </svg>
                                </span>
                                <p className="mt-2.5 text-body-sm font-medium">
                                <span className="text-orange-400">Click to upload</span> or
                                drag and drop
                                </p>
                                <p className="mt-1 text-body-xs">
                                SVG, PNG, JPG or GIF (max, 512px X 512px)
                                </p>
                            </div>
                        </div>
                    </form>
                  </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Email
                        </label>
                        <input
                        type="text"
                        defaultValue={settings.email}
                        placeholder="Enter email"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Phone
                        </label>
                        <input
                        type="text"
                        defaultValue={settings.phone}
                        placeholder="Enter phone"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Title
                        </label>
                        <input
                        type="text"
                        defaultValue={settings.title}
                        placeholder="Enter title"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
                <div className="mb-6 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Meta Description
                        </label>
                        <textarea
                        defaultValue={settings.meta_description}
                        placeholder="Enter meta description"
                        className="w-full rounded-[7px] h-[200px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Address Header
                        </label>
                        <textarea
                        defaultValue={settings.address}
                        placeholder="Enter address header"
                        className="w-full rounded-[7px] h-[200px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Address Footer
                        </label>
                        <textarea
                        defaultValue={settings.address_2}
                        placeholder="Enter address footer"
                        className="w-full rounded-[7px] h-[200px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Navigation Direct Link
                        </label>
                        <input
                        type="text"
                        defaultValue={settings.direct_link}
                        placeholder="Enter navigation direct link"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Copyright
                        </label>
                        <input
                        type="text"
                        defaultValue={settings.copyright}
                        placeholder="Enter copyright"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full mb-7">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Social Media
                    </label>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        socialMediaData.map((item, index) => (
                        <div key={index} className="mb-4 flex flex-col gap-1 xl:flex-row">
                            <input
                                type="text"
                                defaultValue={item.name}
                                placeholder="Enter social media name (Ex: Facebook)"
                                className="w-full xl:w-1/2 rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            />
                            <div className="relative w-full xl:w-1/2">
                                <input
                                    type="text"
                                    defaultValue={item.logo}
                                    placeholder="Enter icon syntax (Ex: <FaFacebook/>)"
                                    className="w-full rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                />
                                <Link className="flex items-center" href={"https://react-icons.github.io/react-icons/"} target="_blank"><button className="bg-orange-400 text-white text-sm px-2 py-0.5 absolute right-4 bottom-52 translate-y-49 rounded-lg">Choose Icon</button></Link>
                            </div>
                            
                            <input
                                type="text"
                                defaultValue={item.link}
                                placeholder="Enter social media link (Ex: https://www.facebook.com/nmwskincarejkt/)"
                                className="w-full xl:w-1/2 rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            />
                            <button className="ml-2 text-red-500 cursor-default">✖</button>
                        </div>
                        ))
                    )}
                    <button className="text-orange-400 border cursor-pointer border-orange-400 px-3 py-2 rounded-[7px] hover:bg-orange-400 hover:text-white cursor-default">
                        Add Social Media
                    </button>
                </div>
                <div className="flex gap-3">
                    <button type="submit" className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        Save Setting
                    </button>
                </div>
            </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
