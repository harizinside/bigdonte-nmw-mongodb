'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import RichEditor from "@/components/rich-editor/page";
import { useEffect, useState } from "react";

const CreateLegality = () => {
  const [legality, setLegality] = useState({ privacyPolicy: "", termsCondition: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDataPrivacy = async () => {
      try {
        const res = await fetch(`/api/legality`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!res.ok) throw new Error("Gagal mengambil data");

        const result = await res.json();
        setLegality(result); 
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataPrivacy();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/legality", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
        body: JSON.stringify({
          privacyPolicy: legality.privacyPolicy,
          termsCondition: legality.termsCondition,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      setMessage("Legality successfully updated!");
      setIsOpen(true);
    } catch (err: any) {
      setError(err.message);
      setMessage("Error saving legality: " + error);
      setIsOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb route="dashboard/legality" pageName="Manage Legality" routeSecond="" pageNameSecond="" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="p-6.5">
              {/* Privacy Policy */}
              <div className="mb-7">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Privacy Policy
                </label>
                <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                  <RichEditor
                    value={legality.privacyPolicy || ""}
                    onChange={(html) => setLegality({ ...legality, privacyPolicy: html })}
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-7">
                <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                  Terms & Condition
                </label>
                <div className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-orange-400 active:border-orange-400 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-orange-400">
                  <RichEditor
                    value={legality.termsCondition || ""}
                    onChange={(html) => setLegality({ ...legality, termsCondition: html })}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500">{error}</p>}

              {/* Save Button */}
              <div className="flex gap-3 mt-7">
                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex w-max gap-2 justify-center rounded-[7px] bg-green-500 p-[9px] px-5 font-medium text-white hover:bg-opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7v14H3V3h14zm-9 11q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6z"/></svg>
                    {isSubmitting ? "Saving..." : "Save Legality"}
                </button>
              </div>
            </div>
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
            onClick={() => setIsOpen(false)} 
            className={`text-lg text-white py-2 px-5 rounded-lg cursor-pointer ${message.includes('Error') || message.includes('Please fill in all required fields!') ? 'bg-red-500' : 'bg-green-500'}`}>
            OK
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateLegality;