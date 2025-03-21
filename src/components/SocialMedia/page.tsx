'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type Social = {
    length: number;
    _id: number;
    title: string;
    link: string;
};

export default function SocialMedia(){
    const [socialMediaData, setSocialMediaData] = useState<Social[]>([]);
    const [selectedSocial, setSelectedSocial] = useState<Social | null>(null);
    const [loading, setLoading] = useState(true);
    const [linkSocial, setLinkSocial] = useState("");
    const [socialMedia, setSocialMedia] = useState("");
    const [socialTitle, setSocialTitle] = useState("");
    const [isOpenSocial, setIsOpenSocial] = useState(false);
    const [isOpenSocialDelete, setIsOpenSocialDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    useEffect(() => {
        const fetchSocialMedia = async () => {
        try {
            const response = await fetch(`/api/social`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            });
    
            if (!response.ok) {
            throw new Error("Gagal mengambil data social media");
            }
            const result = await response.json();
            setSocialMediaData(result); // Menyimpan daftar posisi dari API
        } catch (error) {
            console.error("Gagal mengambil data social media:", error);
        }
        };
    
        fetchSocialMedia();
    }, [setSocialMediaData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append("link", linkSocial); 
            formData.append("icon", socialMedia); // Icon sebagai value
            formData.append("title", socialTitle); // Title dari option
        
            const response = await axios.post("/api/social", formData, {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
                "Content-Type": "multipart/form-data",
            },
            });
        
            if (response.status === 201) {
            setIsOpenSocial(false);
            setSocialMedia("");
            setSocialTitle("");
            setLinkSocial("");
            } else {
                console.log("gagal")
            }
        } catch (error) {
            setIsOpenSocial(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSocial = async (id: string | number) => {
        try {
            setLoadingDelete(true);
            const response = await fetch(`/api/social/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
            });
        
            if (!response.ok) {
            throw new Error(response.statusText);
            }
            setSocialMediaData((prevSocial) => prevSocial.filter((social) => social._id !== id));
            setSelectedSocial(null);
            setIsOpenSocialDelete(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingDelete(false);
        }
    };
    return(
        <>
            <div className="mb-7">
                <div className="flex mb-3 justify-between">
                    <label className="block text-body-sm font-medium text-dark dark:text-white">
                    Social Media
                    </label>
                    <button type="button" onClick={() => setIsOpenSocial(true)} className="text-body-sm font-medium text-dark dark:text-white">+Add Social Media</button>
                </div>
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
                        <th className="w-max px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                            No
                        </th>
                        <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                            Title
                        </th>
                        <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                            Link
                        </th>
                        <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        {socialMediaData.map((social, index) => (
                        <tr key={index}>
                            <td
                            className={`border-[#eee] px-4 text-center py-4 dark:border-dark-3 w-0 xl:pl-9 ${
                                index === social.length - 1 ? "border-b-0" : "border-b"
                            }`}
                            >
                            <div className="w-0">{index + 1}</div>
                            </td>
                            <td
                            className={`border-[#eee] px-4 py-4 dark:border-dark-3 w-150 xl:pl-5 ${index === social.length - 1 ? "border-b-0" : "border-b"}`}
                            >
                            <h5 className="text-dark dark:text-white">
                                {social.title}
                            </h5>
                            </td>
                            <td
                            className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === social.length - 1 ? "border-b-0" : "border-b"}`}
                            >
                            <p className="text-dark dark:text-white">
                                {social.link}
                            </p>
                            </td>
                            <td
                            className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === social.length - 1 ? "border-b-0" : "border-b"}`}
                            >
                            <div className="flex items-center justify-end space-x-3.5">
                                <button type="button" className="hover:text-orange-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M21.455 5.416a.75.75 0 0 1-.096.943l-9.193 9.192a.75.75 0 0 1-.34.195l-3.829 1a.75.75 0 0 1-.915-.915l1-3.828a.8.8 0 0 1 .161-.312L17.47 2.47a.75.75 0 0 1 1.06 0l2.829 2.828a1 1 0 0 1 .096.118m-1.687.412L18 4.061l-8.518 8.518l-.625 2.393l2.393-.625z" clipRule="evenodd"/><path fill="currentColor" d="M19.641 17.16a44.4 44.4 0 0 0 .261-7.04a.4.4 0 0 1 .117-.3l.984-.984a.198.198 0 0 1 .338.127a46 46 0 0 1-.21 8.372c-.236 2.022-1.86 3.607-3.873 3.832a47.8 47.8 0 0 1-10.516 0c-2.012-.225-3.637-1.81-3.873-3.832a46 46 0 0 1 0-10.67c.236-2.022 1.86-3.607 3.873-3.832a48 48 0 0 1 7.989-.213a.2.2 0 0 1 .128.34l-.993.992a.4.4 0 0 1-.297.117a46 46 0 0 0-6.66.255a2.89 2.89 0 0 0-2.55 2.516a44.4 44.4 0 0 0 0 10.32a2.89 2.89 0 0 0 2.55 2.516c3.355.375 6.827.375 10.183 0a2.89 2.89 0 0 0 2.55-2.516"/></svg>
                                </button>
                                <button type="button" className="hover:text-red" onClick={() => { setSelectedSocial(social); setIsOpenSocialDelete(true); }}> 
                                <svg
                                    className="fill-current"
                                    width="22" 
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
                                </svg>
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* POPUP CREATE */}
            <div className={`fixed top-0 left-0 z-999 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 ${isOpenSocial ? 'block' : 'hidden'}`}>
                <div className="dark:bg-dark-2 bg-white text-center rounded-2xl p-6 py-9 w-1/3 shadow-lg">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-7 flex flex-col gap-4.5 xl:flex-col">
                        <div className="w-full text-start">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Social Media
                            </label> 
                            <select
                            value={socialMedia}
                            onChange={(e) => {
                                setSocialMedia(e.target.value); // Simpan icon sebagai value
                                setSocialTitle(e.target.options[e.target.selectedIndex].text); // Simpan title dari option
                            }}
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            >
                            <option value="">Select Social Media</option>
                            <option value="<FaFacebook />">Facebook</option>
                            <option value="<FaInstagram />">Instagram</option>
                            <option value="<FaYoutube />">Youtube</option>
                            <option value="<FaTiktok />">Tiktok</option>
                            <option value="<FaWhatsapp />">Whatsapp</option>
                            <option value="<RiTwitterXFill />">Twitter</option>
                            </select>
                        </div>
                        <div className="w-full text-start">
                            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                            Social Media Link
                            </label>
                            <input
                            type="text"
                            name="social"
                            value={linkSocial}
                            onChange={(e) => setLinkSocial(e.target.value)}
                            placeholder="Enter social media link"
                            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-orange-400 active:border-orange-400 disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-orange-400"
                            />
                        </div>
                        </div>
                        <div className="flex justify-start gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpenSocial(false)}
                            className="flex w-max gap-2 justify-center rounded-[7px] bg-red-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90"
                        >
                            {loading ? "Saving..." : "Save Social Media"}
                        </button>
                        </div>
                    </form>
                </div>
            </div>


            {/* DELETE POPUP */}
            {isOpenSocialDelete && selectedSocial && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-35 z-999 flex justify-center items-center z-50">
                <div className="bg-white rounded-2xl p-6 py-9 w-1/3 shadow-lg">
                <div className="flex items-center justify-center mb-4">
                    <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </svg>
                </div>
                <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">
                    Are you sure you want to delete <strong>{selectedSocial.title}</strong>?
                </p>
                <div className="flex justify-center gap-3">
                    <button className="bg-gray-200 hover:bg-gray-300 text-lg text-gray-600 py-2 px-5 rounded-lg cursor-pointer" onClick={() => setSelectedSocial(null)}>
                    Cancel
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-lg text-white py-2 px-5 rounded-lg cursor-pointer" onClick={() => handleDeleteSocial(selectedSocial._id)}>
                    {loadingDelete ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
                </div>
            </div>
            )}
        </>
    );
}