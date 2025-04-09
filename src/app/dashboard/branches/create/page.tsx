"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";

const CreateBranch = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    location: "",
    operasional: [{ day: "", time: "" }], // Default satu input
    image: null as File | null,
  });

  // Handle perubahan input form umum
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle unggah gambar ke Cloudinary
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData, // Menjaga data lama tetap ada
        image: file, // Mengupdate hanya bagian image
      }));
    }
  };

  // Handle perubahan untuk operasional
  const handleOperasionalChange = (index: number, value: string, field: "day" | "time") => {
    const newOperasional = [...formData.operasional];
    newOperasional[index][field] = value;
    setFormData({ ...formData, operasional: newOperasional });
  }; 

  // Menambah jam operasional baru
  const addOperasionalHour = () => {
    setFormData({
      ...formData,
      operasional: [...formData.operasional, { day: "", time: "" }],
    });
  };

  // Menghapus jam operasional
  const removeOperasionalHour = (index: number) => {
    const newOperasional = formData.operasional.filter((_, i) => i !== index);
    setFormData({ ...formData, operasional: newOperasional });
  };

  // Handle submit form
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedOperasional = formData.operasional.map(
        (op) => `${op.day} : ${op.time}`
      );
      
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("address", formData.address);
      payload.append("phone", formData.phone);
      payload.append("location", formData.location);
      payload.append("image", formData.image as File);
      
      formattedOperasional.forEach((item) => {
        payload.append("operasional", item);
      });

      const response = await fetch("/api/branches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
        body: payload, // Kirim sebagai FormData
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan cabang");
      }

      setMessage("Cabang berhasil ditambahkan!");
      setIsOpen(true);
      console.log("Cabang berhasil ditambahkan!");

      setTimeout(() => {
        router.push("/dashboard/branches");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Terjadi kesalahan saat menambahkan cabang.");
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/branches");
  } 
  

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="dashboard/branches" pageName="Manage Branches" routeSecond="dashboard/branches/create" pageNameSecond="/ Create" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive="" />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">Create Branch</h3>
            </div>

            <div className="p-6.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Upload Image
                  </label>
                  <input
                      required
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
                      name="name"
                      value={formData.name} onChange={handleChange}
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
                      name="address"
                      value={formData.address} onChange={handleChange}
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
                      name="phone"
                      value={formData.phone} onChange={handleChange}
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
                      name="location"
                      value={formData.location} onChange={handleChange}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full mb-7">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Operational Hours</label>
                  {formData.operasional.map((op, index) => (
                    <div key={index} className="mb-4 flex flex-col gap-0 xl:flex-row">
                      <input type="text" placeholder="Ex: Senin - Jumat" value={op.day} onChange={(e) => handleOperasionalChange(index, e.target.value, "day")} className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400" />
                      <input type="text" placeholder="Ex: 10:00-17:00" value={op.time} onChange={(e) => handleOperasionalChange(index, e.target.value, "time")} className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400" />
                      <button type="button" onClick={() => removeOperasionalHour(index)} className="ml-2 text-red-500">✖</button>
                    </div>
                  ))}
                  <button type="button" onClick={addOperasionalHour} className="text-orange-400 border border-orange-400 px-3 py-1 rounded-[7px] hover:bg-orange-400 hover:text-white">
                    Add Operational Hours
                  </button>
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Branch"}
                    </button>
                    <Link href={'/dashboard/branches'}>
                        <button type="button" className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
                            Cancel
                        </button>
                    </Link>
                </div>
              </form>
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