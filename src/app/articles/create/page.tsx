'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import RichEditor from "@/components/rich-editor/page";


const CreatArticle = () => {
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
                  <InputGroup
                    label="Image Source Name"
                    type="text"
                    placeholder="Image By : "
                    customClasses="w-full xl:w-1/2"
                  />

                  <InputGroup
                    label="Image Source Link"
                    type="text"
                    placeholder="Enter image link"
                    customClasses="w-full xl:w-1/2"
                  />
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
                  <InputGroup
                    label="Title"
                    type="text"
                    placeholder="Enter article title"
                    customClasses="w-full xl:w-1/2"
                  />
                  <div className="flex flex-col w-full xl:w-1/2">
                    <DatePickerOne label="Select Date" />
                  </div>
                </div>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-col">
                  <div className="">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Article Description</label>
                    <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                      <RichEditor value="testing" onChange={function (html: string): void {
                      throw new Error("Function not implemented.");
                    } }/>
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
                  <InputGroup
                    label="Author Name"
                    type="text"
                    placeholder="Enter author name"
                    customClasses="w-full xl:w-1/2"
                  />

                  <InputGroup
                    label="Editor Name"
                    type="text"
                    placeholder="Enter editor name"
                    customClasses="w-full xl:w-1/2"
                  />
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">

                  <InputGroup
                    label="Tags"
                    type="text"
                    placeholder="separate with commas (clinic, nmw, skincare)"
                    customClasses="w-full xl:w-full"
                  />
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">

                  <InputGroup
                    label="Article Source Link"
                    type="text"
                    placeholder="Enter article source"
                    customClasses="w-full xl:w-full"
                  />
                </div>
              </div>
            {/* </form> */}
          </div>
        </div>

      </div>
    </DefaultLayout>
  );
};

export default CreatArticle;