'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback  } from "react";

type Article = {
  _id:number;
  title: string;
  image: string;
  imageSourceName: string;
  imageSourceLink: string;
  author: string;
  editor: string;
  sourceLink: string;
  description: string;
  status: boolean;
  slug: string;
  tags: string[];
  date: string;
  serviceId: string;
  doctorId: string;
  products: string[];
};

interface TableProps {
  limit?: number | null;
  showPagination?: boolean; 
}

const TableEleven: React.FC<TableProps> = ({ limit = null, showPagination = true }) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedArticles, setSelectedArticles] = useState<Article | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
  
    const itemsPerPage = 15; 
  
    const fetchArticles = useCallback(async (currentPage: number) => {
      try {
        const response = await fetch(`/api/articles?page=${currentPage}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const result = await response.json(); 
        const data = limit ? result.articles.slice(0, limit) : result.articles;
        
        setArticles(data);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }, [limit]); // ✅ Dependensi hanya 'limit'
    
    useEffect(() => {
      fetchArticles(currentPage);
    }, [currentPage, fetchArticles]);


    const handleToggleArticle = async (articleId: number, currentStatus: boolean) => {
      const newStatus = !currentStatus; // Toggle status sebelum kirim ke server
    
      try {
        const formData = new FormData();
        formData.append("status", newStatus ? "1" : "0");
    
        const response = await fetch(`/api/articles/${articleId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          },
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error(`Failed to update article. Status: ${response.status}`);
        }
    
        // Update status artikel dalam array articles
        setArticles((prev) =>
          prev.map((article) =>
            article._id === articleId ? { ...article, status: newStatus } : article
          )
        );
      } catch (error) {
        console.error("Error updating article:", error);
    
        // Rollback perubahan UI jika gagal
        setArticles((prev) =>
          prev.map((p) => (p._id === articleId ? { ...p, status: currentStatus } : p))
        );
      }
    };


      const handleDeleteArticles = async (id: string | number) => {
        try {
          if (!selectedArticles) return;
          setLoadingDelete(true);
          const response = await fetch(`/api/articles/${selectedArticles._id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            },
          });
      
          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const updatedArticles = articles.filter((article) => article._id !== id);
          const newTotalPages = Math.ceil(updatedArticles.length / itemsPerPage);

          // Jika di halaman terakhir dan semua item dihapus, pindah ke halaman sebelumnya
          const newPage = currentPage > newTotalPages ? newTotalPages || 1 : currentPage;
          setCurrentPage(newPage);

          // **Panggil ulang fetchServices() untuk update otomatis**
          fetchArticles(newPage);
          setSelectedArticles(null);
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
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
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
                Title
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Article Link
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Status
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {articles.map((article, index) => {
              const articleUrl = `${process.env.NEXT_PUBLIC_API_WEB_URL}/${article.slug}`;

              const copyToClipboard = () => {
                navigator.clipboard.writeText(articleUrl).then(() => {
                  alert("URL copied to clipboard!");
                });
              };

              return (
              <tr key={article._id}>
                <td
                  className={`border-[#eee] px-4 text-center py-4 dark:border-dark-3 w-0 xl:pl-9 ${
                    index === articles.length - 1 ? "border-b-0" : "border-b"
                  }`}
                >
                  <div className="w-0">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                </td>
                <td className={`border-[#eee] px-2 py-4 dark:border-dark-3 w-2 xl:pl-7.5 ${index === articles.length - 1 ? "border-b-0" : "border-b"}`}>
                  <div className="h-auto w-32 overflow-hidden ">
                    <Image
                      src={article.image}
                      width={800}
                      height={800}
                      priority
                      alt={article.title}
                      className="rounded-md"
                    />
                  </div>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 w-80 xl:pl-0 ${index === articles.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <h5 className="text-dark dark:text-white">
                    {article.title}
                  </h5>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 w-130 xl:pl-0 ${index === articles.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <h5 className="text-dark dark:text-white  gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-1 border text-sm rounded bg-gray-200 dark:bg-gray-700"
                    >
                      {articleUrl}
                    </button>
                  </h5>

                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-6 ${index === articles.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <button
                    onClick={() => handleToggleArticle(article._id, article.status)}
                    className={`flex w-max gap-2 justify-center rounded-[7px] p-[9px] px-5 font-medium text-white hover:bg-opacity-90 ${
                      article.status ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  >
                    {article.status ? 'Hide' : 'Show'}
                  </button>
                </td>
                <td
                  className={`border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === articles.length - 1 ? "border-b-0" : "border-b"}`}
                >
                  <div className="flex items-center justify-end space-x-3.5">
                    <Link href={`/articles/edit/${article._id}`} className="p-0 m-0 flex items-center justify-center">
                        <button className="hover:text-orange-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M21.455 5.416a.75.75 0 0 1-.096.943l-9.193 9.192a.75.75 0 0 1-.34.195l-3.829 1a.75.75 0 0 1-.915-.915l1-3.828a.8.8 0 0 1 .161-.312L17.47 2.47a.75.75 0 0 1 1.06 0l2.829 2.828a1 1 0 0 1 .096.118m-1.687.412L18 4.061l-8.518 8.518l-.625 2.393l2.393-.625z" clipRule="evenodd"/><path fill="currentColor" d="M19.641 17.16a44.4 44.4 0 0 0 .261-7.04a.4.4 0 0 1 .117-.3l.984-.984a.198.198 0 0 1 .338.127a46 46 0 0 1-.21 8.372c-.236 2.022-1.86 3.607-3.873 3.832a47.8 47.8 0 0 1-10.516 0c-2.012-.225-3.637-1.81-3.873-3.832a46 46 0 0 1 0-10.67c.236-2.022 1.86-3.607 3.873-3.832a48 48 0 0 1 7.989-.213a.2.2 0 0 1 .128.34l-.993.992a.4.4 0 0 1-.297.117a46 46 0 0 0-6.66.255a2.89 2.89 0 0 0-2.55 2.516a44.4 44.4 0 0 0 0 10.32a2.89 2.89 0 0 0 2.55 2.516c3.355.375 6.827.375 10.183 0a2.89 2.89 0 0 0 2.55-2.516"/></svg>
                        </button>
                    </Link>
                    {/* <button className="hover:text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" d="M12 21a9 9 0 1 1 0-18a9 9 0 0 1 0 18zM9 9l6 6m0-6l-6 6"/></svg>
                    </button> */}
                    <button className="hover:text-red-600" onClick={() => { setSelectedArticles(article); setIsOpen(true); }}>
                      <svg
                        className="fill-current"
                        width="20" 
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1877 3.54117 12.2636 3.7691L12.3468 4.01846L12.379 4.11292C12.4117 4.20338 12.4498 4.29085 12.4927 4.37503H7.50614Z"
                          fill=""
                        />
                        <path
                          d="M4.92859 7.04179C4.90563 6.69738 4.60781 6.43679 4.2634 6.45975C3.91899 6.48271 3.6584 6.78053 3.68136 7.12494L4.06757 12.9181C4.13881 13.987 4.19636 14.8505 4.33134 15.528C4.47167 16.2324 4.71036 16.8208 5.20335 17.2821C5.69635 17.7433 6.2993 17.9423 7.01151 18.0355C7.69653 18.1251 8.56189 18.125 9.63318 18.125H10.3656C11.4369 18.125 12.3023 18.1251 12.9873 18.0355C13.6995 17.9423 14.3025 17.7433 14.7955 17.2821C15.2885 16.8208 15.5272 16.2324 15.6675 15.528C15.8025 14.8505 15.86 13.987 15.9313 12.9181L16.3175 7.12494C16.3404 6.78053 16.0798 6.48271 15.7354 6.45975C15.391 6.43679 15.0932 6.69738 15.0702 7.04179L14.687 12.7911C14.6121 13.9143 14.5587 14.6958 14.4416 15.2838C14.328 15.8542 14.1693 16.1561 13.9415 16.3692C13.7137 16.5824 13.4019 16.7206 12.8252 16.796C12.2307 16.8738 11.4474 16.875 10.3217 16.875H9.67718C8.55148 16.875 7.76814 16.8738 7.17364 16.796C6.59697 16.7206 6.28518 16.5824 6.05733 16.3692C5.82949 16.1561 5.67088 15.8542 5.55725 15.2838C5.44011 14.6958 5.38675 13.9143 5.31187 12.7911L4.92859 7.04179Z"
                          fill=""
                        />
                        <path
                          d="M7.8539 8.5448C8.19737 8.51045 8.50364 8.76104 8.53799 9.10451L8.95466 13.2712C8.989 13.6146 8.73841 13.9209 8.39495 13.9553C8.05148 13.9896 7.74521 13.739 7.71086 13.3956L7.29419 9.22889C7.25985 8.88542 7.51044 8.57915 7.8539 8.5448Z"
                          fill=""
                        />
                        <path
                          d="M12.1449 8.5448C12.4884 8.57915 12.739 8.88542 12.7047 9.22889L12.288 13.3956C12.2536 13.739 11.9474 13.9896 11.6039 13.9553C11.2604 13.9209 11.0098 13.6146 11.0442 13.2712L11.4609 9.10451C11.4952 8.76104 11.8015 8.51045 12.1449 8.5448Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
               );
              })}
          </tbody>
        </table>
      )}
      {isOpen && selectedArticles && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-35 z-999 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 py-9 w-1/3 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-28 h-28 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
              <p className="text-gray-600 my-5 mb-9 text-center text-2xl font-medium">
                Are you sure you want to delete <strong>{selectedArticles.title}</strong>?
              </p>
              <div className="flex justify-center gap-3">
                <button className="bg-gray-200 hover:bg-gray-300 text-lg text-gray-600 py-2 px-5 rounded-lg cursor-pointer" onClick={() => setSelectedArticles(null)}>
                  Cancel
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-lg text-white py-2 px-5 rounded-lg cursor-pointer" onClick={() => handleDeleteArticles(selectedArticles._id)}>
                  {loadingDelete ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
        {totalPages > 1 && articles.length > 0 && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-[#F7F9FC] dark:bg-dark-2 cursor-not-allowed" : "bg-orange-400 text-white hover:bg-orange-600"}`}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            <span className="px-4 py-2 rounded text-orange-400 font-medium">
              {currentPage} / {totalPages}
            </span>

            <button
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-[#F7F9FC] dark:bg-dark-2 cursor-not-allowed" : "bg-orange-400 text-white hover:bg-orange-600"}`}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableEleven;
