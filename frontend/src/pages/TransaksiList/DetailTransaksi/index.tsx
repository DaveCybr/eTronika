import _, { get } from "lodash";
import { useState, useRef, useEffect } from "react";
import { FormInput, FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Paginate from "../../../base-components/Paginate";
import Table from "../../../base-components/Table";
import axios from "axios";
import Api from "../../../../api";
import Loading from "../../../base-components/Loading";
import { useAuth } from "../../../auth/authContext";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../base-components/Button";
import React from "react";
import AddDetail from "./AddDetail";
import EditDetail from "./EditDetail";
import { Tab } from "@headlessui/react";
import DeleteDetail from "./DeleteDetail";
import EditServis from "./EditServis";
import DeleteServis from "./DeleteServis";
import AddServis from "./AddServis";

function Main() {
  const { id } = useParams();
  const [activePage, setActivePage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [isMutating, setIsMutating] = useState(false);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [detailBeli, setDetailBeli] = useState<any>([]);
  const [unitTransaksi, setUnitTransaksi] = useState<any>([]);
  const navigate = useNavigate();
  const [dataTransaksi, setDataTransaksi] = useState<any>([]);

  async function getTransaksi() {
    try {
      const response = await axios.get(`${Api}/api/transaksiById/${id}`);
      setDataTransaksi(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const getResponse = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/transaksi/detail/${id}?page=${activePage}&search=${search}&limit=${limit}`
      );
      setDetailBeli(response.data.detail_transaksi.data);
      setUnitTransaksi(response.data.unit_transaksi);
      // console.log(response.data);
      setMeta(response.data.detail_transaksi);
      setIsMutating(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getResponse();
    getTransaksi();
  }, [activePage, search, limit]);

  let [categories] = useState({
    Recent: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    Popular: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
    Trending: [
      {
        id: 1,
        title: "Ask Me Anything: 10 answers to your questions about coffee",
        date: "2d ago",
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: "4d ago",
        commentCount: 1,
        shareCount: 2,
      },
    ],
  });

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          navigate("/transaksi/list");
        }}
        className="mr-2 mt-10 shadow-md"
      >
        <Lucide icon="ArrowLeft" className="w-4 h-4 text-gray" />
        Kembali
      </Button>
      <div className="flex justify-between">
        <h2 className="mt-5 text-lg font-medium intro-x">Detail Transaksi</h2>
        {/* <p className="mt-5 text-lg font-medium intro-x">No. Transaksi : {id}</p> */}
      </div>

      <div className="w-full px-2 py-5 sm:px-0">
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-t-lg bg-blue-900/20  max-w-sm">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-tl-lg py-2.5 text-sm font-medium leading-5",
                  selected
                    ? "bg-white text-primary border-b-2 border-primary shadow"
                    : "text-black hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Detail Pembelian Barang
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-tr-lg py-2.5 text-sm font-medium leading-5",
                  selected
                    ? "bg-white text-primary border-b-2 border-primary shadow"
                    : "text-black hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Detail Servis
            </Tab>
          </Tab.List>
          <Tab.Panels className="">
            <Tab.Panel
              className={classNames("rounded-b-xl bg-white p-3", "shadow-md")}
            >
              <div className="grid  grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                  <AddDetail getResponse={getResponse} />
                  <div className="hidden mx-auto md:block text-slate-500 justify-center align-center text-center">
                    Showing {meta.from} to {meta.to} of {meta.total} entries
                  </div>
                  <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                    <div className="relative w-56 text-slate-500">
                      <FormInput
                        type="text"
                        className="w-56 pr-10 !box"
                        placeholder="Search..."
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                      <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                      />
                    </div>
                  </div>
                </div>
                {isMutating && <Loading />}
                <div className="overflow-x-auto col-span-12">
                  <Table className="shadow-md border-collapse border-gray-200">
                    <Table.Thead className="rounded-full ">
                      <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                        <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                          NO
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white ">
                          BARANG
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white text-end">
                          HARGA
                        </Table.Th>
                        {/* <Table.Th className="border-b-0 border-r text-white ">
                          HARGA JUAL
                        </Table.Th> */}
                        <Table.Th className="border-b-0 border-r text-center text-white ">
                          QTY
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white text-end">
                          TOTAL
                        </Table.Th>
                        <Table.Th className="text-center w-[10%] text-white border-b-0  last:rounded-tr-md">
                          ACTIONS
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    {detailBeli.length === 0 && (
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td
                            colSpan={7}
                            className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                          >
                            No matching data found.
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    )}
                    <Table.Tbody>
                      {detailBeli.map((item: any, index: number) => {
                        return (
                          <Table.Tr key={index} className="">
                            <Table.Td className="text-center ">
                              {index + 1}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              {item.nama_product}
                            </Table.Td>
                            {/* <Table.Td className="border border-t-0">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(item.hpp)}
                            </Table.Td> */}
                            <Table.Td className="border border-t-0 text-end">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                minimumFractionDigits: 0,
                                currency: "IDR",
                              }).format(item.harga)}
                            </Table.Td>
                            <Table.Td className="border border-t-0 text-center">
                              {item.qty}
                            </Table.Td>
                            <Table.Td className="border border-t-0 text-end">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                minimumFractionDigits: 0,
                                currency: "IDR",
                              }).format(item.subtotal)}
                            </Table.Td>
                            <Table.Td className="text-center border border-t-0 border-l-0 border-r-0 flex ">
                              <EditDetail
                                getResponse={getResponse}
                                data={item}
                              />
                              <DeleteDetail
                                getResponse={getResponse}
                                detail={item}
                              />
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </div>

                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                  {isMutating === true ? (
                    ""
                  ) : (
                    <Paginate meta={meta} onPageChange={handlePageChange} />
                  )}
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
            </Tab.Panel>
            <Tab.Panel
              className={classNames("rounded-b-xl shadow-md bg-white p-3")}
            >
              <div className="grid  grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap justify-between items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                  <AddServis getResponse={getResponse} data={dataTransaksi} />
                  <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                    <div className="relative w-56 text-slate-500 shadow-md border">
                      <FormInput
                        type="text"
                        className="w-56 pr-10 !box "
                        placeholder="Search..."
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                      />
                      <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                      />
                    </div>
                  </div>
                </div>
                {isMutating && <Loading />}
                <div className="overflow-x-auto col-span-12">
                  <Table className="shadow-md border-collapse border-gray-200 ">
                    <Table.Thead className="rounded-full ">
                      <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                        <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                          NO
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white ">
                          NAMA UNIT
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white ">
                          TEKNISI
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white ">
                          ITEM
                        </Table.Th>
                        {/* <Table.Th className="border-b-0 border-r text-white ">
                          KATEGORI
                        </Table.Th> */}
                        <Table.Th className="border-b-0 border-r text-white ">
                          HARGA
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-center text-white ">
                          QTY
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white last:rounded-tr-md">
                          TOTAL
                        </Table.Th>
                        <Table.Th className="text-center w-[10%] text-white border-b-0  last:rounded-tr-md">
                          ACTIONS
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    {unitTransaksi.length === 0 && (
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Td
                            colSpan={8}
                            className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                          >
                            No matching data found.
                          </Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    )}
                    <Table.Tbody>
                      {unitTransaksi.map((item: any, index: number) => {
                        return (
                          <Table.Tr key={index} className="">
                            <Table.Td className="text-center ">
                              {index + 1}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              {item.nama_unit}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              {item.nama_karyawan}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              {item.nama_product} - {item.nama_kategori}
                            </Table.Td>
                            {/* <Table.Td className="border border-t-0">
                              {item.nama_kategori}
                            </Table.Td> */}
                            <Table.Td className="border border-t-0 ">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                minimumFractionDigits: 0,
                                currency: "IDR",
                              }).format(item.harga)}
                            </Table.Td>
                            <Table.Td className="border border-t-0 text-center">
                              {item.qty}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                minimumFractionDigits: 0,
                                currency: "IDR",
                              }).format(item.total)}
                            </Table.Td>
                            <Table.Td className="text-center border border-r-0 border-l-0 border-t-0">
                              <div className=" flex ">
                                <EditServis
                                  getResponse={getResponse}
                                  data={item}
                                />
                                <DeleteServis
                                  getResponse={getResponse}
                                  detail={item}
                                />
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </div>

                <div className="flex justify-between items-center col-span-12 ">
                  {isMutating === true ? (
                    ""
                  ) : (
                    <Paginate meta={meta} onPageChange={handlePageChange} />
                  )}
                  <div className="hidden mx-auto md:block text-slate-500 justify-center align-center text-center">
                    Showing {meta.from} to {meta.to} of {meta.total} entries
                  </div>
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
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}

export default Main;
