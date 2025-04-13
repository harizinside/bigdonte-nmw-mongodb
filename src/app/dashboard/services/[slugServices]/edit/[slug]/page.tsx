'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo  } from "react";
import RichEditor from "@/components/rich-editor/page";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type Service = {
  name: string;
  slug: string;
  keywords: string[]; // <-- ini penting!
  description: string;
  phone: string;
  sensitive_content: boolean;
  imageBanner: string;
  imageCover: string;
};

const EditServiceList = () => {
    const { slugServices, slug } = useParams(); // Ambil slug service dari URL
    const router = useRouter();
  
    const [service, setService] = useState<Service>({
      name: "",
      slug: "",
      keywords: [],
      description: "",
      phone: "",
      sensitive_content: false,
      imageBanner: "",
      imageCover: "",
    });
    const [loading, setLoading] = useState(true);
    const [, setSlug] = useState("");
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
    const [imageSecond, setImageSecond] = useState<File | null>(null); // Perbaiki tipe state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewImageBanner, setPreviewImageBanner] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    // Pastikan state diinisialisasi dengan tipe boolean
    const [sensitiveContent, setSensitiveContent] = useState<boolean>(service.sensitive_content);
    const [template, setTemplate] = useState<boolean | null>(null);
    const [isSlugEdited, setIsSlugEdited] = useState(false);
    const [keywordsString, setKeywordsString] = useState("");
    // Fetch data dokter berdasarkan ID
    useEffect(() => {
      if (!slug) return; 
    
      const fetchService = async () => {
        try {
          const response = await fetch(`/api/servicesList/${slug}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
          });
          
          if (!response.ok) throw new Error("Gagal mengambil data service");
    
          const responseData = await response.json();
    
          setService(responseData)
          // Konversi template ke string yang cocok dengan radio button
          setSensitiveContent(responseData.sensitive_content);
          setPreviewImage(responseData.imageCover);
          setPreviewImageBanner(responseData.imageBanner);
          setKeywordsString(responseData.keywords.join(", ") || "");
        } catch (error) { 
          console.error("Error fetching service:", error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchService();
    }, [slug]);

    const handleSelection = (value: boolean) => {
      setSensitiveContent(value);
      setService((prev) => ({ ...prev, sensitive_content: value }));
    };   

    useEffect(() => {
      setSensitiveContent(service.sensitive_content);
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

    const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setKeywordsString(value);
    
      if (service) {
        setService({
          ...service,
          keywords: value
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0),
        });
      }
    };
  
    // Handle Update
    const handleUpdate = async (e: React.FormEvent) => { 
        e.preventDefault();
        setUpdating(true);
      
        const formData = new FormData();
        formData.append("name", service.name || "");
        formData.append("slug", service.slug);
        formData.append("description", service.description || "");
        formData.append("sensitive_content", service.sensitive_content ? "1" : "0"); 
      
        // Kirim file gambar jika ada
        if (image) {
          formData.append("imageBanner", image);
        }
        if (imageSecond) {
          formData.append("imageCover", imageSecond);
        }

        service.keywords.forEach(keywords => formData.append("keywords", keywords));
      
        try {
          const response = await fetch(`/api/servicesList/${slug}`, {
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
    router.push(`/dashboard/services/${slugServices}`);
  }

  const formatSlugToTitle = (slug: string) => {
    return slug
      .split("-") // Pisahkan berdasarkan "-"
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama jadi kapital
      .join(" "); // Gabungkan kembali dengan spasi
  };

  const formattedTitle = formatSlugToTitle(Array.isArray(slugServices) ? slugServices[0] : slugServices);
  const formattedTitleList = formatSlugToTitle(Array.isArray(slug) ? slug[0] : slug);

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Breadcrumb route="dashboard/services" pageName="Manage Services" routeSecond={`dashboard/services/${slugServices}`} pageNameSecond={`/ ${formattedTitle}`} routeThird={`dashboard/services/${slugServices}/edit/${service.slug}`} pageNameThird={`/ Edit ${formattedTitleList}`} routeFour="" pageNameFour="" routeFive="" pageNameFive="" />
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
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Banner Image
                        </label>
                        <div
                          id="FileUpload"
                          className="relative block w-full h-65 cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-500 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
                        >
                        <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImage(file);
                                setPreviewImageBanner(URL.createObjectURL(file));
                              }
                              }}
                            name="profilePhoto"
                            id="profilePhoto"
                            accept="image/png, image/jpg, image/jpeg"
                            className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                        />

                            <div className="flex flex-col items-center justify-center">
                                {/* Preview image di sini */}
                                {(previewImageBanner) && (
                                <Image
                                    width={800}
                                    height={800}
                                    src={previewImageBanner}
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
                          Upload Cover Image
                      </label>
                      <div
                        id="FileUpload"
                        className="relative block w-full h-65 cursor-pointer appearance-none rounded-xl border border-dashed border-gray-4 bg-gray-2 px-4 py-4 hover:border-orange-500 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-orange-400 sm:py-7.5"
                      >
                      <input 
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImageSecond(file);
                                setPreviewImage(URL.createObjectURL(file));
                            }
                            }}
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
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-full">
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
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Service Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor value={service?.description || ""} onChange={(html) => setService({ ...service, description: html })}/>
                    </div>
                  </div>
                </div>
                <div className="mb-0 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-full">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Service List Keywords
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
                <div className="mt-7 mb-7 w-full">
                  <div className="flex gap-4">
                    {/* Tombol untuk TRUE */}
                    <button
                      type="button"
                      onClick={() => handleSelection(true)}
                      className={`w-full xl:w-1/2 px-6 py-2 font-medium rounded-lg transition-all ${
                        sensitiveContent === true ? "bg-red-500 border-red-500 text-white" : "bg-red-500 border-red-500 text-white opacity-30 hover:opacity-100"
                      } border-2`}
                    >
                      Sensitive Content
                    </button>

                    {/* Tombol untuk FALSE */}
                    <button
                      type="button"
                      onClick={() => handleSelection(false)}
                      className={`w-full xl:w-1/2 px-6 py-2 font-medium rounded-lg transition-all ${
                        sensitiveContent === false ? "bg-green-500 border-green-500 text-white" : "bg-green-500 border-green-500 text-white opacity-30 hover:opacity-100"
                      } border-2`}
                    >
                      Not Sensitive Content
                    </button> 
                  </div>
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

                <div className="flex gap-3 mt-1">
                    <button type="submit" disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {updating ? "Updating..." : "Update"}
                    </button>
                    <Link href={`/dashboard/services/${slugServices}`}>
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

export default EditServiceList;