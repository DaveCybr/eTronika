import axios from "axios";
import React, { useState } from "react";
import Api from "../../../../api";
import showToast from "../../../base-components/Toast";
import Toast from "../../../base-components/Notif/Notification";
import Lucide from "../../../base-components/Lucide";
import Button from "../../../base-components/Button";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Table from "../../../base-components/Table";
import { set } from "lodash";
import Dropify from "../../../base-components/Dropify";
import { FormLabel, FormTextarea } from "../../../base-components/Form";
import Tippy from "../../../base-components/Tippy";
import RupiahFormat from "../../../base-components/RupiahFormat";
import clsx from "clsx";
import { Tab } from "@headlessui/react";
import { Dialog } from "../../../base-components/Headless";
import PengeluaranEdit from "../../Pengeluaran/EditPengeluaran";
import PengeluaranDelete from "../../Pengeluaran/DeletePengeluaran";
import PembayaranEdit from "../../Pembayaran/EditPembayaran";
import PembayaranDelete from "../../Pembayaran/DeletePembayaran";

interface Props {
  data: any;
  tahun: any;
}

export default function PemasukanList({ data, tahun }: Props) {
  const [openModal, setOpenModal] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [response, setResponse] = React.useState<any>();

  const fetch = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/laporanTahunan?tahun=${tahun}`
      );
      setResponse(response.data);
      setIsMutating(false);
    } catch (error) {
      setIsMutating(false);
      console.log(error);
    }
  };

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Toast
        id="updateSuccess"
        title="Success"
        message="Data has been Updated"
        type="success"
      />
      <Toast
        id="deleteSuccess"
        title="Success"
        message="Data has been deleted"
        type="success"
      />
      <Tippy
        content="Click to see detail"
        className="shadow-md w-full"
        onClick={() => {
          setOpenModal(true);
          fetch();
        }}
      >
        <div
          className={clsx([
            "relative zoom-in w-full",
            "before:content-[''] before:w-[90%] before:shadow-md before:bg-green-200 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
          ])}
        >
          <div className="p-5 box bg-green-300">
            <div className="flex">
              <Lucide
                icon="Wallet"
                className="w-[28px] h-[28px] text-success"
              />
              <div className="ml-auto">
                <Tippy
                  as="div"
                  className="cursor-pointer bg-success flex rounded-full text-white p-1 text-xs items-center font-medium"
                  content="Up"
                >
                  <Lucide icon="ArrowBigUp" className="w-4 h-4 " />
                </Tippy>
              </div>
            </div>
            <div className="mt-6 text-3xl font-medium text-slate-700 leading-8">
              <RupiahFormat amount={data.pemasukan} />
            </div>
            <div className="mt-1 text-base text-slate-700">Total Pemasukan</div>
          </div>
        </div>
      </Tippy>

      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        size="xl"
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Detail Pemasukan</h1>
          </Dialog.Title>
          <Dialog.Description>
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
                  Pembayaran Transaksi
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
                  Pemasukan lainnya
                </Tab>
              </Tab.List>
              <Tab.Panels className="">
                <Tab.Panel
                  className={classNames(
                    "rounded-b-xl bg-white p-3",
                    "shadow-md"
                  )}
                >
                  <div className="grid grid-cols-12 gap-4 ">
                    <div className="col-span-12 overflow-auto intro-y">
                      <Table className="shadow-md ">
                        <Table.Thead className="">
                          <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                            <Table.Th className="border-b-0 border-r text-white first:rounded-tl-md">
                              NO
                            </Table.Th>
                            <Table.Th className="border-b-0 border-r text-white">
                              ID TRANSAKSI
                            </Table.Th>
                            <Table.Th className="border-b-0 border-r text-white">
                              NAMA
                            </Table.Th>
                            <Table.Th className=" text-white border-r border-b-0 ">
                              NOMINAL
                            </Table.Th>
                            <Table.Th className=" text-white border-r border-b-0 ">
                              TANGGAL
                            </Table.Th>
                            <Table.Th className="border-b-0 border-r text-white ">
                              KETERANGAN
                            </Table.Th>
                            <Table.Th className="border-b-0 border-r text-white last:rounded-tr-md">
                              ACTIONS
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        {!isMutating &&
                          response &&
                          response.dataPembayaran.length === 0 && (
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
                        <Table.Tbody className="bg-white">
                          {response &&
                            response.dataPembayaran.map((row: any, i: any) => (
                              <Table.Tr key={i} className="">
                                <Table.Td className="border-r text-center">
                                  {i + 1}
                                </Table.Td>
                                <Table.Td className="border-r">
                                  {row.id_transaksi}
                                </Table.Td>
                                <Table.Td className="border-r">
                                  {row.nama}
                                </Table.Td>
                                <Table.Td className="border-r">
                                  <RupiahFormat amount={row.nominal} />
                                </Table.Td>
                                <Table.Td className="border-r">
                                  {row.tanggal_bayar}
                                </Table.Td>
                                <Table.Td className="border-r">
                                  {row.keterangan}
                                </Table.Td>
                                <Table.Td className="border-r ">
                                  <div className="flex justify-between">
                                    <PembayaranEdit
                                      data={row}
                                      getResponse={fetch}
                                    />
                                    <PembayaranDelete
                                      id_pembayaran={row.id_pembayaran}
                                      getResponse={fetch}
                                    />
                                  </div>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                        </Table.Tbody>
                      </Table>
                    </div>
                  </div>
                </Tab.Panel>
                <Tab.Panel
                  className={classNames("rounded-b-xl shadow-md bg-white p-3")}
                >
                  <div className="grid grid-cols-12 gap-4 ">
                    <div className="overflow-x-auto mt- col-span-12">
                      <Table className="shadow-md border-collapse border-black ">
                        <Table.Thead className="rounded-full ">
                          <Table.Tr className="rounded-full  bg-primary dark:bg-darkmode-800">
                            <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                              NO
                            </Table.Th>
                            <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                              KETERANGAN
                            </Table.Th>
                            <Table.Th className="text- border-r text-white border-b-0 whitespace-nowrap">
                              NOMINAL
                            </Table.Th>
                            <Table.Th className="text- border-b-0 border-r text-white ">
                              TANGGAL
                            </Table.Th>
                            <Table.Th className="text-center text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                              ACTIONS
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        {!isMutating &&
                          response &&
                          response.dataPemasukan.length === 0 && (
                            <Table.Tbody>
                              <Table.Tr>
                                <Table.Td
                                  colSpan={4}
                                  className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                                >
                                  No matching data found.
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          )}
                        <Table.Tbody>
                          {response &&
                            response.dataPemasukan.map(
                              (pembayaranItem: any, index: number) => {
                                return (
                                  <Table.Tr key={index}>
                                    <Table.Td className="text-center border-r">
                                      {index + 1}
                                    </Table.Td>
                                    <Table.Td className="border-r">
                                      {pembayaranItem.keterangan}
                                    </Table.Td>
                                    <Table.Td className="border-r">
                                      <RupiahFormat
                                        amount={pembayaranItem.nominal}
                                      />
                                    </Table.Td>
                                    <Table.Td className="border-r">
                                      {pembayaranItem.tanggal}
                                    </Table.Td>
                                    <Table.Td className="border-r text-center">
                                      <div className=" flex justify-center">
                                        <PengeluaranEdit
                                          getResponse={() => fetch()}
                                          data={pembayaranItem}
                                        />
                                        <PengeluaranDelete
                                          getResponse={() => fetch()}
                                          id_pengeluaran={
                                            pembayaranItem.id_pengeluaran
                                          }
                                        />
                                      </div>
                                    </Table.Td>
                                  </Table.Tr>
                                );
                              }
                            )}
                        </Table.Tbody>
                      </Table>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
