'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Position = {
  _id: number;
  title: string;
};

const CreateDoctor = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [positions, setPositions] = useState<{ _id: string, title: string }[]>([]);
  const [position, setPosition] = useState("");
  const [id_position, setId_position] = useState("");
  const [isAddingPosition, setIsAddingPosition] = useState(false);
  const [newPosition, setNewPosition] = useState(""); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const response = await fetch(`/api/position`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Gagal mengambil data position");
        }
        const result = await response.json();
        setPositions(result); // Menyimpan daftar posisi dari API
      } catch (error) {
        console.error("Gagal mengambil data position:", error);
      }
    };
  
    fetchPosition();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // Simpan file asli
    }
  };

  const handleSubmit = async () => {
    if (!name || !position || !image) {
      setMessage("Please fill in all required fields!");
      setIsOpen(true);
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("id_position", id_position ? id_position.toString() : "");
    formData.append("image", image as Blob);

    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(key, value);
    });
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_WEB_URL}/api/doctors`, formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 201) {
        setIsOpen(true);
        setMessage("Doctor berhasil ditambahkan!");
        setName("");
        setPosition("");
        setImage(null);
      } else {
        setMessage("Gagal menambahkan Doctor.");
      }
    } catch (error) {
      setMessage("Error creating Doctor: " + error);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPosition = (pos: { _id: string; title: string }) => {
    setPosition(pos.title); // Simpan title
    setId_position(pos._id); // Simpan ID
    setIsDropdownOpen(false);
  };

  const handleAddPosition = async () => {
    if (!newPosition.trim()) return;
  
    try {
      const formData = new FormData();
      formData.append("title", newPosition); // Menggunakan newPosition
  
      const response = await axios.post("/api/position", formData, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 201) {
        const newPos = response.data; // Ambil data dari API
        setPositions((prev) => [...prev, newPos]); 
        setNewPosition("");
        setIsAddingPosition(false); // Kembali ke select
      } else {
        setIsAddingPosition(false);
      }
    } catch (error) {
      setIsAddingPosition(false);
    } finally {
      setIsAddingPosition(false);
    }
  };

  const handleDeletePosition = async (id: string) => {
    try {
      await axios.delete(`/api/position/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });
  
      setPositions((prev) => prev.filter((pos) => pos._id !== id));
    } catch (error) {
      console.error("Gagal menghapus posisi:", error);
    }
  };

  const handlePush = () => {
    setIsOpen(false);
    router.push("/dashboard/doctors");
  }

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="dashboard/doctors" pageName="Manage Doctors" routeSecond="dashboard/doctors/create" pageNameSecond="/ Create" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
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
                      onChange={handleImageChange}
                      className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                    />
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Doctor Name
                      <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter doctor name (Ex : dr. Doctor Name)"
                      value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                    />
                  </div>
                  <div className="w-full xl:w-1/2 relative">
                    <div className="w-full flex justify-between mb-3">
                      <label className="xl:w-1/2 block text-body-sm font-medium text-dark dark:text-white">
                        Doctor Position
                        <span className="text-red">*</span>
                      </label>
                      <button
                        className="w-max text-body-sm font-medium text-dark dark:text-white"
                        type="button"
                        onClick={() => setIsAddingPosition(true)}
                      >
                        +Add Position
                      </button>
                    </div>

                    {/* Jika sedang menambah posisi, tampilkan input */}
                    {isAddingPosition ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPosition}
                          onChange={(e) => setNewPosition(e.target.value)}
                          placeholder="Enter new position"
                          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                        />
                        <button
                          className="bg-transparent border-[1.5px] border-orange-400 text-black dark:text-white px-4 py-2 rounded-md"
                          onClick={handleAddPosition}
                        >
                          Save
                        </button>
                        <button
                          className="bg-transparent border-[1.5px] border-red-400 text-black dark:text-white px-4 py-2 rounded-md"
                          onClick={() => setIsAddingPosition(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Button untuk membuka dropdown */}
                        <button
                          className="w-full flex justify-between  rounded-[7px] border-[1.5px] text-start border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          {position || "Choose Position"}
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M16.53 9.47a.75.75 0 0 1 0 1.06L12 15.06l-4.53-4.53a.75.75 0 1 1 1.06-1.06L12 12.94l3.47-3.47a.75.75 0 0 1 1.06 0"/></svg>
                        </button>

                        {/* Dropdown daftar posisi */}
                        {isDropdownOpen && (
                          <div className="absolute top-full mt-2 w-full bg-white border border-stroke rounded-lg shadow-lg dark:bg-dark-2 dark:border-dark-3 z-10">
                            {positions.length > 0 ? (
                              positions.map((pos) => (
                                <div
                                  key={pos._id}
                                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-200 dark:hover:bg-dark-3 cursor-pointer"
                                >
                                  <span className="w-full block" onClick={() => { handleSelectPosition(pos); setIsDropdownOpen(false); }}>
                                    {pos.title}
                                  </span>
                                  <button
                                    className="text-red-600"
                                    onClick={() => handleDeletePosition(pos._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">No positions available</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
                <div className="flex gap-3">
                    <button onClick={handleSubmit} disabled={loading}  className="flex w-max justify-center gap-2 rounded-[7px] bg-green p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {loading ? "Saving..." : "Save Doctor"}
                    </button>
                    <Link href={'/dashboard/doctors'}>
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
        <button type="button"
          onClick={() => message.includes('Error') || message.includes('Please fill in all required fields!') ? setIsOpen(false) : handlePush()} 
          className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
          OK
        </button>
      </div>
    </div>
</DefaultLayout>
 
);
};
export default CreateDoctor;