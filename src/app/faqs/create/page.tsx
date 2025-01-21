'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";


const CreateFaqs = () => {
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Breadcrumb route="faqs" pageName="Manage FaQs"  pageNameSecond="/ Create"/>
        </div>

    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Create FaQ
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
                  <InputGroup
                    label="Question"
                    type="text"
                    placeholder="Enter question"
                    customClasses="w-full xl:w-full"
                  />

                  <InputGroup
                    label="Answer"
                    type="text"
                    placeholder="Enter answer"
                    customClasses="w-full xl:w-full"
                  />
                </div>
                <div className="flex gap-3">
                    <button className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        Save FaQ
                    </button>
                    <Link href={'/faqs'}>
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

export default CreateFaqs;
