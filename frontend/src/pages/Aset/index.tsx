import _, { set } from "lodash";
import React, { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import Api from "../../../api";
import Loading from "../../base-components/Loading";
import Paginate from "../../base-components/Paginate";
import AsetAdd from "./AddAset";
import DeleteAset from "./DeleteAset";
import AsetEdit from "./EditAset";
import { useAuth } from "../../auth/authContext";
import RupiahFormat from "../../base-components/RupiahFormat";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";

type Aset = {
  id_aset: number;
  nama_aset: string;
  tanggal_pembelian: string;
  nilai_aset: number;
  jumlah: string;
};

function Main() {
  const { authToken } = useAuth();
  const [aset, setAset] = useState<Aset[]>([]);
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = useState(true);
  const [response, setResponse] = useState<any>({});

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/aset?page=${activePage}&search=${search}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setResponse(response.data);
      setAset(response.data.data.data);
      setMeta(response.data.data);
      console.log(response.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    getResponse();
  }, [activePage, search, limit]);

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y mb-4">Aset List</h2>
      <div className="bg-slate-200 shadow-md rounded-md pb-9 px-4 pt-3">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12 sm:col-span-6 xl:col-span-6 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="Database"
                    className="w-[28px] h-[28px] text-primary"
                  />
                  <div className="ml-auto">
                    <div
                      // as="div"
                      className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-2 items-center font-medium"
                    >
                      nominal
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  <RupiahFormat amount={response.total} />
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Total Nominal Aset
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-6 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box">
                <div className="flex">
                  <Lucide
                    icon="Database"
                    className="w-[28px] h-[28px] text-primary"
                  />
                  <div className="ml-auto">
                    <div
                      // as="div"
                      className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-2 items-center font-medium"
                    >
                      jumlah
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium leading-8">
                  {response.jumlah}
                </div>
                <div className="mt-1 text-base text-slate-500">
                  Total Jumlah Aset
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-3 ">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <AsetAdd
            getResponse={() => {
              getResponse();
            }}
          />
          <div className="hidden mx-auto md:block text-slate-500">
            Showing {meta.from} to {meta.to} of {meta.total} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {isMutating && <Loading />}
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y">
          <Table className="">
            <Table.Thead className="">
              <Table.Tr className=" bg-primary dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border-r text-white text-center whitespace-nowrap first:rounded-tl-lg">
                  NO
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                  NAMA ASET
                </Table.Th>
                <Table.Th className=" text-white border-b-0 border-r whitespace-nowrap">
                  NILAI ASET
                </Table.Th>
                <Table.Th className=" text-white border-b-0 border-r whitespace-nowrap">
                  JUMLAH
                </Table.Th>
                <Table.Th className="text-center text-white border-b-0 border-r whitespace-nowrap last:rounded-tr-lg">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating && aset && aset.length === 0 && (
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td
                    colSpan={6}
                    className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                  >
                    No matching data found.
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            )}
            <Table.Tbody className="bg-white">
              {aset.map((rows, rowsKey) => (
                <Table.Tr
                  key={rowsKey}
                  className="intro-x dark:hover:bg-darkmode-700"
                >
                  <Table.Td className="border text-center">
                    {rowsKey + 1}
                  </Table.Td>
                  <Table.Td className="border">{rows.nama_aset}</Table.Td>
                  <Table.Td className="border">
                    <RupiahFormat amount={rows.nilai_aset} />
                  </Table.Td>
                  <Table.Td className="border">{rows.jumlah}</Table.Td>
                  <Table.Td className="border">
                    <div className="flex items-center justify-center">
                      <AsetEdit aset={rows} getResponse={getResponse} />
                      <DeleteAset
                        asetId={rows.id_aset}
                        getResponse={getResponse}
                      />
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Paginate meta={meta} onPageChange={handlePageChange} />
          <div className="text-center flex items-center justify-center">
            <span>Showing </span>
            <div className="w-20 mt-3 !box sm:mt-0 mx-2">
              <FormSelect
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                }}
                value={limit}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </FormSelect>
            </div>
          </div>
        </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
