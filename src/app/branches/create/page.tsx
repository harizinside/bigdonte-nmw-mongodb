"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";

const CreateBranch = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [operasional, setOperasional] = useState<{ day: string; time: string }[]>([
    { day: "", time: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const addOperasionalHour = () => {
    setOperasional([...operasional, { day: "", time: "" }]);
  };

  const handleOperasionalChange = (index: number, value: string, type: "day" | "time") => {
    const updatedOperasional = [...operasional];
    updatedOperasional[index] = { ...updatedOperasional[index], [type]: value };
    setOperasional(updatedOperasional);
  };

  const removeOperasionalHour = (index: number) => {
    if (operasional.length > 1) {
      setOperasional(operasional.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!name || !address || !phone || !location || !image || operasional.some(op => !op.day || !op.time)) {
      alert("Please fill in all required fields!");
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("image", image);
  
    // Simpan operasional_hari dan operasional_jam secara terpisah
    operasional.forEach((op, index) => {
      formData.append(`operasional_hari[${index}]`, op.day);
      formData.append(`operasional_jam[${index}]`, op.time);
    });
  
    try {
      const response = await fetch("/api/branchesPost", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to create branch");
      }
  
      setMessage("Branch created successfully!");
      setIsOpen(true);
    } catch (error) {
      setMessage("Error creating branch: " + error);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = () => {
    setIsOpen(false);
    router.push("/branches");
  } 
  

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="branches" pageName="Manage Branches" pageNameSecond="/ Create" pageNameThird="" pageNameFour="" pageNameFive="" />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">Create Branch</h3>
            </div>

            <div className="p-6.5">
              <div className="mb-5">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Upload Image
                </label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                  />
              </div>

              <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Branch Name
                      <span className="text-red">*</span>
                    </label>
                    <input
                    type="text"
                    placeholder="Enter branch name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Branch Address
                    <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter branch address"
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Branch Phone
                      <span className="text-red">*</span>
                    </label>
                    <input
                    type="text"
                    placeholder="Enter branch phone"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Branch Link Location
                    <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter link location"
                    value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full mb-7">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Operational Hours</label>
                {operasional.map((op, index) => (
                    <div key={index} className="mb-4 flex flex-col gap-0 xl:flex-row">
                      <input type="text" placeholder="Ex: Senin - Jumat" value={op.day} onChange={(e) => handleOperasionalChange(index, e.target.value, "day")} className="w-full xl:w-1/2 rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white" />
                      <input type="text" placeholder="Ex: 10:00-17:00" value={op.time} onChange={(e) => handleOperasionalChange(index, e.target.value, "time")} className="w-full xl:w-1/2 rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white" />
                      <button onClick={() => removeOperasionalHour(index)} className="ml-2 text-red-500">✖</button>
                    </div>
                  ))}
                <button onClick={addOperasionalHour} className="text-orange-400 border border-orange-400 px-3 py-1 rounded-[7px] hover:bg-orange-400 hover:text-white">Add Operational Hours</button>
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

export default CreateBranch;
