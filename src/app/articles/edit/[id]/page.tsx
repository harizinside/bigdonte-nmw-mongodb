"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import RichEditor from "@/components/rich-editor/page";
 
type Product = {
    productName: string;
    productLink: string;
    productDescription: string;
    productImage: string;
  };
  
  type Article = {
    title: string;
    image: string;
    image_source_name: string;
    image_source: string;
    author: string;
    editor: string;
    source_link: string;
    category_id: string;
    description: string;
    tags: string;
    date: string;
    service: string;
    doctor: string;
    products: string | Product[];
  };
  

const EditArticle = () => {
    const { id } = useParams(); // Ambil ID dokter dari URL
    const router = useRouter();
    
    const [doctors, setDoctors] = useState<any[]>([]); 
    const [services, setServices] = useState<any[]>([]);
    const [article, setArticle] = useState<Article>({
        title: "",
        image: "",
        image_source_name: "",
        image_source: "",
        author: "",
        editor: "",
        source_link: "",
        category_id: "",
        description: "",
        tags: "",
        date: "",
        service: "",
        doctor: "",
        products: [], // inisial sebagai array kosong
      });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [selectedService, setSelectedService] = useState<string>("");
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
      
    useEffect(() => {
        // Hanya lakukan parsing jika article.products masih berupa string
        if (article.products && typeof article.products === "string") {
          try {
            const parsed = JSON.parse(article.products);
            if (Array.isArray(parsed)) {
              const formattedProducts = parsed.map((prod: any) => ({
                productName: prod.name ? prod.name.trim() : "",
                productLink: prod.link ? prod.link.trim() : "",
                productDescription: prod.description ? prod.description.trim() : "",
                productImage: prod.image ? prod.image.trim() : "",
              }));
              // Hanya update state jika format baru berbeda dari state saat ini
              setArticle((prev) => ({ ...prev, products: formattedProducts }));
            }
          } catch (error) {
            console.error("Error parsing products:", error);
          }
        }
        // Jika article.products sudah berupa array, jangan lakukan update lagi
      }, [article.products]);
       // Jalankan hanya saat `branch.operasional` berubah      
      

       const addProduct = () => {
            setArticle((prev) => ({
            ...prev,
            products: typeof prev.products === "string"
                ? [{ productName: "", productLink: "", productDescription: "", productImage: "" }]
                : [...prev.products, { productName: "", productLink: "", productDescription: "", productImage: "" }],
            }));
        };
      
    
        const handleProductChange = (
            index: number,
            value: string,
            field: "productName" | "productLink" | "productDescription" | "productImage"
          ) => {
            setArticle((prev) => {
              if (typeof prev.products === "string") {
                // Jika products masih berupa string, kita konversi ke array kosong terlebih dahulu.
                return {
                  ...prev,
                  products: []
                };
              }
              return {
                ...prev,
                products: prev.products.map((op, i) =>
                  i === index ? { ...op, [field]: value } : op
                )
              };
            });
          };
    
          const removeProduct = (index: number) => {
            setArticle((prev) => {
              if (typeof prev.products === "string") {
                // Jika products masih berupa string, kita bisa mengubahnya menjadi array kosong atau melakukan penanganan lain
                return { ...prev, products: [] };
              }
              return {
                ...prev,
                products: prev.products.length > 1
                  ? prev.products.filter((_, i) => i !== index)
                  : prev.products, // Mencegah penghapusan semua data
              };
            });
          };          

    // Fetch data dokter berdasarkan ID
    useEffect(() => {
        if (!id) return;
    
        const fetchBranch = async () => {
          try {
    
            const res = await fetch(`/api/articlesDetail/${id}`);
            if (!res.ok) throw new Error("Gagal mengambil data branch");
    
            const responseData = await res.json();
    
            if (responseData.data) {
              setArticle(responseData.data);
              setPreviewImage(responseData.data.image);
            }
            
          } catch (error) {
            console.error(error);
            
          } finally {
            setLoading(false);
          }
        };
    
        fetchBranch();
      }, [id]);

      useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const response = await fetch('/api/doctorsAll');
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            // Asumsikan data dokter ada di result
            setDoctors(result);
          } catch (error) {
            console.error("Error fetching doctors:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchDoctors();
      }, []);
    
      useEffect(() => {
        const fetchServices = async () => {
          try {
            const response = await fetch(`/api/servicesOne`);
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            // Asumsikan data layanan ada di result.data
            setServices(result.data);
          } catch (error) {
            console.error("Error fetching services:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchServices();
      }, []);

      useEffect(() => {
        if (article.doctor) {
          try {
            const doctorData = JSON.parse(article.doctor);
            setSelectedDoctor(String(doctorData.id));
          } catch (error) {
            console.error("Error parsing article.doctor:", error);
          }
        }
      }, [article.doctor]);

      useEffect(() => {
        if (article.service) {
          try {
            const serviceData = JSON.parse(article.service);
            setSelectedService(String(serviceData.id));
          } catch (error) {
            console.error("Error parsing article.doctor:", error);
          }
        }
      }, [article.service]);

      const changeTextColor = () => {
        setIsOptionSelected(true);
      };

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="articles" pageName="Manage Articles" pageNameSecond="/ Create" pageNameThird="" pageNameFour="" pageNameFive=""/>
        </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Article Image
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="h-auto mb-6 w-44 rounded-lg bg-white flex items-center justify-center">
                    <>
                    {(article.image) && (
                        <Image
                        width="100"
                        height="100"
                        src={`${article.image}`} 
                        alt={article.title} 
                        className="w-full rounded-lg"
                        />
                    )}
                    </>
                </div>
                <div className="mb-7">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Upload Image
                    </label>
                    <input
                    type="file"
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                    />
                </div>
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Image Source Name
                        </label>
                        <input
                        type="text"
                        value={article.image_source_name}
                        placeholder="Image By : "
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Image Source Link
                        </label>
                        <input
                        type="text"
                        value={article.image_source}
                        placeholder="Enter image source link"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
              </div>

            {/* </form> */}
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Article Content
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-0 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Article Title
                        </label>
                        <input
                        type="text"
                        value={article.title}
                        placeholder="Enter article title"
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
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
                                value={article.date}
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                            />
                            <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Article Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                        <RichEditor
                            value={article.description || ""}
                            onChange={(html) => setArticle({ ...article, description: html })}
                        />
                    </div>
                  </div>
                </div>
              </div>
            {/* </form> */} 

            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white"> 
                Article Additional
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <div className="flex flex-col w-full xl:w-1/2">
                    <div className="mb-4.5">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Doctor
                        </label>

                        <div className="relative z-20 bg-transparent dark:bg-dark-2">
                        <select
                        value={selectedDoctor}
                        onChange={(e) => {
                            setSelectedDoctor(e.target.value);
                            changeTextColor();
                        }}
                        className={`relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400 ${
                            selectedDoctor ? "text-dark dark:text-white" : ""
                        }`}
                        >
                        <option value="" disabled className="text-dark-6">
                            Choose Doctor
                        </option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id} className="text-dark-6">
                            {doctor.name}
                            </option>
                        ))}
                        </select>
                        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M8.99922 12.8249C8.83047 12.8249 8.68984 12.7687 8.54922 12.6562L2.08047 6.2999C1.82734 6.04678 1.82734 5.65303 2.08047 5.3999C2.33359 5.14678 2.72734 5.14678 2.98047 5.3999L8.99922 11.278L15.018 5.34365C15.2711 5.09053 15.6648 5.09053 15.918 5.34365C16.1711 5.59678 16.1711 5.99053 15.918 6.24365L9.44922 12.5999C9.30859 12.7405 9.16797 12.8249 8.99922 12.8249Z"
                            fill=""
                            />
                        </svg>
                        </span>
                        </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full xl:w-1/2">
                    <div className="mb-4.5">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Service
                        </label>

                        <div className="relative z-20 bg-transparent dark:bg-dark-2">
                        <select
                        value={selectedService}
                        onChange={(e) => {
                            setSelectedService(e.target.value);
                            changeTextColor();
                        }}
                        className={`relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400 ${
                            selectedService ? "text-dark dark:text-white" : ""
                        }`}
                        >
                        <option value="" disabled className="text-dark-6">
                            Choose Doctor
                        </option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id} className="text-dark-6">
                            {service.name}
                          </option>
                        ))}
                        </select>
                        <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M8.99922 12.8249C8.83047 12.8249 8.68984 12.7687 8.54922 12.6562L2.08047 6.2999C1.82734 6.04678 1.82734 5.65303 2.08047 5.3999C2.33359 5.14678 2.72734 5.14678 2.98047 5.3999L8.99922 11.278L15.018 5.34365C15.2711 5.09053 15.6648 5.09053 15.918 5.34365C16.1711 5.59678 16.1711 5.99053 15.918 6.24365L9.44922 12.5999C9.30859 12.7405 9.16797 12.8249 8.99922 12.8249Z"
                            fill=""
                            />
                        </svg>
                        </span>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Author Name
                        </label>
                        <input
                            type="text"
                            value={article.author}
                            placeholder="Enter author name"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Editor Name
                        </label>
                        <input
                            type="text"
                            value={article.editor}
                            placeholder="Enter editor name"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Article Tags
                        </label>
                        <input
                            type="text"
                            value={article.tags}
                            placeholder="separate with commas (clinic, nmw, skincare)"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Article Source Link
                        </label>
                        <input
                            type="text"
                            value={article.source_link}
                            placeholder="Enter article source"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
                
              </div>
                <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                    <h3 className="font-semibold text-dark dark:text-white">
                        Article Product
                    </h3>
                </div>
                <div className="p-6 5">
                    <div className="flex flex-col w-full mb-7">
                        {Array.isArray(article.products) && article.products.map((op, index) => (
                            <div key={index} className="mb-10 flex flex-col gap-0 xl:flex-col border border-stroke dark:border-dark-3 p-6">
                                <div className="flex flex-row gap-5 w-full">
                                <div className="h-36 mb-3 w-44 rounded-lg bg-white flex items-center justify-center">
                                    {op.productImage && (
                                    <Image
                                        width={100}
                                        height={100}
                                        src={`https://nmw.prahwa.net/storage/${op.productImage}`}
                                        alt={op.productName}
                                        className="w-full rounded-lg"
                                    />
                                    )}
                                </div>
                                <div className="w-full">
                                    <div className="w-full flex flex-col mb-5 gap-4.5 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                        Upload Image
                                        </label>
                                        <input
                                        type="file"
                                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                        Product Name
                                        </label>
                                        <input
                                        type="text"
                                        defaultValue={op.productName}
                                        placeholder="Enter Product Name"
                                        className="w-full rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                        Product Link
                                        </label>
                                        <input
                                        type="text"
                                        defaultValue={op.productLink}
                                        placeholder="Enter product link"
                                        className="w-full rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-4.5 xl:flex-row">
                                    <div className="w-full xl:w-full">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                        Product Description
                                        </label>
                                        <textarea
                                        defaultValue={op.productDescription}
                                        placeholder="Enter product description"
                                        className="w-full rounded-[7px] h-[140px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                    </div>
                                    <button type="button" onClick={() => removeProduct(index)} className="cursor-pointer text-start text-red-500 cursor-default mt-2">Delete Product</button>
                                </div>
                                </div>
                            </div>
                            ))}

                        <button type="button" onClick={addProduct} className="cursor-pointer text-orange-400 border cursor-pointer border-orange-400 px-3 py-2 rounded-[7px] hover:bg-orange-400 hover:text-white cursor-default">
                            Add Product
                        </button>
                    </div>
                </div>
            {/* </form> */}
          </div>
        </div>

      </div>
    </DefaultLayout>
  );
};

export default EditArticle;