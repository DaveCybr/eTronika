// src/components/SupplierAdd.tsx
import React, { useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Select from "react-select";
import axios from "axios";
import showToast from "../../base-components/Toast";
import Api from "../../../api";
import LoadingIcon from "../../base-components/LoadingIcon";
import Toast from "../../base-components/Notif/Notification";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";

interface Props {
  getResponse: () => void;
  member: Member[];
  jasa: any[];
  karyawan: any[];
}

type Member = {
  id_member: number;
  nama_member: string;
};

export default function AddForm({ getResponse, jasa, karyawan }: Props) {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openAddJS, setOpenAddJS] = React.useState(false);
  const [idUnit, setIdUnit] = React.useState<any>(null);
  const [formServis, setFormServis] = React.useState({
    // id_servis: null,
    // id_member: null,
    nama_member: "",
    nomor_telepon: "",
    alamat: "",
    // deskripsi_servis: "",
    tanggal_waktu: "",
    // status_servis: "",
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormServis((prevFormServis) => ({
      ...prevFormServis,
      [name]: value,
    }));
  };

  function generateSrvId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 6;
    let invoiceId = "SRV";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      invoiceId += characters[randomIndex];
    }

    invoiceId += "." + new Date().getFullYear();

    return invoiceId;
  }

  let srvId = generateSrvId();

  const handleAdd = async () => {
    setIsMutating(true);
    console.log(formServis);
    if (Object.values(formServis).some((value) => value === "")) {
      // showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const responseServis = await axios.post(`${Api}/api/servis`, {
          id_servis: srvId,
          servis: formServis,
          keranjang: keranjang,
          keranjangJS: keranjangJS,
        });
        getResponse();
        console.log(responseServis);
        // setOpenAdd(false);
        setIsMutating(false);
        resetForm();
        showToast("#UnitAdded");
      } catch (error) {
        setIsMutating(false);
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormServis({
      // id_servis: null,
      // id_member: null,
      nama_member: "",
      // deskripsi_servis: "",
      tanggal_waktu: "",
      nomor_telepon: "",
      alamat: "",
    });
  };

  const [formItems, setFormItems] = React.useState({
    id_detail_servis: null,
    id_karyawan: null,
    nama_karyawan: "",
    nama_unit: "",
  });
  const [keranjang, setKeranjang] = React.useState<any>([]);

  const [formItemsJS, setFormItemsJS] = React.useState({
    id_detail_servis: null,
    id_product: null,
    nama: "",
    qty: 1,
    harga: 0,
    nama_kategori: "",
    total: 0,
  });
  const [keranjangJS, setKeranjangJS] = React.useState<any>([]);

  const [selectedOption, setSelectedOption] = React.useState({
    value: null,
    label: "Pilih Teknisi",
  });
  const [selectedOptionJs, setSelectedOptionJs] = React.useState({
    value: null,
    label: "Pilih Jasa/Sparepart",
  });

  return (
    <>
      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Please fill all required fields."
        type="error"
      />
      <Toast
        id="UnitAdded"
        title="Servis Added"
        message="Servis has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        Servis Baru
      </Button>
      <Dialog
        open={openAdd}
        onClose={() => {
          if (openAddJS == false) {
            setOpenAdd(false);
            resetForm();
          }
        }}
        className="w-96"
        size="xl"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Servis Form</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama Unit</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Nama Unit"
                className="shadow-md"
                name="nama_unit"
                onChange={(e) =>
                  setFormItems({ ...formItems, nama_unit: e.target.value })
                }
                value={formItems.nama_unit}
              />
            </div>
            <div className="col-span-4">
              <FormLabel htmlFor="modal-form-1">Pilih Teknisi</FormLabel>
              <Select
                className="shadow-md"
                options={karyawan.map((item: any) => ({
                  value: item.id_karyawan,
                  label: item.nama_karyawan,
                }))}
                onChange={(
                  selectedOption: { value: any; label: any } | null
                ) => {
                  setSelectedOption({
                    value: selectedOption?.value,
                    label: selectedOption?.label,
                  });
                  setFormItems((prevFormItems) => ({
                    ...prevFormItems,
                    id_karyawan: selectedOption?.value,
                    nama_karyawan: selectedOption?.label,
                  }));
                }}
                value={selectedOption}
              />
            </div>
            <div className="col-span-2 flex flex-col justify-end">
              {formItems.id_karyawan != null && formItems.nama_unit != "" ? (
                <Button
                  className="shadow-md"
                  onClick={() => {
                    setKeranjang(
                      keranjang.concat({
                        id_detail_servis: srvId,
                        id_karyawan: formItems.id_karyawan,
                        nama_karyawan: formItems.nama_karyawan,
                        nama_unit: formItems.nama_unit,
                      })
                    );
                    setFormItems({
                      id_detail_servis: null,
                      id_karyawan: null,
                      nama_karyawan: "",
                      nama_unit: "",
                    });
                    setSelectedOption({
                      value: null,
                      label: "Pilih Teknisi",
                    });
                  }}
                  variant="primary"
                >
                  Tambahkan
                </Button>
              ) : (
                <Button disabled className="shadow-md" variant="primary">
                  Tambahkan
                </Button>
              )}
            </div>
            <div className="col-span-12 sm:col-span-12 mt-3">
              <Table className="shadow-md border-collapse border-gray-200 -mt-2 rounded-lg">
                <Table.Thead className="rounded-full ">
                  <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                    <Table.Th className="border-b-0 border-r w-10 text-white text-center first:rounded-tl-md">
                      NO
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      NAMA UNIT
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      NAMA TEKNISI
                    </Table.Th>
                    <Table.Th className="text-center w-[10%] text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                      ACTIONS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {keranjang.length === 0 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td
                        colSpan={6}
                        className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                      >
                        No matching Servis found.
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                <Table.Tbody>
                  {keranjang.map((item: any, index: number) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td className="text-center ">
                          {index + 1}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {item.nama_unit}
                        </Table.Td>
                        <Table.Td className=" border border-t-0">
                          {item.nama_karyawan}
                        </Table.Td>
                        <Table.Td className="text-center flex justify-center">
                          {openAddJS == false && (
                            <Tippy
                              content="Tambahkan Barang/Jasa"
                              as={Button}
                              variant="primary"
                              onClick={() => {
                                setOpenAddJS(true);
                                setIdUnit(item.id_detail_servis);
                                let filter = keranjangJS.filter(
                                  (item: any) =>
                                    item.id_detail_servis === idUnit
                                );
                                console.log(filter);
                              }}
                              size="sm"
                              className=" shadow-md"
                            >
                              <Lucide
                                icon="ShoppingCart"
                                className="w-4 h-4 mr-1"
                              />
                            </Tippy>
                          )}
                          <Tippy
                            content="Hapus"
                            as={Button}
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setKeranjang(
                                keranjang.filter(
                                  (_: any, i: number) => i !== index
                                )
                              );
                            }}
                            className="mx-2"
                          >
                            <Lucide icon="Trash" className="w-4 h-4" />
                          </Tippy>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
            <div className="col-span-12 sm:col-span-6 mt-3">
              <FormLabel htmlFor="modal-form-1">Nama Pelanggan</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Nama Pelanggan"
                name="nama_member"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 mt-3">
              <FormLabel htmlFor="modal-form-2">Nomor Telepon</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                placeholder="Nomor Telepon"
                name="nomor_telepon"
                onChange={handleChange}
              />
            </div>
            <div className="col-span-12 sm:col-span-12 mt-3">
              <FormLabel htmlFor="modal-form-3">Alamat</FormLabel>
              <FormTextarea
                id="modal-form-3"
                placeholder="Alamat"
                rows={4}
                onChange={handleChange}
                name="alamat"
              />
            </div>
            <div className="col-span-12 sm:col-span-12 mt-3">
              <FormLabel htmlFor="modal-form-1">Tanggal Servis</FormLabel>
              <FormInput
                id="modal-form-1"
                type="date"
                value={formServis.tanggal_waktu}
                onChange={(e) => handleChange(e)}
                name="tanggal_waktu"
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="primary" type="button" className="w-20" disabled>
                Adding
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              </Button>
            ) : (
              <Button
                variant="primary"
                type="button"
                onClick={() => handleAdd()}
                className="w-20"
              >
                Send
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Please fill all required fields."
        type="error"
      />
      <Toast
        id="UnitAdded"
        title="Servis Added"
        message="Servis has been added successfully"
        type="success"
      />
      <Dialog
        open={openAddJS}
        onClose={() => {
          setOpenAddJS(false);
          // resetForm();
        }}
        className="w-96"
        size="xl"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              Form Beli Sparepart / Jasa
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-6">
              <FormLabel htmlFor="modal-form-2">Pilih Sparepart/Jasa</FormLabel>
              <Select
                className="shadow-md"
                options={jasa.map((item: any) => ({
                  value: item,
                  label: item.nama + " - " + item.nama_kategori,
                }))}
                onChange={(selectedOptionJs: { value: any } | null) => {
                  setFormItemsJS({
                    ...formItemsJS,
                    id_product: selectedOptionJs?.value.id_product,
                    nama: selectedOptionJs?.value.nama,
                    nama_kategori: selectedOptionJs?.value.nama_kategori,
                    harga: selectedOptionJs?.value.harga,
                    total: selectedOptionJs?.value.harga * 1,
                  });
                  setSelectedOptionJs({
                    value: selectedOptionJs?.value,
                    label: selectedOptionJs?.value.nama,
                  });
                }}
                value={selectedOptionJs}
              />
            </div>
            {formItemsJS.nama_kategori == "sparepart" && (
              <div className="col-span-1">
                <FormLabel htmlFor="modal-form-1">Qty</FormLabel>
                <FormInput
                  id="modal-form-1"
                  type="text"
                  placeholder="Qty"
                  className="shadow-md"
                  name="qty"
                  onChange={(e: any) => {
                    setFormItemsJS({
                      ...formItemsJS!,
                      qty: parseInt(e.target.value) || 0,
                      total:
                        formItemsJS?.harga! * (parseInt(e.target.value) || 0),
                    });
                  }}
                  value={formItemsJS.qty}
                />
              </div>
            )}
            <div className="col-span-3">
              <FormLabel htmlFor="pos-form-4" className="form-label">
                SubTotal
              </FormLabel>
              <div className="flex flex-1">
                <FormInput
                  id="pos-form-4"
                  type="text"
                  readOnly
                  className="w-full shadow-md"
                  placeholder="Item quantity"
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(formItemsJS?.total!)}
                  onChange={(e) => {
                    var total = formItemsJS?.total!;
                    setFormItemsJS({
                      ...formItemsJS!,
                      total: total,
                    });
                    console.log(total);
                  }}
                />
              </div>
            </div>
            <div className="col-span-2 flex flex-col justify-end">
              {formItemsJS.id_product != null ? (
                <Button
                  className="shadow-md"
                  onClick={() => {
                    setKeranjangJS(
                      keranjangJS.concat({
                        id_detail_servis: idUnit,
                        id_product: formItemsJS.id_product,
                        nama_kategori: formItemsJS.nama_kategori,
                        nama: formItemsJS.nama,
                        harga: formItemsJS.harga,
                        total: formItemsJS.total,
                        qty: formItemsJS.qty,
                      })
                    );
                    setFormItemsJS({
                      id_detail_servis: null,
                      id_product: null,
                      nama: "",
                      nama_kategori: "",
                      qty: 1,
                      harga: 0,
                      total: 0,
                    });
                    setSelectedOptionJs({
                      value: null,
                      label: "Pilih Jasa/Sparepart",
                    });
                  }}
                  variant="primary"
                >
                  Tambahkan
                </Button>
              ) : (
                <Button disabled variant="primary" className="shadow-md">
                  Tambahkan
                </Button>
              )}
            </div>
            <div className="col-span-12 sm:col-span-12 mt-3">
              <Table className="shadow-md border-collapse border-gray-200 -mt-2 rounded-lg">
                <Table.Thead className="rounded-full ">
                  <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                    {/* <Table.Th className="border-b-0 border-r w-10 text-white text-center first:rounded-tl-md">
                      ID UNIT
                    </Table.Th> */}
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap first:rounded-tl-md">
                      BARANG/JASA
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      Qty
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      SUBTOTAL
                    </Table.Th>
                    <Table.Th className="text-center w-[10%] text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                      ACTIONS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {keranjangJS.filter(
                  (item: any) => item.id_detail_servis === idUnit
                ).length === 0 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td
                        colSpan={6}
                        className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                      >
                        No matching Servis found.
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                <Table.Tbody>
                  {keranjangJS
                    .filter((item: any) => item.id_detail_servis === idUnit)
                    .map((item: any, index: number) => {
                      return (
                        <Table.Tr key={index}>
                          {/* <Table.Td className="text-center ">
                            {item.id_unit}
                          </Table.Td> */}
                          <Table.Td className="border border-t-0">
                            {item.nama}
                          </Table.Td>
                          <Table.Td className=" border border-t-0">
                            {item.qty}
                          </Table.Td>
                          <Table.Td className=" border border-t-0">
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(item.total)}
                          </Table.Td>
                          <Table.Td className="text-center flex justify-center">
                            <Tippy
                              content="Hapus"
                              as={Button}
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setKeranjangJS((prevKeranjangJS: any[]) =>
                                  prevKeranjangJS.filter(
                                    (item: any, i: number) =>
                                      item.id_unit !== idUnit || i !== index
                                  )
                                );
                              }}
                              className="mx-2"
                            >
                              Hapus
                            </Tippy>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                </Table.Tbody>
              </Table>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setKeranjangJS((prevKeranjangJS: any[]) =>
                  prevKeranjangJS.filter((item: any) => item.id_unit !== idUnit)
                );
              }}
              className="text-danger shadow-md mr-2"
            >
              HAPUS SEMUA
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              className="shadow-md text-success"
              onClick={() => setOpenAddJS(false)}
            >
              SIMPAN
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
