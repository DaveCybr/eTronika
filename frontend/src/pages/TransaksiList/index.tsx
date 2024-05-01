import _, { random, set } from "lodash";
import React, { useState, useRef, useEffect } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import axios from "axios";
import Api from "../../../api";
import Loading from "../../base-components/Loading";
import Paginate from "../../base-components/Paginate";
import RupiahFormat from "../../base-components/RupiahFormat";
import TransaksiAdd from "./AddTransaksi";
import Button from "../../base-components/Button";
import Tippy from "../../base-components/Tippy";
import Pembayaran from "./Pembayaran";
import DeleteTransaksi from "./DeleteTransaksi";
import TransaksiUpdate from "./EditTransaksi";
import Dialog from "../../base-components/Headless/Dialog";
import LoadingIcon from "../../base-components/LoadingIcon";
import Toast from "../../base-components/Notif/Notification";
import showToast from "../../base-components/Toast";
import { useNavigate, NavigateFunction } from "react-router-dom";
import Invoice from "./Invoice";
import clsx from "clsx";
import { useReactToPrint } from "react-to-print";

type Transaksi = {
  ref: string;
  lokasi: any;
  id_transaksi: number;
  tanggal_transaksi: string;
  total_pembelian: number;
  total_pembayaran: number;
  nama_member: string;
  nomor_telepon_member: string;
  alamat_member: string;
  nama_pelanggan: string;
  nomor_telepon: string;
  status_transaksi: string;
  catatan: string;
  alamat: string;
  id_member: number;
};

interface Data {
  members: member[];
}

type member = {
  id_member: number;
  nama_member: string;
};

