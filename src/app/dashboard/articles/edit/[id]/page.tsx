"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import RichEditor from "@/components/rich-editor/page";
import Link from "next/link";
  
  type Article = {
    _id:number;
    title: string;
    image: string;
    imageSourceName: string;
    imageSourceLink: string;
    author: string;
    editor: string;
    sourceLink: string;
    description: string;
    status: boolean;
    slug: string;
    tags: string[];
    date: string;
    serviceId: string;
    doctorId: string;
    products: string[];
  };
  

const EditArticle = () => {
    const { id } = useParams(); // Ambil ID dokter dari URL
    const router = useRouter();
    
    const [doctors, setDoctors] = useState<any[]>([]); 
    const [products, setProducts] = useState<any[]>([]); 
    const [services, setServices] = useState<any[]>([]);
    const [article, setArticle] = useState<Article | null>(null);
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
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isSlugEdited, setIsSlugEdited] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_WEB_URL;

      useEffect(() => {
        if (!id) return;
    
        const fetchArticle = async () => {
          try {
            const response = await fetch(`/api/articles/${id}`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
              },
            });

            if (!response.ok) throw new Error("Gagal mengambil data article");
    
            const result: Article = await response.json();
            setArticle(result);
          } catch (error) {
            console.error(error);
            
          } finally {
            setLoading(false);
          }
        };
    
        fetchArticle();
      }, [id]);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!article) return;
      
        const { name, value } = e.target;
      
        setArticle({
          ...article,
          [name]: name === "tags" ? value.split(",").map(tag => tag.trim()) : value, // Ubah tags menjadi array
        });
      };   
    
      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          setImage(file);
          setPreviewImage(URL.createObjectURL(file));
        }
      };

      useEffect(() => {
        if (!isSlugEdited && article?.title) {
          const generatedSlug = article.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "") // Hapus karakter selain huruf, angka, spasi, dan "-"
            .replace(/\s+/g, "-") // Ganti spasi dengan "-"
            .replace(/-+/g, "-"); // Hapus duplikasi "-"
      
          setArticle((prev) => prev ? { ...prev, slug: generatedSlug } : null);
        }
      }, [article?.title, isSlugEdited]);      

      const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!article) return;
        setUpdating(true);

      
        try {
          const formData = new FormData();
          formData.append("title", article.title);
          formData.append("description", article.description);
          formData.append("date", article.date);
          formData.append("slug", article.slug || ""); // Pastikan selalu string
          formData.append("imageSourceName", article.imageSourceName);
          formData.append("status", article.status ? "1" : "0");
          formData.append("imageSourceLink", article.imageSourceLink);
          formData.append("description", article.description);
          formData.append("author", article.author);
          formData.append("editor", article.editor);
          formData.append("sourceLink", article.sourceLink); 
          if (selectedDoctor) {
            formData.append("doctorId", selectedDoctor);
          }
          if (selectedService) {
            formData.append("serviceId", selectedService);
          }

          article.tags.forEach(tag => formData.append("tags", tag));

          selectedProducts.forEach(productId => formData.append("products", productId));

          if (image) {
            formData.append("image", image); // Include the new image file
          }
      
          const response = await fetch(`${baseUrl}/api/articles/${article._id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            body: formData, // Send FormData instead of JSON 
          });
      
          if (!response.ok) throw new Error("Failed to update Article");
      
          setMessage("Article successfully updated!");
          setIsOpen(true);
        } catch (error) {
          console.error("Update error:", error);
          setMessage("Error updating Article: " + error);
          setIsOpen(true);
        } finally {
          setUpdating(false);
        }
      };

      useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const response = await fetch(`/api/doctors?page=all`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            // Asumsikan data dokter ada di result
            setDoctors(result.doctors);
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
            const response = await fetch(`/api/services?page=all`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            // Asumsikan data layanan ada di result.data
            setServices(result.services);
          } catch (error) {
            console.error("Error fetching services:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchServices();
      }, []);

      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch(`/api/products?page=all`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            // Asumsikan data layanan ada di result.data
            setProducts(result.products);
          } catch (error) {
            console.error("Error fetching services:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchProducts();
      }, []);

      useEffect(() => {
        if (article?.doctorId && doctors.length > 0) {
          setSelectedDoctor(String(article.doctorId));
        }
      }, [article?.doctorId, doctors]);

      useEffect(() => {
        if (article?.serviceId && services.length > 0) {
          setSelectedService(String(article.serviceId));
        }
      }, [article?.serviceId, services]);

      useEffect(() => {
        if (article?.products && Array.isArray(article.products)) {
          setSelectedProducts(article.products);
        }
      }, [article?.products]);
       // Hanya dijalankan ketika `article.products` berubah
      
      const toggleProduct = (productId: string) => {
        setSelectedProducts(prev =>
          prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
      };      

      const changeTextColor = () => {
        setIsOptionSelected(true);
      };

      const handlePush = () => {
        setIsOpen(false);
        router.push("/dashboard/articles");
      }

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="dashboard/articles" pageName="Manage Articles" routeSecond="" pageNameSecond="/ Edit" routeThird="" pageNameThird={`/ ${article?.title}`} routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
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
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="p-6.5">
                <div className="h-auto mb-6 w-44 rounded-lg bg-white flex items-center justify-center">
                    <>
                    {(previewImage || article?.image || "") && (
                        <Image
                        width="800"
                        height="800"
                        priority
                        src={`${previewImage || article?.image || ""}`} 
                        alt="Preview"
                        className="w-full rounded-lg"
                        />
                    )}
                    </>
                </div>
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <div className="mb-7 w-full xl:w-1/2">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                          Upload Image
                      </label>
                      <input
                      type="file"
                      onChange={handleImageChange}
                      className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                      />
                  </div>
                  <div className="w-full xl:w-1/2 mb-7">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Status
                      </label>
                      <select
                        value={article?.status ? "true" : "false"}
                        onChange={(e) =>
                          setArticle((prev) => ({
                            ...(prev ?? {
                              _id: 0,
                              title: "",
                              image: "",
                              imageSourceName: "",
                              imageSourceLink: "",
                              author: "",
                              editor: "",
                              sourceLink: "",
                              description: "",
                              status: false,
                              slug: "",
                              tags: [],
                              date: "",
                              serviceId: "",
                              doctorId: "",
                              products: [],
                            }),
                            status: e.target.value === "true",
                          }))
                        }
                        className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400"
                      >
                        <option value="true">Active</option>
                        <option value="false">Disable</option>
                      </select>
                  </div>
                </div>
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Image Source Name
                        </label>
                        <input
                        type="text"
                        defaultValue={article?.imageSourceName}
                        name="imageSourceName"
                        onChange={handleChange}
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
                        name="imageSourceLink"
                        onChange={handleChange}
                        defaultValue={article?.imageSourceLink}
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
                        name="title"
                        onChange={handleChange}
                        defaultValue={article?.title}
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
                                name="date"
                                onChange={handleChange}
                                defaultValue={article?.date ? new Date(article.date).toISOString().split("T")[0] : ""}
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
                            value={article?.description || ""}
                            onChange={(html) =>
                              setArticle((prev) => ({
                                ...prev!,
                                description: html,
                              }))
                            }                            
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
            {/* <form onSubmit={handleUpdate} encType="multipart/form-data"> */}
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
                              <option key={doctor._id} value={doctor._id} className="text-dark-6">
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
                            Choose Service
                        </option>
                        {services.map((service) => (
                          <option key={service._id} value={service._id} className="text-dark-6">
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
                            defaultValue={article?.author}
                            name="author"
                            onChange={handleChange}
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
                            name="editor"
                            onChange={handleChange}
                            defaultValue={article?.editor}
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
                          name="tags"
                          onChange={handleChange}
                          value={article?.tags?.join(", ") || ""} // Ubah array menjadi string dengan koma
                          placeholder="Separate with commas (clinic, nmw, skincare)"
                          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Article Source Link
                        </label>
                        <input
                            type="text"
                            name="sourceLink"
                            onChange={handleChange}
                            defaultValue={article?.sourceLink}
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
                  <div className="flex flex-row flex-wrap w-full mb-7 gap-4">
                    {products.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => toggleProduct(product._id)}
                        className={`flex w-max border border-orange-400 justify-center gap-2 rounded-[7px] px-5 py-[9px] font-medium text-dark dark:text-white hover:bg-opacity-90 ${
                          selectedProducts.includes(product._id) ? "bg-orange-400 text-white" : "bg-transparent"
                        }`}
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="text"
                    value={article?.slug || ""}
                    onChange={(e) => {
                      setArticle((prev) => prev ? { ...prev, slug: e.target.value } : null);
                      setIsSlugEdited(true);
                    }}
                    className="hidden"
                  />
                  <div className="flex gap-3">
                      <button type="submit" onClick={handleUpdate} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                          {loading ? "Updating..." : "Update Article"}
                      </button>
                      <Link href={'/dashboard/articles'}>
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

export default EditArticle;