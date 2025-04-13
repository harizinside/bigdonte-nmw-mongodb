'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import RichEditor from "@/components/rich-editor/page";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CreatArticle = () => {
  const [doctors, setDoctors] = useState<any[]>([]); 
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [imageSourceName, setImageSourceName] = useState("");
  const [imageSourceLink, setImageSourceLink] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [editorName, setEditorName] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [SourceLink, setSourceLink] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [message, setMessage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setImage(e.target.files[0]);
  //   }
  // }; 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const generatedSlug = useMemo(() => {
        if (!title) return "";
        return title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      }, [title]);
      
      useEffect(() => {
        setSlug(generatedSlug);
      }, [generatedSlug]);

      const handleSubmit = async () => {
        if (!title || !date || !slug || !description || !authorName || !image || !editorName) {
          alert("Please fill in all required fields!");
          return;
        }

        const formattedTags = tags.split(",").map(tag => tag.trim());
    
        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("date", date);
        formData.append("slug", slug || "default-slug");
        formData.append("status", "1");
        formData.append("description", description);
        formData.append("author", authorName);
        formData.append("excerpt", excerpt);
        formData.append("editor", editorName);
        formData.append("imageSourceName", imageSourceName);
        formData.append("imageSourceLink", imageSourceLink);
        formData.append("sourceLink", SourceLink);
        formData.append("image", image);
        formData.append("doctorId", selectedDoctor);
        formattedTags.forEach(tag => formData.append("tags", tag));
        formData.append("serviceId", selectedService);
        selectedProducts.forEach((product) => formData.append("products", product));
    
        try {
          const response = await fetch(`/api/articles`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            body: formData,
          });
    
          const result = await response.json();
          if (!response.ok) {
            throw new Error(result.message || "Failed to create article");
          }
    
          setMessage("Article created successfully!");
          setIsOpen(true);
        } catch (error) {
          setMessage("Error creating article: " + error);
          setIsOpen(true);
        } finally {
          setLoading(false);
        }
    };
    

  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/articles");
  } 

  const changeTextColor = () => {
    setIsOptionSelected(true);
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

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="dashboard/articles" pageName="Manage Articles" routeSecond="dashboard/articles/create" pageNameSecond="/ Create" routeThird="" pageNameFour="" routeFour="" pageNameThird="" routeFive="" pageNameFive=""/>
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
                <div className="mb-7">
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
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Image Source Name
                        <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Image By : "
                        value={imageSourceName} onChange={(e) => setImageSourceName(e.target.value)}
                        className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                      />
                  </div>
                  <div className="w-full xl:w-1/2">
                      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Image Source Link
                        <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter image link"
                        value={imageSourceLink} onChange={(e) => setImageSourceLink(e.target.value)}
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
                        <span className="text-red">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter article title"
                        value={title} onChange={(e) => setTitle(e.target.value)}
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
                              value={date} 
                              onChange={(e) => setDate(e.target.value)} 
                              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                            />
                            <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                              <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="p-6.5 pb-1 pt-1">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Article Excerpt Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor onChange={setExcerpt}/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6.5 pb-1 pt-1">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Article Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor onChange={setDescription}/>
                    </div>
                  </div>
                </div>
              </div>

            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Article Additional
              </h3>
            </div>
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
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter author name"
                      value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                </div>
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Editor Name
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter editor name"
                      value={editorName} onChange={(e) => setEditorName(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                </div>
              </div>
              <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Tags
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="separate with commas (clinic, nmw, skincare)"
                      value={tags} onChange={(e) => setTags(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                </div>
                <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Article Source Link
                      <span className="text-red">*</span> 
                    </label>
                    <input
                      type="text"
                      placeholder="Enter article source"
                      value={SourceLink} onChange={(e) => setSourceLink(e.target.value)}
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
            <div className="p-6 pb-1">
                <div className="flex flex-row flex-wrap w-full mb-7 gap-4">
                  {products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => toggleProduct(product._id)}
                      className={`flex w-max border border-orange-400 justify-center gap-2 rounded-[7px] px-5 py-[9px] font-medium text-dark dark:text-white hover:bg-opacity-90 ${
                        selectedProducts.includes(product._id) ? "bg-orange-400" : "bg-transparent"
                      }`}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Article"}
                    </button>
                    <Link href={'/dashboard/articles'}>
                        <button className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
            <input type="text" value={slug} style={{visibility: 'hidden'}} onChange={(e) => setSlug(e.target.value)} readOnly />
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
          <button 
            onClick={() => message.includes('Error') || message.includes('Please fill in all required fields!') ? setIsOpen(false) : handlePush()} 
            className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
            OK
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreatArticle;