"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import Link from "next/link";

const EditAchievement = () => {
  const { id } = useParams(); // Ambil ID dokter dari URL
  const router = useRouter();

  const [achievement, setAchievement] = useState({ heading: "", date: "", image: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch data dokter berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchAchievement = async () => {
      try {
        console.log("Fetching Achievement data for ID:", id);

        const res = await fetch(`/api/achievementsDetail/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data Achievement");

        const responseData = await res.json();
        console.log("Achievement Data (from API):", responseData);

        if (responseData.data) {
          setAchievement(responseData.data);
        }
        
      } catch (error) {
        console.error(error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id]);

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => { 
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("heading", achievement.heading);
    formData.append("description", achievement.description);
    formData.append("date", achievement.date);

    // Kirim file gambar jika ada perubahan
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`/api/achievementsDetail/${id}`, {
        method: "POST", // Sesuai dengan backend
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memperbarui data Achievement");

      setMessage("Achievement successfully update!");
      setIsOpen(true);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Error creating Achievement: " + error);
      setIsOpen(true);
    } finally {
      setUpdating(false);
    }
};

const handlePush = () => {
  setIsOpen(false);
  router.push("/achievements");
}


  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="achievements" pageName="Manage Achievements" pageNameSecond="/ Edit" />
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9"> 
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">Edit Achievement</h3>
            </div>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="p-6.5">
                <div className="w-30 h-30 mb-5 overflow-hidden object-cover object-center rounded-lg">
                  {(achievement.image) && (
                      <Image
                      width="100"
                      height="100"
                      src={`https://nmw.prahwa.net/storage/${achievement.image}`} 
                      alt="Preview"
                      className="w-full"
                      />
                  )}
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                            const file = e.target.files?.[0];
                                if (file) {
                                    setImage(file);
                                }
                            }}
                            className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                        />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Achievement Heading</label>
                        <input
                            type="text"
                            placeholder="Enter achievement heading"
                            value={achievement.heading}
                            onChange={(e) => setAchievement({ ...achievement, heading: e.target.value })}
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                        />
                    </div>
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                    <div className="w-full xl:w-1/2">
                        <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Achievement Description</label>
                        <input
                            type="text"
                            placeholder="Enter achievement description"
                            value={achievement.description}
                            onChange={(e) => setAchievement({ ...achievement, description: e.target.value })}
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
                                value={achievement.date} 
                                onChange={(e) => setAchievement({ ...achievement, date: e.target.value })}
                                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-2.5 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-orange-400"
                            />
                            <div className="flex absolute inset-y-0 right-0 items-center pe-5.5 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button type="submit" disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {updating ? "Updating..." : "Update"}
                    </button>
                    <Link href={'/achievements'}>
                        <button className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
                            Cancel
                        </button>
                    </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal */}
      <div className={`fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white text-center rounded-2xl p-6 py-9 w-1/3 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            {message.includes('Error') ? (
              <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            ) : (
              <svg className="w-28 h-28 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/><path stroke-linecap="round" d="m16 24l6 6l12-12"/></g></svg>
            )}
          </div>
          <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">{message}</p>
          <button 
            onClick={() => message.includes('Error') ? setIsOpen(false) : handlePush()} 
            className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
            OK
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditAchievement;
