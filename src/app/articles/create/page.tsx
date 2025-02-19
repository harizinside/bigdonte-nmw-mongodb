'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import RichEditor from "@/components/rich-editor/page";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Doctor = {
  id: number;
  image: string;
  name: string;
  position: string; 
}

type Service = {
  id: number;
  name: string;
}

const CreatArticle = () => {
  const [doctors, setDoctors] = useState<any[]>([]); 
  const [services, setServices] = useState<any[]>([]);
  const [imageSourceName, setImageSourceName] = useState("");
  const [imageSourceLink, setImageSourceLink] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [editorName, setEditorName] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [SourceLink, setSourceLink] = useState("");
  const [products, setProducts] = useState<{ productName: string; productLink: string; productDescription: string; productImage: string }[]>([
    { productName: "", productLink: "", productDescription: "", productImage: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageProduct = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      handleProductChange(index, e.target.files[0], "productImage");
    }
};

  const addProduct = () => {
    setProducts([...products, { productName: "", productLink: "", productDescription: "", productImage: "" }]);
  };

  const handleProductChange = (index: number, value: string | File, type: "productName" | "productLink" | "productDescription" | "productImage") => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [type]: value };
    setProducts(updatedProducts);
};

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!title || !date || !description || !authorName || !image || !editorName || products.some(op => !op.productName || !op.productLink || !op.productDescription || !op.productImage)) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    formData.append("author", authorName);
    formData.append("editor", editorName);
    formData.append("image_source_name", imageSourceName);
    formData.append("image_source", imageSourceLink);
    formData.append("source_link", SourceLink);
    formData.append("image", image);
    formData.append("doctor_id", selectedDoctor);
    formData.append("tags", tags);
    formData.append("service_id", selectedService);
    formData.append("category_id", "1");

    // Menyimpan produk ke dalam formData
    products.forEach((product, index) => {
      formData.append(`product_name_${index}`, product.productName);
      formData.append(`product_link_${index}`, product.productLink);
      formData.append(`product_description_${index}`, product.productDescription);
      formData.append(`product_image_${index}`, product.productImage);
    });

    console.log("Form Data Entries:");
    Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
    });


    try {
      const response = await fetch("/api/articlesPost", {
        method: "POST",
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
    router.push("/articles");
  } 

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

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

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="articles" pageName="Manage Articles" pageNameSecond="/ Create" pageNameFour="" pageNameThird="" pageNameFive=""/>
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
                    <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                    />
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
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Article Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor onChange={setDescription}/>
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
                          Choose Service
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
            <div className="p-6 5">
                <div className="flex flex-col w-full mb-7">
                    <div className="mb-10 flex flex-col gap-8 xl:flex-col">
                    {products.map((op, index) => (
                        <div className="flex flex-row gap-5 w-full border border-stroke dark:border-dark-3 p-6" key={index}>
                            <div className="w-full">
                                <div className=" w-full flex flex-col mb-5 gap-4.5 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                            Upload Image
                                        </label>
                                        <input
                                        type="file"
                                        onChange={(e) => handleImageProduct(e, index)}
                                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Product Name"
                                            value={op.productName} 
                                            onChange={(e) => handleProductChange(index, e.target.value, "productName")}
                                            className="w-full rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                            Product Link
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter product link"
                                            value={op.productLink} 
                                            onChange={(e) => handleProductChange(index, e.target.value, "productLink")}
                                            className="w-full rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className=" w-full flex flex-col gap-4.5 xl:flex-row">
                                    <div className="w-full xl:w-full">
                                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                            Product Description
                                        </label>
                                        <textarea
                                            value={op.productDescription} 
                                            onChange={(e) => handleProductChange(index, e.target.value, "productDescription")}
                                            placeholder="Enter product description"
                                            className="w-full rounded-[7px] h-[140px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <button onClick={() => removeProduct(index)}  className="cursor-pointer text-start text-red-500 cursor-default mt-2">Delete Product</button>
                            </div>
                        </div>
                    ))}
                    </div>
                    <button onClick={addProduct} className="cursor-pointer text-orange-400 border cursor-pointer border-orange-400 px-3 py-2 rounded-[7px] hover:bg-orange-400 hover:text-white cursor-default">
                        Add Product
                    </button>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSubmit} disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Branch"}
                    </button>
                    <Link href={'/branches'}>
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