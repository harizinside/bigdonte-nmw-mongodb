import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";
import ButtonDefault from "@/components/Buttons/ButtonDefault";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Doctors || NMW Aesthetic Clinic",
  description: "Dashboard Doctors for editing and managing doctors",
};

const DoctorPage = () => {
  return (
    <DefaultLayout>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Breadcrumb route="dashboard/doctors" pageName="Manage Doctors" routeSecond="" pageNameSecond="" routeThird="" pageNameThird="" routeFour="" pageNameFour="" routeFive="" pageNameFive=""/>
            <div className="flex gap-3">
              <ButtonDefault
                      label="Edit Doctor Page"
                      link="/dashboard/doctors/doctorsPage"
                      customClasses="bg-transparent border border-orange-400 text-orange-400 py-[11px] px-6 rounded-lg dark:text-orange-400 hover:bg-orange-400 hover:text-white hover:dark:text-white"
                  >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" d="M4 22h16"/><path d="m13.888 3.663l.742-.742a3.146 3.146 0 1 1 4.449 4.45l-.742.74m-4.449-4.448s.093 1.576 1.483 2.966s2.966 1.483 2.966 1.483m-4.449-4.45L7.071 10.48c-.462.462-.693.692-.891.947a5.2 5.2 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-.875 2.626m14.08-8.13l-6.817 6.817c-.462.462-.692.692-.947.891q-.451.352-.969.599c-.291.139-.601.242-1.22.448l-2.626.876m0 0l-.641.213a.848.848 0 0 1-1.073-1.073l.213-.641m1.501 1.5l-1.5-1.5"/></g></svg>              </ButtonDefault>
              <ButtonDefault
                      label="Add New Doctor"
                      link="/dashboard/doctors/create"
                      customClasses="bg-green text-white py-[11px] px-6 rounded-lg"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg>
              </ButtonDefault>
            </div>
        </div>

      <div className="flex flex-col gap-10">
        <TableThree showPagination={true}/>
      </div>
    </DefaultLayout>
  );
}; 

export default DoctorPage;
