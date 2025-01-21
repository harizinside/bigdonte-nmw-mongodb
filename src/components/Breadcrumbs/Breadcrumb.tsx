import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
  pageNameSecond: string;
  route: string;
}

const Breadcrumb = ({ pageName, pageNameSecond, route }: BreadcrumbProps) => {
  return (
    <div className=" flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName}
      </h2> */}

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-orange-400"><Link href={`/${route}`}>{pageName}</Link></li>
          <li className="font-medium text-orange-400">{pageNameSecond}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
