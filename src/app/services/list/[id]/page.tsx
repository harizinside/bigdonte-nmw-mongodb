'use client'

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableSix from "@/components/Tables/TableSix";
import ButtonDefault from "@/components/Buttons/ButtonDefault";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableEleven from "@/components/Tables/TableEleven";
import TableTwelve from "@/components/Tables/TableTwelve";
import TableThreeteen from "@/components/Tables/TableThreeteen";
import { useParams } from "next/navigation";

const ServicesSecond = () => { 
  const { id } = useParams();
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb route="services" pageName="Manage Services" pageNameSecond="/ Manage Services List" pageNameThird="" pageNameFour="" pageNameFive="" />
            <ButtonDefault
                    label="Add New Services List"
                    link={`/services/list/${id}/create`}
                    customClasses="bg-green text-white py-[11px] px-6 rounded-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
            </ButtonDefault>
        </div>
      <div className="flex flex-col gap-10">
        <TableThreeteen /> 
      </div>
    </DefaultLayout>
  );  
};

export default ServicesSecond;
