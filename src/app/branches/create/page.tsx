'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";


const CreateBranch = () => {
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="branches" pageName="Manage Branches"  pageNameSecond="/ Create"/>
        </div>

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Create Doctor
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-5">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Upload Image
                    </label>
                    <input
                    type="file"
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                    />
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="Branch Name"
                    type="text"
                    placeholder="Enter branch name"
                    customClasses="w-full xl:w-1/2"
                  />

                  <InputGroup
                    label="Branch Address"
                    type="text"
                    placeholder="Enter branch address"
                    customClasses="w-full xl:w-1/2"
                  />
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="Branch Phone"
                    type="text"
                    placeholder="Enter branch phone"
                    customClasses="w-full xl:w-1/2"
                  />

                  <InputGroup
                    label="Branch Link Location"
                    type="text"
                    placeholder="Enter link location"
                    customClasses="w-full xl:w-1/2"
                  />
                </div>
                <div className="flex flex-col w-full mb-7">
                    <label className="mb-1 block text-body-sm font-medium text-dark dark:text-white">Operational Hours</label>
                    <div className="mb-4 flex flex-col gap-0 xl:flex-row">
                        <InputGroup
                            label=""
                            type="text"
                            placeholder="Ex : Senin - Sabtu"
                            customClasses="w-full xl:w-1/2"
                        />

                        <InputGroup
                            label=""
                            type="text"
                            placeholder="Ex : 10.00-17.00"
                            customClasses="w-full xl:w-1/2"
                        />
                    </div>
                    <button className="flex w-max text-sm justify-center gap-1 rounded-[7px] bg-transparent border border-orange-400 text-orange-400 p-[7px] px-3 font-medium hover:text-white hover:bg-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M12.75 7a.75.75 0 0 0-1.5 0v4.25H7a.75.75 0 0 0 0 1.5h4.25V17a.75.75 0 0 0 1.5 0v-4.25H17a.75.75 0 0 0 0-1.5h-4.25z"/></svg>
                        Add New Operational Hours
                    </button>
                </div>
                <div className="flex gap-3">
                    <button className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        Save Branch
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
    </DefaultLayout>
  );
};

export default CreateBranch;
