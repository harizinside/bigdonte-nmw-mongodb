import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableSeven from "@/components/Tables/TableSeven";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const SubscriberPage = () => {
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb route="dashboard/subscribers" pageName="Manage Subscribers" routeSecond="" pageNameSecond="" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
        </div>

      <div className="flex flex-col gap-10">
        <TableSeven /> 
      </div>
    </DefaultLayout>
  ); 
};

export default SubscriberPage;
