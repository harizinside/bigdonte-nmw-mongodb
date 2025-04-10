'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect, useRef  } from "react";
import RichEditor from "@/components/rich-editor/page";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const EditPromo = () => {
    const { id } = useParams(); // Ambil ID dokter dari URL
    const router = useRouter();
  
    const [promo, setPromo] = useState({ title: "", start_date: "", slug: "",end_date: "", link: "", image: "", sk: "" });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isCustomLink, setIsCustomLink] = useState(false);
    const [isSlugEdited, setIsSlugEdited] = useState(false);

    useEffect(() => {
        setIsCustomLink(!!promo?.link); 
    }, [promo?.link]); 

    useEffect(() => {
          if (!isSlugEdited && promo.title) {
            const generatedSlug = promo.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, "") // Hapus karakter selain huruf, angka, spasi, dan "-"
              .replace(/\s+/g, "-") // Ganti spasi dengan "-"
              .replace(/-+/g, "-"); // Hapus duplikasi "-"
        
            setPromo((prev) => ({ ...prev, slug: generatedSlug }));
          }
        }, [promo.title, isSlugEdited]);  
   
    // Fetch data dokter berdasarkan ID
    useEffect(() => {
      if (!id) return;
  
      const fetchPromo = async () => {
        try {
  
          const res = await fetch(`/api/promos/${id}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
          });

          if (!res.ok) throw new Error("Gagal mengambil data promo");
  
          const responseData = await res.json();
  
          if (responseData) {
            setPromo(responseData);
            setPreviewImage(responseData.image);
          }
          
        } catch (error) {
          console.error(error);
          
        } finally {
          setLoading(false);
        }
      };
  
      fetchPromo();
    }, [id]);
  
    // Handle Update
    const handleUpdate = async (e: React.FormEvent) => { 
        e.preventDefault();
        setUpdating(true);
      
        const formData = new FormData();
        
        formData.append("title", promo.title || "");
        formData.append("sk", promo.sk || "");
        formData.append("slug", promo.slug);
        formData.append("start_date", promo.start_date || "");
        formData.append("end_date", promo.end_date || "");
        formData.append("link", promo.link || "");
        // Kirim link hanya jika ada, jika kosong kirim ""
        formData.append("link", promo.link ? promo.link : "");
      
        // Kirim file gambar jika ada
        if (image) {
          formData.append("image", image);
        }
      
        try {
          const res = await fetch(`/api/promos/${id}`, {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            body: formData, 
          });
      
          if (!res.ok) throw new Error("Gagal memperbarui data promo");
      
          setMessage("Promo successfully updated!");
          setIsOpen(true);
        } catch (error) {
          console.error("Update error:", error);
          setMessage("Error updating promo: " + error);
          setIsOpen(true);
        } finally {
          setUpdating(false);
        }
      };
      
  
  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/promo");
  }

  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="dashboard/promo" pageName="Manage Promo" routeSecond="" pageNameSecond="/ Edit" routeThird="" pageNameThird={`/ ${promo?.title}`} routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
        </div>

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
            <form onSubmit={handleUpdate} encType="multipart/form-data">
                <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex justify-between items-center">
                        <h3 className="font-semibold text-dark dark:text-white">Edit Promo</h3>
                    
                    </div>
                    
                    <div className="p-6.5">
                    <div className="w-40 h-auto mb-5 overflow-hidden object-cover object-center ">
                        {(previewImage || promo?.image) && (
                          <Image
                            width={800}
                            height={800}
                            src={(previewImage || promo?.image) as string}
                            priority
                            alt="Preview"
                            className="w-full rounded-lg"
                          />
                        )}
                    </div>
                    {isCustomLink ? (
                        <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Image
                            </label>
                            <input
                            type="file"
                            accept="image/*"
                                onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImage(file);
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                                }}
                            className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            />
                        </div>
                        <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Custom Link
                                <span className="text-red">*</span>
                                </label>
                                <input
                                type="text"
                                placeholder="Enter custom link"
                                defaultValue={promo.link}
                                onChange={(e) => setPromo({ ...promo, link: e.target.value })}
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                                />
                            </div>
                        </div>
                    ) : (
                        // Form Default
                        <>
                        <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setImage(file);
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                                }}
                                className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                            />
                            </div>
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                Promo Title
                                <span className="text-red">*</span>
                                </label>
                                <input
                                type="text"
                                placeholder="Enter promo title"
                                defaultValue={promo.title} 
                                onChange={(e) => setPromo({ ...promo, title: e.target.value })}
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                                />
                            </div>
                        </div>
                        <div className="mb-7 flex flex-col gap-4.5 xl:flex-row w-full">
                            <div className="w-full">
                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">S&K</label>
                                <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                                    <RichEditor value={promo?.sk || ""} onChange={(html) => setPromo({ ...promo, sk: html })} />
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
                                    defaultValue={promo.start_date} 
                                    onChange={(e) => setPromo({ ...promo, start_date: e.target.value })}
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
                                    defaultValue={promo.end_date} 
                                    onChange={(e) => setPromo({ ...promo, end_date: e.target.value })}
                                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                                    />
                                    <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <input
                          type="text"
                          value={promo.slug}
                          onChange={(e) => {
                            setPromo((prev) => ({ ...prev, slug: e.target.value }));
                            setIsSlugEdited(true); // Tandai bahwa slug telah diedit user
                          }}
                          className="hidden"
                        />
                        </>
                    )}
                        <div className="flex gap-3">
                            <button type="submit" disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                                {updating ? "Updating..." : "Update"}
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
    </DefaultLayout>
  );
};

export default EditPromo;