'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import RichEditor from "@/components/rich-editor/page";
import Template1 from "../../../../public/images/template/template_1.png"
import Image from "next/image";


const CreateService = () => {
  return (
    <DefaultLayout>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="services" pageName="Manage Services" pageNameSecond="/ Create"/>
        </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            {/* <form action="#"> */}
              <div className="p-6.5 ">
                <div className="flex gap-4.5 xl:flex-row mb-7 ">
                    <div className="w-full xl:w-1/2 ">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Banner Image
                        </label>
                        <input
                        type="file"
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Cover Image
                        </label>
                        <input
                        type="file"
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="Service Name"
                    type="text"
                    placeholder="Enter service name "
                    customClasses="w-full xl:w-1/2"
                  />
                  <InputGroup
                    label="Service Phone"
                    type="text"
                    placeholder="Ex: 6281280360370 "
                    customClasses="w-full xl:w-1/2"
                  />
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Service Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor/>
                    </div>
                  </div>
                </div>
                
                <div>
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Choose Service Page Template
                    </label>
                    <ul className="grid w-full gap-6 md:grid-cols-2">
                        <li>
                            <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" required />
                            <label htmlFor="hosting-small" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-orange-500 peer-checked:border-orange-600 dark:peer-checked:border-orange-600 peer-checked:text-orange-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
                                <div className="block w-full xl:w-full">
                                    <Image
                                        width={500}
                                        height={52}
                                        src={"/images/template/template_1.png"}
                                        alt="Logo"
                                        style={{ width: "auto", height: "auto", borderRadius: "1vw" }}
                                    />
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd"/></svg>                            
                            </label>
                        </li>
                        <li>
                            <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer"/>
                            <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-orange-500 peer-checked:border-orange-600 dark:peer-checked:border-orange-600 peer-checked:text-orange-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="block w-full xl:w-full">
                                    <Image
                                        width={500}
                                        height={52}
                                        src={"/images/template/template_2.png"}
                                        alt="Logo"
                                        style={{ width: "auto", height: "auto", borderRadius: "1vw" }}
                                    />
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10"  viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd"/></svg>
                            </label>
                        </li>
                    </ul>
                </div>
                <div className="flex gap-3 mt-7">
                    <button className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        Save Services
                    </button>
                    <Link href={'/services'}>
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
    </DefaultLayout>
  );
};

export default CreateService;