function Main() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [response, setResponse] = React.useState<any>({});
  const [isMutating, setIsMutating] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const getResponse = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/transaksi?page=${activePage}&search=${search}&limit=${limit}&bulan=${
          formData.bulan
        }&tahun=${formData.tahun}&tanggal_1=${range.tanggal_1}&tanggal_2=${
          range.tanggal_2
        }&status_transaksi=${
          formData.status_transaksi || range.status_transaksi
        }`
      );
      setResponse(response.data);
      setTransaksi(response.data.data.data);
      setMeta(response.data.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [formData, setFormData] = React.useState<any>({
    bulan: "",
    tahun: "",
    status_transaksi: "",
  });

  const [range, setRange] = React.useState<any>({
    tanggal_1: "",
    tanggal_2: "",
    status_transaksi: "",
  });

  const [selectedRows, setSelectedRows] = React.useState<any>([]);

  const handleCheckboxChange = (e: any, row: any) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(selectedRows.filter((id: any) => id !== row));
    }
  };

  const handleAllCheckboxChange = (e: any) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allIds = transaksi.map((row) => row);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    getResponse();
  }, [activePage, search, limit]);

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Transaksi List</h2>
      <div className="grid grid-cols-12 gap-6 mt-3 ">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <TransaksiAdd getResponse={() => getResponse()} />
          <Button
            variant="facebook"
            onClick={() => {
              navigate("/master/member");
            }}
          >
            Member
          </Button>
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
        <div className="col-span-12 mt-5 sm:col-span-6 xl:col-span-4 intro-y ">
          <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-md before:bg-blue-200 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box bg-blue-300">
                <div className="flex">
                  <Lucide
                    icon="ShoppingCart"
                    className="w-[28px] h-[28px] text-blue-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-blue-500 flex rounded-full text-white p-1 text-xs items-center font-medium"
                      content="Up"
                    >
                      <Lucide icon="ArrowBigUp" className="w-4 h-4 " />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium text-slate-700 leading-8">
                  {response.transaksi} Data
                </div>
                <div className="mt-1 text-base text-slate-700">
                  Data Transaksi
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-5 sm:col-span-6 xl:col-span-4 intro-y ">
          <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-md before:bg-green-200 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box bg-green-300">
                <div className="flex">
                  <Lucide
                    icon="ShoppingCart"
                    className="w-[28px] h-[28px] text-green-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-green-500 flex rounded-full text-white p-1 text-xs items-center font-medium"
                      content="Selesai"
                    >
                      <Lucide icon="Check" className="w-4 h-4 " />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium text-slate-700 leading-8">
                  {response.transaksi_selesai} Data
                </div>
                <div className="mt-1 text-base text-slate-700">
                  Transaksi Selesai
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-5 sm:col-span-6 xl:col-span-4 intro-y ">
          <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-md before:bg-yellow-200 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box bg-yellow-300">
                <div className="flex">
                  <Lucide
                    icon="ShoppingCart"
                    className="w-[28px] h-[28px] text-yellow-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-yellow-500 flex rounded-full text-white p-1 text-xs items-center font-medium"
                      content="Selesai"
                    >
                      <Lucide icon="History" className="w-4 h-4 " />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium text-slate-700 leading-8">
                  {response.transaksi_belum_dibayar} Data
                </div>
                <div className="mt-1 text-base text-slate-700">
                  Transaksi Belum Dibayar
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-5 sm:col-span-6 xl:col-span-6 intro-y ">
          <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-md before:bg-green-200 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box bg-green-300">
                <div className="flex">
                  <Lucide
                    icon="ShoppingCart"
                    className="w-[28px] h-[28px] text-green-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-green-500 flex rounded-full text-white p-1 text-xs items-center font-medium"
                      content="Selesai"
                    >
                      <Lucide icon="Check" className="w-4 h-4 " />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium text-slate-700 leading-8">
                  <RupiahFormat amount={response.omset} />
                </div>
                <div className="mt-1 text-base text-slate-700">Omset</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-5 sm:col-span-6 xl:col-span-6 intro-y ">
          <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
            <div
              className={clsx([
                "relative zoom-in",
                "before:content-[''] before:w-[90%] before:shadow-md before:bg-red-200 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
              ])}
            >
              <div className="p-5 box bg-red-300">
                <div className="flex">
                  <Lucide
                    icon="ShoppingCart"
                    className="w-[28px] h-[28px] text-red-800"
                  />
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-red-500 flex rounded-full text-white p-1 text-xs items-center font-medium"
                      content="Selesai"
                    >
                      <Lucide icon="History" className="w-4 h-4 " />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-6 text-3xl font-medium text-slate-700 leading-8">
                  <RupiahFormat amount={response.piutang} />
                </div>
                <div className="mt-1 text-base text-slate-700">Piutang</div>
              </div>
            </div>
          </div>
        </div>
        <div className=" mb- items-end p-6 justify-between col-span-12 mt-5 intro-y sm:flex-nowrap bg-white rounded-md shadow">
          <div className=" item justify-center w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <label className="block mb-2 font-bold text-gray-600">
                  Bulan
                </label>
                <select
                  name="bulan"
                  className="border border-gray-300 shadow w-full rounded mb-"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      bulan: e.target.value,
                    });
                  }}
                >
                  <option value="">Pilih Bulan</option>
                  {[
                    { value: 1, label: "Januari" },
                    { value: 2, label: "Februari" },
                    { value: 3, label: "Maret" },
                    { value: 4, label: "April" },
                    { value: 5, label: "Mei" },
                    { value: 6, label: "Juni" },
                    { value: 7, label: "Juli" },
                    { value: 8, label: "Agustus" },
                    { value: 9, label: "September" },
                    { value: 10, label: "Oktober" },
                    { value: 11, label: "November" },
                    { value: 12, label: "Desember" },
                  ].map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-4">
                <label className="block mb-2 font-bold text-gray-600">
                  Tahun
                </label>
                <select
                  name="tahun"
                  className="border border-gray-300 shadow w-full rounded mb-"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      tahun: e.target.value,
                    });
                  }}
                >
                  <option value="">Pilih Tahun</option>
                  {[...Array(10)].map((_, i) => {
                    const tahun = currentYear - i;
                    return (
                      <option key={tahun} value={tahun}>
                        {tahun}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-span-4 flex justify-between">
                <div className="w-full me-5">
                  <label className="block mb-2 font-bold text-gray-600">
                    Status Transaksi
                  </label>
                  <select
                    name="tahun"
                    className="border border-gray-300 shadow w-full rounded mb-"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        status_transaksi: e.target.value,
                      });
                    }}
                    value={formData.status_transaksi}
                  >
                    <option value="">Semua</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Diinput">Diinput atau Belum Lunas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    className="mr-3 mb-1 text-sm text-white"
                    variant="facebook"
                    onClick={() => {
                      getResponse();
                      setRange({
                        tanggal_1: "",
                        tanggal_2: "",
                        status_transaksi: "",
                      });
                    }}
                  >
                    <p className="text-sm">FILTER</p>
                  </Button>
                </div>
              </div>
              <div className="col-span-4">
                <label className="block mb-2 font-bold text-gray-600">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  className="border border-gray-300 shadow w-full rounded mb-"
                  onChange={(e: any) => {
                    setRange({ ...range, tanggal_1: e.target.value });
                  }}
                />
              </div>
              <div className="col-span-4">
                <label className="block mb-2 font-bold text-gray-600">
                  Hingga Tanggal
                </label>
                <input
                  type="date"
                  className="border border-gray-300 shadow w-full rounded mb-"
                  onChange={(e: any) => {
                    setRange({ ...range, tanggal_2: e.target.value });
                  }}
                />
              </div>
              <div className="col-span-4 flex justify-between">
                <div className="w-full me-4">
                  <label className="block mb-2 font-bold text-gray-600">
                    Status Transaksi
                  </label>
                  <select
                    name="tahun"
                    className="border border-gray-300 shadow w-full rounded mb-"
                    onChange={(e) => {
                      setRange({
                        ...range,
                        status_transaksi: e.target.value,
                      });
                    }}
                  >
                    <option value="">Semua</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Diinput">Diinput atau Belum Lunas</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    className="mr-3 mb-1 text-sm text-white"
                    variant="facebook"
                    onClick={() => {
                      getResponse();
                      setFormData({
                        tanggal: "",
                        bulan: "",
                        tahun: "",
                        status_transaksi: "",
                      });
                    }}
                  >
                    <p className="text-sm">FILTER</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 flex">
          {selectedRows.length > 0 ? (
            <>
              {/* <Button variant="outline-danger" className=" w-24 mr-1">
                <Lucide icon="Trash" className="w-4 h-4 mr-1" /> Hapus
              </Button> */}
              <PrintCreate
                data={selectedRows}
                getResponse={() => getResponse()}
              />
            </>
          ) : (
            ""
          )}
        </div>

        <div className="overflow-x-auto mt- col-span-12">
          <Table className="shadow-md border-collapse border-black ">
            <Table.Thead className="">
              <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                <Table.Td className="border-b-0 py-2 px-2 pl-5 text-end text-white first:rounded-tl-md">
                  <FormCheck.Input
                    className="border border-white"
                    id="vertical-form-3"
                    type="checkbox"
                    onChange={(e) => handleAllCheckboxChange(e)}
                    checked={selectedRows.length === transaksi.length}
                  />
                </Table.Td>
                <Table.Th className="border-b-0 border-r text-start px-2 text-white first:rounded-tl-">
                  ID INVOICE
                </Table.Th>
                <Table.Th className="border-b-0 border-r py-2 px-2 text-white">
                  PELANGGAN
                </Table.Th>
                <Table.Th className="border-b-0 border-r py-2 px-2 text-white">
                  REFERENCE
                </Table.Th>
                <Table.Th className=" text-white border-r py-2 px-2 border-b-0 ">
                  NOMINAL
                </Table.Th>
                <Table.Th className=" text-white border-r py-2 px-2 border-b-0 ">
                  DIBAYAR
                </Table.Th>
                <Table.Th className=" text-white border-r py-2 px-2 border-b-0 ">
                  TANGGAL
                </Table.Th>
                <Table.Th className=" text-white border-r py-2 px-2 border-b-0 ">
                  CATATAN
                </Table.Th>
                <Table.Th className=" text-white border-r py-2 px-2 border-b-0 ">
                  STATUS
                </Table.Th>
                <Table.Th className="text-center text-white border-b-0  last:rounded-tr-md">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating && transaksi && transaksi.length === 0 && (
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
              {transaksi.map((rows, rowsKey) => (
                <Table.Tr
                  key={rowsKey}
                  className={`intro-y py-0 px-0 first:rounded-bl-md ${
                    rows.status_transaksi === "Selesai"
                      ? "bg-green-100 dark:bg-green-900"
                      : "bg-blue-100 dark:bg-blue-900"
                  }`}
                >
                  <Table.Td className="border-r-0  py-1 px-2 text-end border-gray-300 first:-bl-md">
                    <FormCheck.Input
                      id="vertical-form-3"
                      type="checkbox"
                      value={selectedRows.includes(rows)}
                      onChange={(e) => handleCheckboxChange(e, rows)}
                      checked={selectedRows.includes(rows)}
                    />
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2 text-  border-gray-300 ">
                    <Tippy
                      content="Detail Transaksi"
                      as={Button}
                      className="!box"
                      variant="soft-success"
                      size="sm"
                      onClick={() =>
                        handleNavigate(
                          `/transaksi/list-detail/${rows.id_transaksi}`
                        )
                      }
                    >
                      {rows.id_transaksi}
                    </Tippy>
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {rows.nama_member
                          ? rows.nama_member
                          : rows.nama_pelanggan}
                      </span>
                      <span className="text-xs text-slate-500">
                        {rows.alamat_member ? rows.alamat_member : rows.alamat}
                      </span>
                      <span className="text-xs text-slate-500">
                        {rows.nomor_telepon_member
                          ? rows.nomor_telepon_member
                          : rows.nomor_telepon}
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    {rows.ref}
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium text-white bg-green-500`}
                    >
                      <RupiahFormat amount={rows.total_pembelian} />
                    </span>
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                        rows.status_transaksi === "Selesai"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <RupiahFormat amount={rows.total_pembayaran} />
                    </span>
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    {rows.tanggal_transaksi}
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    {rows.catatan}
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                        rows.status_transaksi === "Selesai"
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    >
                      {rows.status_transaksi}
                    </span>
                  </Table.Td>
                  <Table.Td className="border-r-0 py-1 px-2  border-gray-300">
                    <div className="grid grid-cols-3 gap-1">
                      <TransaksiUpdate
                        data={rows}
                        getResponse={() => getResponse()}
                      />
                      <DeleteTransaksi
                        id={rows.id_transaksi}
                        getResponse={() => getResponse()}
                      />
                      <Invoice data={rows} />
                      {rows.id_member === null ? (
                        <MemberCreate
                          members={{
                            id_transaksi: rows.id_transaksi,
                            id_member: random(999, 100000),
                            nama_member: rows.nama_pelanggan,
                            alamat: rows.alamat,
                            nomor_telepon: rows.nomor_telepon,
                          }}
                          getResponse={() => getResponse()}
                        />
                      ) : null}
                      {rows.status_transaksi === "Selesai" ? null : (
                        <Pembayaran
                          data={rows}
                          getResponse={() => getResponse()}
                        />
                      )}
                      <Tippy
                        as={Button}
                        variant="outline-primary"
                        content="Lihat Lokasi"
                        className="shadow-md"
                        size="sm"
                        onClick={() => {
                          window.open(rows.lokasi);
                        }}
                      >
                        <Lucide
                          icon="MapPin"
                          className="w-4 h-4 text-primary"
                        />
                      </Tippy>
                      <Tippy
                        as={Button}
                        content="chat whatsapp"
                        className="shadow-md"
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          window.open(`https://wa.me/${rows.nomor_telepon}`);
                        }}
                      >
                        <Lucide
                          icon="MessageCircle"
                          className="w-4 h-4 text-"
                        />
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

