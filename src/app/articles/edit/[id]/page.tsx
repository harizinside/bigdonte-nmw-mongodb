"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import Link from "next/link";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import RichEditor from "@/components/rich-editor/page";
 

const EditArticle = () => {
    const { id } = useParams(); // Ambil ID dokter dari URL
    const router = useRouter();

    const [article, setArticle] = useState({ 
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
        products: "",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Fetch data dokter berdasarkan ID
    useEffect(() => {
        if (!id) return;

        const fetchArticle = async () => {
        try {
            console.log("Fetching Artikel data for ID:", id);

            const res = await fetch(`/api/articlesDetail/${id}`);
            if (!res.ok) throw new Error("Gagal mengambil data Artikel");

            const responseData = await res.json();
            console.log("Artikel Data (from API):", responseData);

            if (responseData.data) {
                setArticle(responseData.data);
                setPreviewImage(responseData.data.image);
            }
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchArticle();
    }, [id]);

    let ProductData = [];
        try {
            ProductData = JSON.parse(article.products);
            if (!Array.isArray(ProductData)) ProductData = [];
        } catch {
            ProductData = [];
        }

  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="articles" pageName="Manage Articles" pageNameSecond="/ Create"/>
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
                    <SelectGroupOne label="Doctor" defaultValue="Choose Doctor"/>
                  </div>
                  <div className="flex flex-col w-full xl:w-1/2">
                    <SelectGroupOne label="Service" defaultValue="Choose Service"/>
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
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            ProductData.map((item, index) => (
                            <div key={index} className="mb-10 flex flex-col gap-0 xl:flex-col">
                                <div className="flex flex-row gap-5 w-full">
                                    <div className="h-36 mb-3 w-44 rounded-lg bg-white flex items-center justify-center">
                                        <>
                                        {(item.image) && (
                                            <Image
                                            width="100"
                                            height="100"
                                            src={`https://nmw.prahwa.net/storage/${item.image}`} 
                                            alt={item.name} 
                                            className="w-full rounded-lg"
                                            />
                                        )}
                                        </>
                                    </div>
                                    <div className="w-full">
                                        <div className=" w-full flex flex-col mb-5 gap-4.5 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                                    Upload Image
                                                </label>
                                                <input
                                                type="file"
                                                className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                                                    Product Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.name}
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
                                                    value={item.link}
                                                    placeholder="Enter product link"
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
                                                    value={item.description}
                                                    placeholder="Enter product description"
                                                    className="w-full rounded-[7px] h-[140px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <button className="text-start text-red-500 cursor-default mt-2">Delete Product</button>
                                    </div>
                                </div>
                            </div>
                            ))
                        )}
                        <button className="cursor-pointer text-orange-400 border cursor-pointer border-orange-400 px-3 py-2 rounded-[7px] hover:bg-orange-400 hover:text-white cursor-default">
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