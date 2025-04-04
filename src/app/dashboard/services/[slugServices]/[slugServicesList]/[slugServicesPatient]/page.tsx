'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ButtonDefault from "@/components/Buttons/ButtonDefault";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useParams } from "next/navigation";
import TableFiveteen from "@/components/Tables/TableFiveteen";

const Services = () => { 
  const { slugServices, slugServicesList, slugServicesPatient } = useParams();
  const formatSlugToTitle = (slug: string) => {
    return slug
      .split("-") // Pisahkan berdasarkan "-"
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama jadi kapital
      .join(" "); // Gabungkan kembali dengan spasi
  };

  const formattedTitle = formatSlugToTitle(Array.isArray(slugServices) ? slugServices[0] : slugServices);
  const formattedTitleList = formatSlugToTitle(Array.isArray(slugServicesList) ? slugServicesList[0] : slugServicesList);
  const formattedTitlePatient = formatSlugToTitle(Array.isArray(slugServicesPatient) ? slugServicesPatient[0] : slugServicesPatient);
  
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb route="dashboard/services" pageName="Manage Services" routeSecond={`dashboard/services/${slugServices}`} pageNameSecond={`/ ${formattedTitle}`} routeThird={`dashboard/services/${slugServices}/${slugServicesList}`} pageNameThird={`/ ${formattedTitleList}`} routeFour={`dashboard/services/${slugServices}/${slugServicesList}/${slugServicesPatient}`} pageNameFour={`/ ${formattedTitlePatient} Patient`} routeFive="" pageNameFive="" />

            <ButtonDefault
                    label="Add New Patient"
                    link={`/dashboard/services/${slugServices}/${slugServicesList}/${slugServicesPatient}/create`}
                    customClasses="bg-green text-white py-[11px] px-6 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
            </ButtonDefault>
        </div>

      <div className="flex flex-col gap-10">
        <TableFiveteen /> 
      </div>
    </DefaultLayout>
  ); 
};

export default Services;