interface props {
  members: any;
  getResponse: () => void;
}
const MemberCreate = ({ members, getResponse }: props) => {
  const [openMember, setOpenMember] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const handleSend = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/transaksi/${members.id_transaksi}/member`,
        members
      );
      setOpenMember(false);
      showToast("#memberCreated");
      setIsMutating(false);
      getResponse();
    } catch (error) {
      console.error(error);
      setIsMutating(false);
    }
  };
  return (
    <>
      <Toast
        id="memberCreated"
        title="Success"
        message="Member Created"
        type="success"
      />
      <Tippy
        as={Button}
        variant="outline-success"
        content="Jadikan Member"
        className="shadow-md"
        size="sm"
        onClick={() => {
          setOpenMember(true);
        }}
      >
        <Lucide icon="UserCheck" className="w-4 h-4 text-success" />
      </Tippy>
      <Dialog
        open={openMember}
        onClose={() => {
          setOpenMember(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="AlertCircle"
              className="w-16 h-16 mx-auto mt-3 text-warning"
            />
            <div className="mt-5 text-xl">
              Apa anda yakin menjadikan <strong>{members.nama_member}</strong>{" "}
              Member?
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setOpenMember(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button
                variant="outline-success"
                type="button"
                className="w-30"
                disabled
              >
                Mengirim
                <LoadingIcon
                  icon="puff"
                  color="black"
                  className="w-4 h-4 ml-2"
                />
              </Button>
            ) : (
              <Button
                variant="outline-success"
                type="button"
                className="w-24"
                onClick={() => handleSend()}
              >
                Yakin
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

interface printProps {
  data: any;
  getResponse: () => void;
}

const PrintCreate = ({ data }: printProps) => {
  const [openPrint, setOpenPrint] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [formData, setFormData] = useState<any>({
    data: data,
    nama_pelanggan: "",
    nomor_telepon: "",
    alamat: "",
    catatan: "",
    tanggal_transaksi: "",
  });

  // console.log(data);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Toast
        id="memberCreated"
        title="Success"
        message="Member Created"
        type="success"
      />
      <Tippy
        as={Button}
        variant="outline-success"
        content="Print"
        className="shadow-md"
        size="sm"
        onClick={() => {
          setOpenPrint(true);
        }}
      >
        <Lucide icon="Printer" className="w-4 h-4 mr-1" /> Print
      </Tippy>
      <Dialog
        open={openPrint}
        onClose={() => {
          setOpenPrint(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>Print Invoice</Dialog.Title>
          <Dialog.Description>
            <div className="grid gap-4">
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1">Nama Pelanggan</FormLabel>
                <FormInput
                  id="modal-form-1"
                  type="text"
                  placeholder="Nama Pelanggan"
                  name="nama_pelanggan"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-2">Nomor Telepon</FormLabel>
                <FormInput
                  id="modal-form-2"
                  type="text"
                  placeholder="Nomor Telepon"
                  name="nomor_telepon"
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-12 sm:col-span-12">
                <FormLabel htmlFor="modal-form-3">Alamat</FormLabel>
                <FormTextarea
                  id="modal-form-3"
                  placeholder="Alamat"
                  rows={4}
                  onChange={handleChange}
                  name="alamat"
                />
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <PrintFaktur data={data} formData={formData} />
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

interface Res {
  data: any[];
  formData: any;
}
function PrintFaktur({ data, formData }: Res) {
  const [open, setOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const totalHarga = data.reduce(
    (total, item) => total + parseInt(item.total_pembelian),
    0
  );
  const subtotal = totalHarga;
  const total = totalHarga;

  return (
    <>
      <Tippy
        variant="outline-primary"
        className="shadow-md"
        content="Print"
        as={Button}
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Lucide icon="Printer" className=" text-primary mr-1" /> PRINT
      </Tippy>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        // as="div"
        // id="print-area"
        size="lg"
        // ref={componentRef}
      >
        <Dialog.Panel>
          <Dialog.Title>
            <div className="w-full items-center flex justify-between">
              <h3>Invoice</h3>
              <div>
                <Button
                  onClick={() => {
                    handlePrint();
                  }}
                  className="mr-2"
                >
                  <Lucide icon="Printer" className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <Lucide icon="X" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Dialog.Title>
          <div ref={componentRef} className="invoice">
            <div
              className="invoice-container"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <div className="invoice-head">
                <div className="flex justify-between mb-3">
                  <div className="invoice-head-top-left text-start">
                    <img src={`${Api}/gambar/RAFA_ELEKTRONIC.png`} />
                  </div>
                  <div className="invoice-head-top-right flex flex-col justify-between items-end text-end">
                    <h3>Invoice</h3>
                    <div>
                      <p>
                        <span className="text-bold">Tanggal :</span>{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                      {/* <p>
                        <span className="text-bold">No. INVOICE :</span>{" "}
                        {formData.id_transaksi}
                      </p> */}
                    </div>
                  </div>
                </div>
                <div className="hr"></div>
                <div className="invoice-head-bottom">
                  <div className="invoice-head-bottom-left">
                    <ul>
                      <li className="text-bold">Invoiced To:</li>
                      <li>{formData.nama_pelanggan}</li>
                      <li>{formData.nomor_telepon}</li>
                      <li>{formData.alamat}</li>
                    </ul>
                  </div>
                  <div className="invoice-head-bottom-right">
                    <ul className="text-end">
                      <li className="text-bold">Pay To:</li>
                      <li>Rafa Electronics</li>
                      <li>082335704609</li>
                      <li>Jl. Raya PB Sudirman Tanggul Kulon No.15</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="-view">
                <div className="invoice-body">
                  <table>
                    <thead>
                      <tr>
                        <td className="text-bold">Objek</td>
                        <td className="text-bold">Catatan</td>
                        <td className="text-bold text-end">Total</td>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item: any, i: number) => (
                        <tr key={i}>
                          <td>{item.nama_pelanggan}</td>
                          <td>{item.catatan}</td>
                          <td className="text-end">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(item.total_pembelian)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="invoice-body-bottom">
                    <div className="invoice-body-info-item border-bottom">
                      <div className="info-item-td text-end text-bold">
                        Sub Total:
                      </div>
                      <div className="info-item-td text-end">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(subtotal)}
                      </div>
                    </div>
                    <div className="invoice-body-info-item">
                      <div className="info-item-td text-end text-bold">
                        Total:
                      </div>
                      <div className="info-item-td text-end">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(total)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h1>
                    Terima kasih telah berlangganan di Rafa Electronics, semoga
                    hari anda menyenangkan.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
