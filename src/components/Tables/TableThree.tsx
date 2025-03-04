'use client'

import Image from "next/image";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";

type Doctor = {
  _id: number;
  image: string;
  name: string;
  position: string; 
}

interface TableProps {
  limit?: number | null; 
  showPagination?: boolean;  
}

type DoctorsResponse = {
  doctors: Doctor[];
  currentPage: number;
  totalPages: number;
};

const TableThree: React.FC<TableProps> = ({ limit = null, showPagination = true }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
   
    const itemsPerPage = 15;

    const fetchDoctors = async (page = 1, limit?: number | null) => {
      try {
        const response = await fetch(`/api/doctors?page=${page}`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data dokter");
        }
    
        const result: DoctorsResponse = await response.json();
        
        // Jika ada limit, potong hasil data dokter
        const doctorsData = limit ? result.doctors.slice(0, limit) : result.doctors;
    
        
        setDoctors(doctorsData);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Gagal mengambil data dokter:", error);
      }
    };
    
    // Ambil halaman pertama saat load
    useEffect(() => {
      fetchDoctors(1, limit);
    }, [limit]);

    const handleDeleteDoctor = async (_id: string | number) => {
      if (!selectedDoctor) return;
      try {
        setLoadingDelete(true);
        const response = await fetch(`api/doctors/${selectedDoctor._id}`, {
          method: 'DELETE',
        });
    
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== _id));
        setSelectedDoctor(null);
        setIsOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDelete(false);
      }
    };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
      {/* {loading ? (
        <p className="text-center text-gray-500 dark:text-white mb-5 text-2xl font-semibold">Loading...</p>
      ) : ( */}
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="w-max px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                No
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Image
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Name
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Position
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor: any, index) => (
              <tr key={index}>
                <td
                  className={`border-[#eee] px-4 text-center py-4 dark:border-dark-3 w-0 xl:pl-9 ${
                    index === doctors.length - 1 ? "border-b-0" : "border-b"
                  }`}
                >
                  <div className="w-0">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                </td>
                <td className={`border-[#eee] px-4 py-4 dark:border-dark-3 w-10 xl:pl-7.5 ${index === doctors.length - 1 ? "border-b-0" : "border-b"}`}>
                  <div className="h-20 w-20 overflow-hidden rounded-md flex items-center justify-center">
                    <Image
                      src={`${doctor.image}`}
                      width={100}
                      height={100}
                      style={{borderRadius: '.3vw'}}
                      alt="Product"
                    />
                  </div>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 w-150 xl:pl-0 ${index === doctors.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <h5 className="text-dark dark:text-white">
                    {doctor.name}
                  </h5>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === doctors.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <p className="text-dark dark:text-white">
                    {doctor.position}
                  </p>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === doctors.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <div className="flex items-center justify-end space-x-3.5">
                    <Link href={`/doctors/edit/${doctor._id}`} className="p-0 m-0 flex items-center justify-center">
                      <button className="hover:text-orange-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M21.455 5.416a.75.75 0 0 1-.096.943l-9.193 9.192a.75.75 0 0 1-.34.195l-3.829 1a.75.75 0 0 1-.915-.915l1-3.828a.8.8 0 0 1 .161-.312L17.47 2.47a.75.75 0 0 1 1.06 0l2.829 2.828a1 1 0 0 1 .096.118m-1.687.412L18 4.061l-8.518 8.518l-.625 2.393l2.393-.625z" clipRule="evenodd"/><path fill="currentColor" d="M19.641 17.16a44.4 44.4 0 0 0 .261-7.04a.4.4 0 0 1 .117-.3l.984-.984a.198.198 0 0 1 .338.127a46 46 0 0 1-.21 8.372c-.236 2.022-1.86 3.607-3.873 3.832a47.8 47.8 0 0 1-10.516 0c-2.012-.225-3.637-1.81-3.873-3.832a46 46 0 0 1 0-10.67c.236-2.022 1.86-3.607 3.873-3.832a48 48 0 0 1 7.989-.213a.2.2 0 0 1 .128.34l-.993.992a.4.4 0 0 1-.297.117a46 46 0 0 0-6.66.255a2.89 2.89 0 0 0-2.55 2.516a44.4 44.4 0 0 0 0 10.32a2.89 2.89 0 0 0 2.55 2.516c3.355.375 6.827.375 10.183 0a2.89 2.89 0 0 0 2.55-2.516"/></svg>
                      </button>
                    </Link>
                    <button className="hover:text-red" onClick={() => { setSelectedDoctor(doctor); setIsOpen(true); }}>
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
      {/* )} */}
      {isOpen && selectedDoctor && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-35 z-999 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 py-9 w-1/3 shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
            </div>
            <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">
              Are you sure you want to delete <strong>{selectedDoctor.name}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button className="bg-gray-200 hover:bg-gray-300 text-lg text-gray-600 py-2 px-5 rounded-lg cursor-pointer" onClick={() => setSelectedDoctor(null)}>
                Cancel
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-lg text-white py-2 px-5 rounded-lg cursor-pointer" onClick={() => handleDeleteDoctor(selectedDoctor._id)}>
                {loadingDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showPagination && (
        <div className="flex justify-center mt-4 space-x-2">
            <button
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-[#F7F9FC] dark:bg-dark-2 cursor-not-allowed" : "bg-orange-400 text-white hover:bg-orange-600"}`}
              disabled={currentPage === 1} 
              onClick={() => fetchDoctors(currentPage - 1)}
            >
              Prev
            </button>

            <span className="px-4 py-2 rounded text-orange-400 font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-[#F7F9FC] dark:bg-dark-2 cursor-not-allowed" : "bg-orange-400 text-white hover:bg-orange-600"}`}
              disabled={currentPage === totalPages} 
              onClick={() => fetchDoctors(currentPage + 1)}
            >
              Next
            </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default TableThree;
