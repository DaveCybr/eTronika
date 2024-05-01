// src/components/transaksiAdd.tsx
import React, { useEffect } from "react";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import Dropify from "../../../base-components/Dropify";
import Button from "../../../base-components/Button";
import { Dialog } from "../../../base-components/Headless";
import Select from "react-select";
import axios from "axios";
import showToast from "../../../base-components/Toast";
import Api from "../../../../api";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Toast from "../../../base-components/Notif/Notification";
import { useAuth } from "../../../auth/authContext";
import Table from "../../../base-components/Table";
import { useParams } from "react-router-dom";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";

interface Props {
  getResponse: () => void;
  data: any;
}

type Transaksi = {
  nomor_telepon: string;
  nama_pelanggan: string;
  total_pembelian: number;
  total_pembayaran: number;
  status_transaksi: string;
  alamat: string;
  catatan: string;
};

type Product = {
  id_product: number;
  nama_product: string;
  harga: number;
  stok: number;
};

type FormItems = {
  id_product: number | null;
  nama_product: string | null;
  harga: number;
  hpp: number;
  qty: number;
  total: number;
};

export default function AddDetail({ data, getResponse }: Props) {
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openAddJS, setOpenAddJS] = React.useState(false);
  const [idUnit, setIdUnit] = React.useState<any>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState("");
  const [karyawan, setKaryawan] = React.useState<any>([]);
  const [jasa, setJasa] = React.useState<any>([]);
  console.log(data.nama_pelanggan);
  const [formData, setFormData] = React.useState<Transaksi>({
    nama_pelanggan: data.nama_pelanggan,
    nomor_telepon: data.nomor_telepon,
    alamat: data.alamat,
    total_pembelian: 0,
    total_pembayaran: 0,
    status_transaksi: "",
    catatan: "",
  });
  const [isMutating, setIsMutating] = React.useState(false);
  const [formItems, setFormItems] = React.useState<FormItems>({
    id_product: null,
    nama_product: null,
    hpp: 0,
    harga: 0,
    qty: 0,
    total: 0,
  });
  const [keranjang, setKeranjang] = React.useState<any>([]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [selectedOption, setSelectedOption] = React.useState({
    value: null,
    label: "Pilih Barang",
  });
  const [selectedOptionTeknisi, setSelectedOptionTeknisi] = React.useState({
    value: null,
    label: "Pilih Teknisi",
  });
  const [selectedOptionJS, setSelectedOptionJS] = React.useState({
    value: null,
    label: "Pilih Jasa/Sparepart",
  });

  const handleIncrement = () => {
    setFormItems((prevFormData) => ({
      ...prevFormData,
      qty: (prevFormData.qty || 0) + 1,
    }));
  };

  const handleDecrement = () => {
    setFormItems((prevFormData) => ({
      ...prevFormData,
      qty: Math.max((prevFormData.qty || 0) - 1, 0),
    }));
  };

  const fetchProduk = async () => {
    try {
      const response = await axios.get(`${Api}/api/ready-barang`);
      setJasa(response.data.data);
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getKaryawan = async () => {
    try {
      const response = await axios.get(`${Api}/api/karyawan`);
      setKaryawan(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function generateInvoiceId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const length = 6;
    let invoiceId = "INV";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      invoiceId += characters[randomIndex];
    }

    invoiceId += "." + new Date().getFullYear();

    return invoiceId;
  }

  const invoiceId = generateInvoiceId();
  const handleAddTransaksi = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/servis/detail-servis/addDetailTransaksiServis`,
        {
          nama_pelanggan: data.nama_pelanggan,
          nomor_telepon: data.nomor_telepon,
          alamat: data.alamat,
          id_transaksi: data.id_transaksi,
          id_servis: srvId,
          // tanggal_transaksi: formattedDate,
          keranjang_unit: keranjangUnit,
          keranjang_js: keranjangJS,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      showToast("#transaksiAdded");
      getResponse();
      resetForm();
      setOpenAdd(false);
      setIsMutating(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
      showToast("#stokKurang");
      setIsMutating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_pelanggan: "",
      nomor_telepon: "",
      alamat: "",
      total_pembelian: 0,
      total_pembayaran: 0,
      status_transaksi: "",
      catatan: "",
    });
    setFormItems({
      id_product: null,
      nama_product: null,
      hpp: 0,
      harga: 0,
      qty: 0,
      total: 0,
    });
    setFormItemsJS({
      id_detail_servis: null,
      id_product: null,
      nama_product: "",
      qty: 1,
      harga: 0,
      kategori: "",
      total: 0,
    });
    setFormItemsUnit({
      id_detail_servis: null,
      id_karyawan: null,
      nama_karyawan: "",
      nama_unit: "",
      deskripsi_servis: "",
    });
    setKeranjang([]);
    setKeranjangUnit([]);
    setKeranjangJS([]);
  };
  const [formItemsUnit, setFormItemsUnit] = React.useState({
    id_detail_servis: null,
    id_karyawan: null,
    nama_karyawan: "",
    nama_unit: "",
    deskripsi_servis: "",
  });
  const [keranjangUnit, setKeranjangUnit] = React.useState<any>([]);

  const [formItemsJS, setFormItemsJS] = React.useState({
    id_detail_servis: null,
    id_product: null,
    nama_product: "",
    qty: 1,
    harga: 0,
    kategori: "",
    total: 0,
  });

  const [keranjangJS, setKeranjangJS] = React.useState<any>([]);

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

  useEffect(() => {
    fetchProduk();
    getKaryawan();
  }, []);
  return (
    <>
      <Toast id="stokKurang" title="Failed" message={error} type="error" />
      <Toast
        id="transaksiAdded"
        title="Data Added"
        message="Data has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        TAMBAH
      </Button>
      <Dialog
        open={openAdd}
        size="xl"
        onClose={() => {
          if (openAddJS == false) {
            setOpenAdd(false);
          }
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              INPUT DETAIL TRANSAKSI
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="border rounded-md p-5 col-span-12">
              <h2 className="text-lg font-medium">SERVIS</h2>
              <hr />
              <div className="col-span-12 mt-3 mb-3 grid gap-2">
                <div className="col-span-4">
                  <FormLabel htmlFor="modal-form-1">Nama Unit</FormLabel>
                  <FormInput
                    id="modal-form-1"
                    type="text"
                    placeholder="Nama Unit"
                    className="shadow-md"
                    name="nama_unit"
                    onChange={(e) =>
                      setFormItemsUnit({
                        ...formItemsUnit,
                        nama_unit: e.target.value,
                      })
                    }
                    value={formItemsUnit.nama_unit}
                  />
                </div>
                <div className="col-span-4">
                  <FormLabel htmlFor="modal-form-1">Keluhan</FormLabel>
                  <FormInput
                    id="modal-form-1"
                    type="text"
                    placeholder="Keluhan, Keterangan Kerusakan"
                    className="shadow-md"
                    name="deskripsi_servis"
                    onChange={(e) =>
                      setFormItemsUnit({
                        ...formItemsUnit,
                        deskripsi_servis: e.target.value,
                      })
                    }
                    value={formItemsUnit.deskripsi_servis}
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
                      setSelectedOptionTeknisi({
                        value: selectedOption?.value,
                        label: selectedOption?.label,
                      });
                      setFormItemsUnit((prevFormItemsUnit) => ({
                        ...prevFormItemsUnit,
                        id_karyawan: selectedOption?.value,
                        nama_karyawan: selectedOption?.label,
                      }));
                    }}
                    value={selectedOptionTeknisi}
                  />
                </div>
                <div className="col-span-1 mt-2 flex flex-col justify-end">
                  {formItemsUnit.id_karyawan != null &&
                  formItemsUnit.nama_unit != "" &&
                  formItemsUnit.deskripsi_servis != "" ? (
                    <Button
                      className="shadow-md"
                      onClick={() => {
                        setKeranjangUnit(
                          keranjangUnit.concat({
                            id_detail_servis: srvId,
                            id_karyawan: formItemsUnit.id_karyawan,
                            nama_karyawan: formItemsUnit.nama_karyawan,
                            nama_unit: formItemsUnit.nama_unit,
                            deskripsi_servis: formItemsUnit.deskripsi_servis,
                          })
                        );
                        setFormItemsUnit({
                          id_detail_servis: null,
                          deskripsi_servis: "",
                          id_karyawan: null,
                          nama_karyawan: "",
                          nama_unit: "",
                        });
                        setSelectedOptionTeknisi({
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
                          KELUHAN
                        </Table.Th>
                        <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                          NAMA TEKNISI
                        </Table.Th>
                        <Table.Th className="text-center w-[10%] text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                          ACTIONS
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    {keranjangUnit.length === 0 && (
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
                      {keranjangUnit
                        .sort(
                          (a: any, b: any) =>
                            keranjangUnit.indexOf(b) - keranjangUnit.indexOf(a)
                        )
                        .map((item: any, index: number) => {
                          return (
                            <Table.Tr key={index}>
                              <Table.Td className="text-center ">
                                {index + 1}
                              </Table.Td>
                              <Table.Td className="border border-t-0">
                                {item.nama_unit}
                              </Table.Td>
                              <Table.Td className="border border-t-0">
                                {item.deskripsi_servis}
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
                                    setKeranjangUnit(
                                      keranjangUnit.filter(
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
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setOpenAdd(false);
                }}
              >
                Cancel
              </Button>
              {isMutating ? (
                <Button
                  variant="primary"
                  type="button"
                  className="w-30"
                  disabled
                >
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
                  onClick={() => {
                    handleAddTransaksi();
                  }}
                >
                  Simpan
                </Button>
              )}
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      <Dialog
        open={openAddJS}
        onClose={() => {
          setOpenAddJS(false);
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
                  label: item.nama + " - " + item.kategori,
                }))}
                onChange={(selectedOptionJs: { value: any } | null) => {
                  setFormItemsJS({
                    ...formItemsJS,
                    id_product: selectedOptionJs?.value.id_product,
                    nama_product: selectedOptionJs?.value.nama,
                    kategori: selectedOptionJs?.value.kategori || "",
                    harga: selectedOptionJs?.value.harga,
                    total: selectedOptionJs?.value.harga * 1,
                  });
                  setSelectedOptionJS({
                    value: selectedOptionJs?.value,
                    label: selectedOptionJs?.value.nama,
                  });
                }}
                value={selectedOptionJS}
              />
            </div>
            {formItemsJS.kategori == "Sparepart" && (
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
                        kategori: formItemsJS.kategori,
                        nama_product: formItemsJS.nama_product,
                        harga: formItemsJS.harga,
                        total: formItemsJS.total,
                        qty: formItemsJS.qty,
                      })
                    );
                    setFormItemsJS({
                      id_detail_servis: null,
                      id_product: null,
                      nama_product: "",
                      kategori: "",
                      qty: 1,
                      harga: 0,
                      total: 0,
                    });
                    setSelectedOptionJS({
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
                            {item.nama_product}
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
