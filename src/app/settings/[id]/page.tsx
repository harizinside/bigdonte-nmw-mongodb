'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type Setting = {
  _id: number;
  email:string;
  phone: string;
  title: string;
  meta_description: string;
  address_header: string;
  address_footer: string;
  direct_link: string;
  logo: string;
  favicon: string;
};

type Social = {
  length: number;
  _id: number;
  title: string;
  link: string;
};

const Settings = () => {
    const { id } = useParams(); // Ambil ID dokter dari URL
    const router = useRouter();

    const [settings, setSettings] = useState({ email: "", phone: "", title: "", direct_link: "", meta_description: "", address_header: "", address_footer: "", logo: "", favicon: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenSocial, setIsOpenSocial] = useState(false);
    const [isOpenSocialDelete, setIsOpenSocialDelete] = useState(false);
    const [message, setMessage] = useState("");
    const [updating, setUpdating] = useState(false);
    const [logo, setLogo] = useState<File | null>(null);
    const [favicon, setFavicon] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewImageFavicon, setPreviewImageFavicon] = useState<string | null>(null);
    const [linkSocial, setLinkSocial] = useState("");
    const [socialMedia, setSocialMedia] = useState("");
    const [socialTitle, setSocialTitle] = useState("");
    const [socialMediaData, setSocialMediaData] = useState<Social[]>([]);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);

      const [refreshTrigger, setRefreshTrigger] = useState(false);

      useEffect(() => {
        const fetchSocialMedia = async () => {
          try {
            const response = await fetch(`/api/social`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error("Gagal mengambil data social media");
            }

            const result = await response.json();
            setSocialMediaData(result);
          } catch (error) {
            console.error("Gagal mengambil data social media:", error);
          }
        };

        fetchSocialMedia();
      }, [refreshTrigger]); // useEffect akan berjalan setiap refreshTrigger berubah

      // Panggil setRefreshTrigger(!refreshTrigger) setelah tambah/hapus data
      const handleSuccess = () => {
        setRefreshTrigger(prev => !prev); // Toggle state untuk memicu useEffect
      };

      useEffect(() => {
        if (!id) return;
      
        const fetchSettings = async () => {
          try {
            const response = await fetch(`/api/settings/${id}`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                "Content-Type": "application/json",
              },
            });
      
            const responseData = await response.json();
      
            if (responseData) {
              setSettings(responseData);
              setPreviewImage(responseData.logo);
              setPreviewImageFavicon(responseData.favicon);
            }
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchSettings();
      }, [id]); // Hapus settings dari dependensi      

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!settings) return;
      
        setSettings({
          ...settings,
          [e.target.name]: e.target.value, // Update field yang diubah
        });
      };
    
      // Fungsi untuk menangani unggah gambar
      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setLogo(file);
          setPreviewImage(URL.createObjectURL(file));
        }
      };

      const handleImageFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setFavicon(file);
          setPreviewImageFavicon(URL.createObjectURL(file));
        }
      };

      const handleUpdate = async (e: React.FormEvent) => { 
        e.preventDefault();
        setUpdating(true);
       
        const formData = new FormData();
        formData.append("email", settings.email);
        formData.append("phone", settings.phone);
        formData.append("title", settings.title);
        formData.append("meta_description", settings.meta_description);
        formData.append("address_header", settings.address_header);
        formData.append("address_footer", settings.address_footer);
        formData.append("direct_link", settings.direct_link);
      
        // Kirim file gambar jika ada perubahan
        if (logo) {
          formData.append("logo", logo);
        }

        if (favicon) {
          formData.append("favicon", favicon);
        }

        Array.from(formData.entries()).forEach(([key, value]) => {
          console.log(`${key}:`, value);
        });        
      
        try {
          const res = await fetch(`/api/settings/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            body: formData, // Jangan tambahkan Content-Type
          });          
      
          if (!res.ok) throw new Error("Gagal memperbarui data Setting");
      
          setMessage("Setting successfully updated!");
          setIsOpen(true);
        } catch (error) {
          console.error("Update error:", error);
          setMessage("Error updating Setting: " + error);
          setIsOpen(true);
        } finally {
          setUpdating(false);
        }
      };
         
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman
        setLoading(true);
      
        if (!linkSocial || !socialMedia || !socialTitle) {
          setMessage("Please fill in all required fields!");
          setIsOpen(true);
          return;
        }
      
        try {
          const formData = new FormData();
          formData.append("link", linkSocial); 
          formData.append("icon", socialMedia); // Icon sebagai value
          formData.append("title", socialTitle); // Title dari option
      
          const response = await axios.post("/api/social", formData, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
              "Content-Type": "multipart/form-data",
            },
          });
      
          if (response.status === 201) {
            setIsOpenSocial(false);
            setSocialMedia("");
            setSocialTitle("");
            setLinkSocial("");
            handleSuccess(); 
          } else {
            setMessage("Gagal menambahkan Social Media.");
          }
        } catch (error) {
          setMessage("Error creating Social Media: " + error);
          setIsOpenSocial(false);
        } finally {
          setLoading(false);
        }
      };
      
      const handleDeleteSocial = async (id: string | number) => {
        try {
          setLoadingDelete(true);
          const response = await fetch(`/api/social/${id}`, {
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
          });
      
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          setSocialMediaData((prevSocial) => prevSocial.filter((social) => social._id !== id));
          setSelectedSocial(null);
          setIsOpenSocialDelete(false);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingDelete(false);
        }
      };
        
      const handlePush = () => {
          setIsOpen(false);
          router.push("/settings/67daf4822231c37a8362a38a");
        }
    
  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-col sm:items-start sm:justify-between">
        <Breadcrumb pageName="Settings" pageNameSecond="" route="" pageNameThird="" pageNameFour="" pageNameFive="" />
      </div>
      <div className="flex flex-col gap-10">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Setting
              </h3>
            </div>
            <div className="p-6.5">
                <form onSubmit={handleUpdate} encType="multipart/form-data">
                    <div className="mb-4 flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-14 p-1 w-14 rounded-full bg-white flex items-center justify-center">
                                    <>
                                      {(previewImage || settings.logo) && (
                                        <Image
                                          width={100}
                                          height={100}
                                          src={(previewImage || settings.logo) as string}
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
                                        onChange={handleImageChange}
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
                        </div>
                        <div className="w-full xl:w-1/2">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="h-14 p-1 w-14 rounded-full bg-white flex items-center justify-center">
                                        <>
                                        {(previewImageFavicon || settings?.favicon) && (
                                          <Image
                                            width={100}
                                            height={100}
                                            src={(previewImageFavicon || settings?.favicon) as string}
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
                                        onChange={handleImageFaviconChange}
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
                              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                              placeholder="Enter email"
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
                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                            placeholder="Enter title"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
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
                            onChange={(e) => setSettings({ ...settings, direct_link: e.target.value })}
                            placeholder="Enter navigation direct link"
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
                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                            placeholder="Enter phone"
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
                            onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                            placeholder="Enter meta description"
                            className="w-full rounded-[7px] h-[200px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Address Header
                            </label>
                            <textarea
                            defaultValue={settings.address_header}
                            onChange={(e) => setSettings({ ...settings, address_header: e.target.value })}
                            placeholder="Enter address header"
                            className="w-full rounded-[7px] h-[200px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Address Footer
                            </label>
                            <textarea
                            defaultValue={settings.address_footer}
                            onChange={(e) => setSettings({ ...settings, address_footer: e.target.value })}
                            placeholder="Enter address footer"
                            className="w-full rounded-[7px] h-[200px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                    </div>
                    <div className="mb-7">
                        <div className="flex mb-3 justify-between">
                          <label className="block text-body-sm font-medium text-dark dark:text-white">
                            Social Media
                          </label>
                          <button type="button" onClick={() => setIsOpenSocial(true)} className="text-body-sm font-medium text-dark dark:text-white">+Add Social Media</button>
                        </div>
                        <table className="w-full table-auto">
                            <thead>
                              <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                                <th className="w-max px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                                  No
                                </th>
                                <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                                  Title
                                </th>
                                <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                                  Link
                                </th>
                                <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {socialMediaData.map((social, index) => (
                                <tr key={index}>
                                  <td
                                    className={`border-[#eee] px-4 text-center py-4 dark:border-dark-3 w-0 xl:pl-9 ${
                                      index === social.length - 1 ? "border-b-0" : "border-b"
                                    }`}
                                  >
                                    <div className="w-0">{index + 1}</div>
                                  </td>
                                  <td
                                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 w-150 xl:pl-5 ${index === social.length - 1 ? "border-b-0" : "border-b"}`}
                                  >
                                    <h5 className="text-dark dark:text-white">
                                      {social.title}
                                    </h5>
                                  </td>
                                  <td
                                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === social.length - 1 ? "border-b-0" : "border-b"}`}
                                  >
                                    <p className="text-dark dark:text-white">
                                      {social.link}
                                    </p>
                                  </td>
                                  <td
                                    className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === social.length - 1 ? "border-b-0" : "border-b"}`}
                                  >
                                    <div className="flex items-center justify-end space-x-3.5">
                                      <button type="button" className="hover:text-red" onClick={() => { setSelectedSocial(social); setIsOpenSocialDelete(true); }}> 
                                        <svg
                                          className="fill-current"
                                          width="22" 
                                          height="22"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" onClick={handleUpdate} disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                            {updating ? "Saving..." : "Save Setting"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
      {/* POPUP CREATE */}
      <div className={`fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ${isOpenSocial ? 'block' : 'hidden'}`}>
        <div className="dark:bg-dark-2 bg-white text-center rounded-2xl p-6 py-9 w-1/3 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
              <div className="w-full text-start">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Social Media
                </label> 
                <select
                  value={socialMedia}
                  onChange={(e) => {
                    setSocialMedia(e.target.value); // Simpan icon sebagai value
                    setSocialTitle(e.target.options[e.target.selectedIndex].text); // Simpan title dari option
                  }}
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                >
                  <option value="">-- Select Social Media --</option>
                  <option value="<FaFacebook />">Facebook</option>
                  <option value="<FaInstagram />">Instagram</option>
                  <option value="<FaYoutube />">Youtube</option>
                  <option value="<FaTiktok />">Tiktok</option>
                  <option value="<FaWhatsapp />">Whatsapp</option>
                  <option value="<RiTwitterXFill />">Twitter</option>
                </select>
              </div>
              <div className="w-full text-start">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Social Media Link
                </label>
                <input
                  type="text"
                  name="social"
                  value={linkSocial}
                  onChange={(e) => setLinkSocial(e.target.value)}
                  placeholder="Enter social media link"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                />
              </div>
            </div>
            <div className="flex justify-start gap-3">
              <button
                type="button"
                onClick={() => setIsOpenSocial(false)}
                className="flex w-max gap-2 justify-center rounded-[7px] bg-red-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading} 
                className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90"
              >
                 {loading ? "Saving..." : "Save Social Media"}
              </button>
            </div>
          </form>
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
      {isOpenSocialDelete && selectedSocial && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-35 z-999 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 py-9 w-1/3 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">
                Are you sure you want to delete <strong>{selectedSocial.title}</strong>?
              </p>
              <div className="flex justify-center gap-3">
                <button className="bg-gray-200 hover:bg-gray-300 text-lg text-gray-600 py-2 px-5 rounded-lg cursor-pointer" onClick={() => setSelectedSocial(null)}>
                  Cancel
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-lg text-white py-2 px-5 rounded-lg cursor-pointer" onClick={() => handleDeleteSocial(selectedSocial._id)}>
                  {loadingDelete ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
    </DefaultLayout>
  );
};

export default Settings;