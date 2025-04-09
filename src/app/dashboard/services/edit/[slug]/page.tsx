'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo  } from "react";
import RichEditor from "@/components/rich-editor/page";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

const EditService = () => {
    const { slug } = useParams(); // Ambil slug service dari URL
    const router = useRouter();
  
    const [service, setService] = useState({ name: "", slug: "",description: "", phone: "", sensitive_content: false, template:false, imageBanner: "", imageCover: ""});
    const [loading, setLoading] = useState(true);
    const [, setSlug] = useState("");
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
    const [imageSecond, setImageSecond] = useState<File | null>(null); // Perbaiki tipe state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    // Pastikan state diinisialisasi dengan tipe boolean
    const [template, setTemplate] = useState<boolean | null>(null);
    const [isSlugEdited, setIsSlugEdited] = useState(false);
    // Fetch data dokter berdasarkan ID
    useEffect(() => {
      if (!slug) return;
    
      const fetchService = async () => {
        try {
          const response = await fetch(`/api/services/${slug}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
          });
          
          if (!response.ok) throw new Error("Gagal mengambil data service");
    
          const responseData = await response.json();
    
          setService(responseData)

          setTemplate(responseData.template);
          setPreviewImage(responseData.imageCover);
        } catch (error) { 
          console.error("Error fetching service:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchService();
    }, [slug]);

    const handleSelectionTemplate = (value: boolean) => {
      setTemplate(value);
      setService((prev) => ({ ...prev, template: value }));
    };

    useEffect(() => {
      setTemplate(service.template);
    }, [service]);

    useEffect(() => {
      if (!isSlugEdited && service.name) {
        const generatedSlug = service.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, "") // Hapus karakter selain huruf, angka, spasi, dan "-"
          .replace(/\s+/g, "-") // Ganti spasi dengan "-"
          .replace(/-+/g, "-"); // Hapus duplikasi "-"
    
        setService((prev) => ({ ...prev, slug: generatedSlug }));
      }
    }, [service.name, isSlugEdited]);  
    
    const isTemplateChecked = (service: { template: any; }, value: any) => {
      return service.template === value;
    };
  
    // Handle Update
    const handleUpdate = async (e: React.FormEvent) => { 
        e.preventDefault();
        setUpdating(true);
      
        const formData = new FormData();
        formData.append("name", service.name || "");
        formData.append("slug", service.slug);
        formData.append("description", service.description || "");
        formData.append("phone", service.phone || "");
        formData.append("template", service.template ? "1" : "0");
      
        // Kirim file gambar jika ada
        if (image) {
          formData.append("imageBanner", image);
        }
        if (imageSecond) {
          formData.append("imageCover", imageSecond);
        }
      
        try {
          const response = await fetch(`/api/services/${slug}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            body: formData,
          });
      
          if (!response.ok) throw new Error("Gagal memperbarui data services");
      
          setMessage("Service successfully updated!");
          setIsOpen(true);
        } catch (error) {
          console.error("Update error:", error);
          setMessage("Error updating service: " + error);
          setIsOpen(true);
        } finally {
          setUpdating(false);
        }
      };
      
  
  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/services");
  }

  const formatSlugToTitle = (slug: string) => {
    return slug
      .split("-") // Pisahkan berdasarkan "-"
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama jadi kapital
      .join(" "); // Gabungkan kembali dengan spasi
  };

  const formattedTitleList = formatSlugToTitle(Array.isArray(slug) ? slug[0] : slug);

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="dashboard/services" pageName="Manage Services" routeSecond={`dashboard/services/edit/${slug}`} pageNameSecond={`/ Edit`} routeThird={`dashboard/services/edit/${slug}`} pageNameThird={`/ ${formattedTitleList}`} routeFour="" pageNameFour="" routeFive="" pageNameFive="" />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9"> 
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            {/* <form action="#"> */}
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="p-6.5 ">
                <div className="flex gap-4.5 xl:flex-row mb-7 items-end">
                    <div className="w-full xl:w-1/2 ">
                        <div className="w-80 h-auto mb-5 overflow-hidden object-cover object-center ">
                            {(service.imageBanner) && (
                                <Image
                                    width="300"
                                    height="370"
                                    src={`${service.imageBanner}`} 
                                    alt="Preview"
                                    priority
                                    className="w-full rounded-md"
                                />
                            )}
                        </div>
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Banner Image
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
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <div className="w-80 h-auto mb-5 overflow-hidden object-cover object-center ">
                            {(service.imageCover) && (
                                <Image
                                    width="300"
                                    height="370"
                                    src={`${service.imageCover}`} 
                                    alt="Preview"
                                    priority
                                    className="w-full rounded-md"
                                />
                            )}
                        </div>
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Cover Image
                        </label>
                        <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImageSecond(file);
                                setPreviewImage(URL.createObjectURL(file));
                            }
                        }}
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Service Name
                        <span className="text-red">*</span>
                      </label> 
                      <input
                        type="text"
                        placeholder="Enter service name"
                        defaultValue={service.name}
                        onChange={(e) => setService({ ...service, name: e.target.value })}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                      />
                  </div>
                  <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Service Phone
                        <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter service phone (Ex: 6281280360370 )"
                        defaultValue={service.phone}
                        onChange={(e) => setService({ ...service, phone: e.target.value })}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                      />
                  </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Service Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor value={service?.description || ""} onChange={(html) => setService({ ...service, description: html })}/>
                    </div>
                  </div>
                </div>
                
                <div> 
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Choose Service Page Template
                    </label>
                    <ul className="grid w-full gap-6 md:grid-cols-2">
                      <li>
                        <input
                          type="radio"
                          id="template-1"
                          name="hosting"
                          value="true"
                          checked={template === true}
                          onChange={() => handleSelectionTemplate(true)}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="template-1"
                          className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-orange-500 peer-checked:border-orange-600 dark:peer-checked:border-orange-600 peer-checked:text-orange-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <div className="block w-full xl:w-full">
                            <Image
                              width={500}
                              height={52}
                              src={"/images/template/template_1.png"}
                              alt="Template 1"
                              style={{ width: "auto", height: "auto", borderRadius: "1vw" }}
                            />
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </label>
                      </li>

                      <li>
                        <input
                          type="radio"
                          id="template-2"
                          name="hosting"
                          value="false"
                          checked={template === false}
                          onChange={() => handleSelectionTemplate(false)}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="template-2"
                          className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-orange-500 peer-checked:border-orange-600 dark:peer-checked:border-orange-600 peer-checked:text-orange-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <div className="block w-full xl:w-full">
                            <Image
                              width={500}
                              height={52}
                              src={"/images/template/template_2.png"}
                              alt="Template 2"
                              style={{ width: "auto", height: "auto", borderRadius: "1vw" }}
                            />
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </label>
                      </li>

                    </ul>
                </div>
                <input
                  type="text"
                  value={service.slug}
                  onChange={(e) => {
                    setService((prev) => ({ ...prev, slug: e.target.value }));
                    setIsSlugEdited(true); // Tandai bahwa slug telah diedit user
                  }}
                  className="hidden"
                />

                <div className="flex gap-3 mt-7">
                    <button type="submit" disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {updating ? "Updating..." : "Update"}
                    </button>
                    <Link href={'/dashboard/services'}>
                        <button type="button" className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
                            Cancel
                        </button>
                    </Link>
                </div>
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

export default EditService;