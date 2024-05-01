import _, { set } from "lodash";
import React, { useState, useRef, useEffect } from "react";
import Button from "../../../base-components/Button";
import Table from "../../../base-components/Table";
import axios from "axios";
import Api from "../../../../api";
import Lucide from "../../../base-components/Lucide";
import Loading from "../../../base-components/Loading";
import {
  FormSelect,
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import Paginate from "../../../base-components/Paginate";
import Select from "react-select";
import { useParams } from "react-router-dom";
import showToast from "../../../base-components/Toast";
import Toast from "../../../base-components/Notif/Notification";
import Dialog from "../../../base-components/Headless/Dialog";
import LoadingIcon from "../../../base-components/LoadingIcon";
import DeleteFunction from "./DeleteDetail";
import EditForm from "./EditDetail";
import DokumenFunction from "./Dokumentasi";
import { useAuth } from "../../../auth/authContext";
import AddForm from "./AddDetail";

type Response = {
  id_servis: number;
  id_detail_servis: number;
  id_unit_terdaftar: number;
  nama_unit: string;
  unique_seri: string;
  deskripsi_servis: string;
  id_karyawan: number;
  nama_karyawan: string;
};

type Unit = {
  id_unit_terdaftar: number;
  nama_unit: string;
};

function Main() {
  const { id, id_member } = useParams();
  const [responses, setResponses] = useState<Response[]>();
  const [unit, setUnit] = useState<Unit[]>();
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = useState(true);
  const [unit_transaksi, setUnitTransaksi] = useState<any>({
    jumlah_sparepart: [],
    total_harga: [],
  });

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/servis/${id}/${id_member}/detail-servis?page=${activePage}&limit=${limit}&search=${search}`
      );
      setResponses(response.data.detail_servis.data);
      console.log(response.data.detail_servis.data);
      setUnitTransaksi({
        jumlah_sparepart: response.data.jumlah_sparepart,
        total_harga: response.data.total_harga,
      });
      console.log(response.data);
      setUnit(response.data.unit);
      setMeta(response.data.detail_servis);
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
      <h2 className="mt-10 text-lg font-medium intro-y">Unit Servis</h2>
      <div className="grid grid-cols-12 gap-6 mt-3 ">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button
            variant="outline-secondary"
            className="shadow-md mr-2"
            onClick={() => {
              window.location.href = `/schedule/service`;
            }}
          >
            <Lucide icon="ArrowLeft" className="w-4 h-4 me-2" />
            Kembali
          </Button>
          <AddForm
            getResponse={() => {
              getResponse();
            }}
            unit={unit}
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
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-collapse border border-gray-200 -mt-2">
            <Table.Thead className="rounded-full border">
              <Table.Tr className="rounded-full border bg-primary dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border text-white text-center whitespace-nowrap first:rounded-tl-md">
                  NO
                </Table.Th>
                <Table.Th className="border-b-0 border text-white ">
                  UNIQUE ID
                </Table.Th>
                <Table.Th className="border-b-0 border text-white ">
                  NAMA UNIT
                </Table.Th>
                <Table.Th className="border-b-0 border text-white">
                  KELUHAN
                </Table.Th>
                <Table.Th className="border-b-0 border uppercase text-white ">
                  Jumlah Pembelian
                </Table.Th>
                <Table.Th className="border-b-0 border uppercase text-white ">
                  Total
                </Table.Th>
                <Table.Th className="border-b-0 border uppercase text-white ">
                  Teknisi
                </Table.Th>
                <Table.Th className="text-center text-white border border-b-0">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating && responses && responses.length === 0 && (
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td
                    colSpan={8}
                    className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                  >
                    No matching data found.
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            )}
            <Table.Tbody>
              {responses?.map((rows, rowsKey) => (
                <Table.Tr
                  key={rowsKey}
                  className="intro-x dark:hover:bg-darkmode-700"
                >
                  <Table.Td className="border text-center">
                    {rowsKey + 1}
                  </Table.Td>
                  <Table.Td className="border">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {rows.unique_seri}
                    </span>
                  </Table.Td>
                  <Table.Td className="border">{rows.nama_unit}</Table.Td>
                  <Table.Td className="border">
                    {rows.deskripsi_servis}
                  </Table.Td>
                  <Table.Td className="border">
                    {unit_transaksi.jumlah_sparepart[rows.id_detail_servis]}{" "}
                    Item
                  </Table.Td>
                  <Table.Td className="border">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(
                      unit_transaksi.total_harga[rows.id_detail_servis]
                    )}
                  </Table.Td>
                  <Table.Td className="border">{rows.nama_karyawan}</Table.Td>
                  <Table.Td className="border">
                    <div className=" items-center">
                      <EditForm
                        getResponse={getResponse}
                        response={rows}
                        unit={unit ?? []}
                      />
                      <DokumenFunction
                        unit={rows}
                        id_detail_servis={rows.id_detail_servis}
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
