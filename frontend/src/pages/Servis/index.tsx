import _ from "lodash";

import React, { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import Api from "../../../api";
import Loading from "../../base-components/Loading";
import Paginate from "../../base-components/Paginate";
import AddForm from "./AddServis";
import EditForm from "./EditServis";
import { useAuth } from "../../auth/authContext";
import showToast from "../../base-components/Toast";
import Toast from "../../base-components/Notif/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import MemberAdd from "../Member/AddMember";
import Tippy from "../../base-components/Tippy";
import "./index.css";
import Invoice from "./InvoiceServis";

interface Response {
  unitServis: [];
  servis: Servis[];
  teknisi: TimTeknisi[];
  member: Member[];
  karyawan: Karyawan[];
  jasa: any[];
  total: [];
  jumlahJasa: [];
}

type Servis = {
  id_servis: number | string;
  nama_member: string;
  alamat: string;
  nomor_telepon: string;
  id_member: number;
  jumlah_unit: number;
  deskripsi_servis: string;
  tanggal_waktu: string;
  status_servis: string;
};

type TimTeknisi = {
  id_teknisi: number;
  nama_teknisi: string;
};

type Member = {
  id_member: number;
  nama_member: string;
  alamat: string;
  nomor_telepon: string;
};

type Karyawan = {
  id_karyawan: number;
  nama_karyawan: string;
};

function Main() {
  const [responses, setResponses] = useState<Response>({
    unitServis: [],
    servis: [],
    teknisi: [],
    member: [],
    karyawan: [],
    jasa: [],
    total: [],
    jumlahJasa: [],
  });
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = useState(true);

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/servis?page=${activePage}&search=${search}&limit=${limit}`
      );
      const teknisi = await axios.get(`${Api}/api/karyawan`);
      setResponses({
        unitServis: response.data.jumlah_unit_servis,
        servis: response.data.servis.data,
        teknisi: teknisi.data.data,
        member: response.data.member,
        karyawan: response.data.karyawan,
        jasa: response.data.jasa,
        total: response.data.total_harga,
        jumlahJasa: response.data.jumlah_jasa,
      });
      setMeta(response.data.servis);
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
      <h2 className="mt-10 text-lg font-medium intro-y">Servis</h2>
      <div className="grid grid-cols-12 gap-6 mt-3 ">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <AddForm
            getResponse={() => {
              getResponse();
            }}
            member={responses.member}
            karyawan={responses.teknisi}
            jasa={responses.jasa}
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
          <Table className="shadow-md border-collapse border-black -mt-2 col-span-12 ">
            <Table.Thead className="rounded-full border">
              <Table.Tr className="bg-primary dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border-r text-white first:rounded-tl-md">
                  ID SERVIS
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white  ">
                  Nama Pelanggan
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white  ">
                  Jumlah Unit
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white  ">
                  Grand Total
                </Table.Th>
                {/* <Table.Th className="border-b-0 border-r text-white  ">
                  Deskripsi Servis
                </Table.Th> */}
                <Table.Th className=" border-b-0 border-r text-white  ">
                  Tanggal Servis
                </Table.Th>
                <Table.Th className=" border-b-0 border-r text-white   last:rounded-tr-md">
                  Status
                </Table.Th>
                <Table.Th className="text-center border text-white border-b-0  last:rounded-tr-md">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating &&
              responses.servis &&
              responses.servis.length === 0 && (
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td
                      colSpan={7}
                      className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                    >
                      No matching data found.
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              )}
            <Table.Tbody>
              {responses.servis.map((servisRow, servisKey) => (
                <Table.Tr
                  key={servisKey}
                  className={`intro-y first:rounded-bl-md ${
                    servisRow.status_servis === "Done"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-blue-100 dark:bg-blue-900"
                  }`}
                >
                  <Table.Td className="border-r border-b-0 border-gray-300 text-center">
                    {servisRow.id_servis}
                  </Table.Td>
                  <Table.Td className="border-r border-b-0 border-gray-300">
                    {servisRow.nama_member}
                  </Table.Td>
                  <Table.Td className="border-r border-b-0 border-gray-300 text-center">
                    {responses.unitServis[servisRow.id_servis as number]} Unit
                  </Table.Td>
                  <Table.Td className="border-r border-b-0 border-gray-300 text-center">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(responses.total[servisRow.id_servis as number])}
                  </Table.Td>
                  {/* <Table.Td className="border-r border-b-0 border-gray-300">
                    {servisRow.deskripsi_servis}
                  </Table.Td> */}
                  <Table.Td className="border-r border-b-0 border-gray-300">
                    {new Date(servisRow.tanggal_waktu).toLocaleDateString(
                      "en-GB"
                    )}
                  </Table.Td>
                  <Table.Td className="border-r border-b-0 border-gray-300">
                    {servisRow.status_servis}
                  </Table.Td>
                  <Table.Td className="border-r border-b-0 border-gray-300">
                    <div className="flex items-center justify-between">
                      <EditForm
                        getResponse={() => {
                          getResponse();
                        }}
                        response={servisRow}
                      />
                      <Tippy
                        as={Button}
                        variant="outline-warning"
                        content="Print Servis"
                        onClick={() =>
                          (window.location.href = `/invoice-servis/${servisRow.id_servis}`)
                        }
                        className="me-1 text-center items-center"
                      >
                        <Lucide icon="Printer" className="w-4 h-4" />
                      </Tippy>
                      <Tippy
                        as={Button}
                        variant="outline-success"
                        content="Tambah Unit Yang Mau Di Servis"
                        onClick={() =>
                          (window.location.href = `/schedule/detail-service/${servisRow.id_servis}/${servisRow.id_member}`)
                        }
                        className="me-1 text-center items-center"
                      >
                        <Lucide icon="FileText" className="w-4 h-4" />
                      </Tippy>
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
