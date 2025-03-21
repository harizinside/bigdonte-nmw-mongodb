"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

type Doctor = {
  _id: number;
  image: string;
  name: string;
  position: string;
  id_position: string;
};

const EditDoctor = () => {
  const { id } = useParams(); // Ambil ID dokter dari URL
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
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

  // Fetch data dokter berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchDoctorById = async () => {
      try {
        const response = await fetch(`/api/doctors/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Gagal mengambil data dokter");
        }
    
        const result: Doctor = await response.json();
        setDoctor(result);
      } catch (error) {
        console.error("Gagal mengambil data dokter:", error);
      }
    };

    fetchDoctorById();
  }, [id]);

 //   // Fungsi untuk menangani perubahan input text
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!doctor) return;

    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value, // Update field yang diubah
    });
  };

  // Fungsi untuk menangani unggah gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setUpdating(true);
  
    try {
      const formData = new FormData();
      formData.append("name", doctor.name);
      formData.append("position", position || doctor.position); 
      formData.append("id_position", id_position || doctor.id_position ? doctor.id_position.toString() : "");
      if (image) {
        formData.append("image", image); // Include the new image file
      }
  
      const response = await fetch(`/api/doctors/${doctor._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
        body: formData, // Send FormData instead of JSON 
      });
  
      if (!response.ok) throw new Error("Failed to update Doctor");
  
      setMessage("Doctor successfully updated!");
      setIsOpen(true);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Error updating Doctor: " + error);
      setIsOpen(true);
    } finally {
      setUpdating(false);
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
    router.push("/doctors");
  }


  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="doctors" pageName="Manage Doctors" pageNameSecond="/ Edit" pageNameThird="" pageNameFour="" pageNameFive="" />
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9"> 
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">Edit Doctor</h3>
            </div>
            <form onSubmit={handleUpdate} encType="multipart/form-data">
              <div className="p-6.5">
                <div className="w-60 h-auto mb-5 overflow-hidden object-cover object-center">
                  {(previewImage || doctor?.image || "") && (
                      <Image
                      width="300"
                      height="300"
                      priority
                      src={`${previewImage || doctor?.image || ""}`} 
                      alt="Preview"
                      className="w-full rounded-lg"
                      />
                  )} 
                </div>
                <div className="mb-5">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                        Upload Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-stroke file:px-2.5 file:py-1 file:text-body-xs file:font-medium file:text-dark-5 focus:border-orange-400 file:focus:border-orange-400 active:border-orange-400 disabled:cursor-default disabled:bg-dark dark:border-dark-3 dark:bg-dark-2 dark:file:border-dark-3 dark:file:bg-white/30 dark:file:text-white"
                    />
                  
                </div>
                <div className="mb-7 flex flex-col gap-4.5 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                      Doctor Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter doctor name (Ex : dr. Doctor Name)"
                      value={doctor?.name || ""}
                      onChange={handleChange}
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
                            type="button"
                            className="bg-transparent border-[1.5px] border-orange-400 text-black dark:text-white px-4 py-2 rounded-md"
                            onClick={handleAddPosition}
                          >
                            Save
                          </button>
                          <button
                            type="button"
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
                            type="button"
                            className="w-full flex justify-between rounded-[7px] border-[1.5px] text-start border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            {position || doctor?.position || "Choose Position"}
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
                                    <span
                                      className="w-full block"
                                      onClick={() => {
                                        setPosition(pos.title);
                                        setId_position(pos._id)
                                        setDoctor((prev) => (prev ? { ...prev, position: pos.title,  id_position: pos._id } : null));
                                        setIsDropdownOpen(false);
                                      }}
                                    >
                                      {pos.title}
                                    </span>
                                    <button
                                      type="button"
                                      className="text-red-600"
                                      onClick={() => handleDeletePosition(pos._id)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m15.241 3.721l.293 2.029H19.5a.75.75 0 0 1 0 1.5h-.769l-.873 10.185c-.053.62-.096 1.13-.165 1.542c-.07.429-.177.813-.386 1.169a3.25 3.25 0 0 1-1.401 1.287c-.372.177-.764.25-1.198.284c-.417.033-.928.033-1.55.033h-2.316c-.622 0-1.133 0-1.55-.033c-.434-.034-.826-.107-1.198-.284a3.25 3.25 0 0 1-1.401-1.287c-.21-.356-.315-.74-.386-1.169c-.069-.413-.112-.922-.165-1.542L5.269 7.25H4.5a.75.75 0 0 1 0-1.5h3.966l.293-2.029l.011-.061c.182-.79.86-1.41 1.71-1.41h3.04c.85 0 1.528.62 1.71 1.41zM9.981 5.75h4.037l-.256-1.776c-.048-.167-.17-.224-.243-.224h-3.038c-.073 0-.195.057-.243.224zm1.269 4.75a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0zm3 0a.75.75 0 0 0-1.5 0v5a.75.75 0 0 0 1.5 0z"/></svg>
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
                    <button type="submit" disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {updating ? "Updating..." : "Update"}
                    </button>
                    <Link href={'/doctors'}>
                        <button type="button" className="flex w-max gap-2 justify-center rounded-[7px] bg-red-600 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
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
      <div className={`fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white text-center rounded-2xl p-6 py-9 w-1/3 shadow-lg">
          <div className="flex items-center justify-center mb-4">
            {message.includes('Error') ? (
              <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            ) : (
              <svg className="w-28 h-28 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/><path strokeLinecap="round" d="m16 24l6 6l12-12"/></g></svg>
            )}
          </div>
          <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">{message}</p>
          <button type="button"
            onClick={() => message.includes('Error') ? setIsOpen(false) : handlePush()} 
            className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
            OK
          </button>
        </div>
      </div>
    </DefaultLayout>
  ); 
};

export default EditDoctor;