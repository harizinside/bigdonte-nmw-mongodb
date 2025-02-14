"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";


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

    operasional.forEach((op, index) => {
      formData.append(`operasional[${index}]`, `${op.day} : ${op.time}`);
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

      alert("Branch created successfully!");
      router.push("/branches");
    } catch (error) {
      alert("Error creating branch: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="branches" pageName="Manage Branches" pageNameSecond="/ Create" />
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
                <button onClick={handleSubmit} disabled={loading} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">{loading ? "Saving..." : "Save Branch"}</button>
                <button onClick={() => router.push("/branches")} className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateBranch;
