"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import Link from "next/link";

const EditBranch = () => {
    const { id } = useParams(); // Ambil ID dokter dari URL
    const router = useRouter();
    const [branch, setBranch] = useState<{
        name: string;
        address: string;
        image: string;
        phone: string;
        location: string;
        operasional: {
            [x: string]: any;
            day: string; time: string 
        }[];
      }>({
        name: "",
        address: "",
        image: "",
        phone: "",
        location: "",
        operasional: [],
      });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState<File | null>(null); // Perbaiki tipe state
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [operasional, setOperasional] = useState(branch.operasional);

    useEffect(() => {
        if (branch.operasional && Array.isArray(branch.operasional)) {
          // Periksa apakah formatnya masih berbentuk array string
          if (typeof branch.operasional[0] === "string") {
            const formattedOperasional = branch.operasional.map((op) => {
              const [day, time] = op.split(" : "); // Memisahkan "Senin - Jumat : 07.00-20.00"
              return { day: day?.trim() || "", time: time?.trim() || "" };
            });
      
            setBranch((prev) => ({ ...prev, operasional: formattedOperasional }));
          }
        }
      }, [branch.operasional]); // Jalankan hanya saat `branch.operasional` berubah      
      

      const addOperasionalHour = () => {
        setBranch((prev) => ({
          ...prev,
          operasional: [...prev.operasional, { day: "", time: "" }],
        }));
      };
    
      const handleOperasionalChange = (index: number, value: string, field: "day" | "time") => {
        setBranch((prev) => ({
          ...prev,
          operasional: prev.operasional.map((op, i) =>
            i === index ? { ...op, [field]: value } : op
          ),
        }));
      };  
    
      const removeOperasionalHour = (index: number) => {
        setBranch((prev) => ({
          ...prev,
          operasional: prev.operasional.length > 1
            ? prev.operasional.filter((_, i) => i !== index)
            : prev.operasional, // Mencegah penghapusan semua data
        }));
      };

  // Fetch data dokter berdasarkan ID
  useEffect(() => {
    if (!id) return;

    const fetchBranch = async () => {
      try {

        const res = await fetch(`/api/branchesDetail/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data branch");

        const responseData = await res.json();

        if (responseData.data) {
          setBranch(responseData.data);
          setPreviewImage(responseData.data.image);
        }
        
      } catch (error) {
        console.error(error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [id]);

  // Handle Update
  const handleUpdate = async (e: React.FormEvent) => { 
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", branch.name);
    formData.append("address", branch.address);
    formData.append("phone", branch.phone);
    formData.append("location", branch.location);

    if (Array.isArray(branch.operasional) && branch.operasional.length > 0) {
        branch.operasional.forEach((op, index) => {
          formData.append(`operasional_hari[${index}]`, op.day);
          formData.append(`operasional_jam[${index}]`, op.time);
        });
      }

    // Kirim file gambar jika ada perubahan
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`/api/branchesDetail/${id}`, {
        method: "POST", // Sesuai dengan backend
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memperbarui data branch");

      setMessage("Branch successfully update!");
      setIsOpen(true);
    } catch (error) {
      console.error("Update error:", error);
      setMessage("Error creating branch: " + error);
      setIsOpen(true);
    } finally {
      setUpdating(false);
    }
};

const handlePush = () => {
  setIsOpen(false);
  router.push("/branches");
}

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="branches" pageName="Manage Branches" pageNameSecond="/ Edit" />
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">Edit Branch</h3>
            </div>

            <div className="p-6.5">
                <form action="" onSubmit={handleUpdate} encType="multipart/form-data">
                <div className="w-60 h-auto mb-5 overflow-hidden">
                    {(branch.image) && (
                        <Image
                        width="700"
                        height="700"
                        src={`${branch.image}`} 
                        alt={branch.name}
                        priority
                        className="w-full rounded-xl"
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
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                        if (file) {
                            setImage(file);
                        }
                    }}
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
                    defaultValue={branch.name}
                    onChange={(e) => setBranch({ ...branch, name: e.target.value })}
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
                    defaultValue={branch.address}
                    onChange={(e) => setBranch({ ...branch, address: e.target.value })}
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
                    defaultValue={branch.phone}
                    onChange={(e) => setBranch({ ...branch, phone: e.target.value })}
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
                    defaultValue={branch.location}
                    onChange={(e) => setBranch({ ...branch, location: e.target.value })}
                    className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full mb-7">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">Operational Hours</label>
                {branch.operasional.map((op, index) => (
                    <div key={index} className="mb-4 flex flex-col gap-0 xl:flex-row">
                      <input type="text" placeholder="Ex: Senin - Jumat" defaultValue={op.day} onChange={(e) => handleOperasionalChange(index, e.target.value, "day")} className="w-full xl:w-1/2 rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white" />
                      <input type="text" placeholder="Ex: 10:00-17:00" defaultValue={op.time} onChange={(e) => handleOperasionalChange(index, e.target.value, "time")} className="w-full xl:w-1/2 rounded-[7px] border-[1.5px] border-stroke px-5.5 py-3 text-dark outline-none transition dark:border-dark-3 dark:bg-dark-2 dark:text-white" />
                      <button type="button" onClick={() => removeOperasionalHour(index)} className="ml-2 text-red-500">✖</button>
                    </div>
                  ))}
                <button type="button" onClick={addOperasionalHour} className="text-orange-400 border border-orange-400 px-3 py-1 rounded-[7px] hover:bg-orange-400 hover:text-white">Add Operational Hours</button>
              </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={updating} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                        {updating ? "Updating..." : "Update"}
                    </button>
                    <Link href={'/branches'}>
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

export default EditBranch;
