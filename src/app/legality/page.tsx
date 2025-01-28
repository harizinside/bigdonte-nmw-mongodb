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
          <Breadcrumb route="legality" pageName="Manage Legality" pageNameSecond="" />
        </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-7">
                    <div className="">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Privacy Policy</label>
                        <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                        <RichEditor/>
                        </div>
                    </div>
                </div>
                <div className="mb-7">
                    <div className="">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Terms & Condition</label>
                        <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                        <RichEditor/>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-7">
                    <button className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        Save Legality
                    </button>
                </div>
              </div>

              
          </div>
        </div>

      </div>
    </DefaultLayout>
  );
};

export default CreatArticle;