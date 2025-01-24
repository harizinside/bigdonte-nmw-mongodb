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
                <div className="mb-4.5">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Upload Image
                    </label>
                    <input
                    type="file"
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
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
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
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
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <RichEditor/>
                  <div className="flex flex-col w-full xl:w-1/2">
                    <DatePickerOne label="Select Date" />
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
              </div>
            {/* </form> */}
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Article Content
              </h3>
            </div>
            {/* <form action="#"> */}
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
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
            {/* </form> */}
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Sign In Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Sign In Form
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <InputGroup
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  customClasses="mb-4.5"
                />

                <InputGroup
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                />

                <div className="mb-5.5 mt-5 flex items-center justify-between">
                  <label htmlFor="formCheckbox" className="flex cursor-pointer">
                    <div className="relative pt-0.5">
                      <input
                        type="checkbox"
                        id="formCheckbox"
                        className="taskCheckbox sr-only"
                      />
                      <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-dark-3">
                        <span className="text-white opacity-0">
                          <svg
                            className="fill-current"
                            width="10"
                            height="7"
                            viewBox="0 0 10 7"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                              fill=""
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <p>Remember me</p>
                  </label>

                  <Link
                    href="#"
                    className="text-body-sm text-primary hover:underline"
                  >
                    Forget password?
                  </Link>
                </div>

                <button className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                  Sign In
                </button>
              </div>
            </form>
          </div>

          {/* <!-- Sign Up Form --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Sign Up Form
              </h3>
            </div>
            <form action="#">
              <div className="p-6.5">
                <InputGroup
                  label="Name"
                  type="text"
                  placeholder="Enter full name"
                  customClasses="mb-4.5"
                />

                <InputGroup
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  customClasses="mb-4.5"
                />

                <InputGroup
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  customClasses="mb-4.5"
                />

                <InputGroup
                  label="Re-type Password"
                  type="password"
                  placeholder="Re-enter"
                  customClasses="mb-5.5"
                />

                <button className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreatArticle;