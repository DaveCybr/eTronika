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

interface Props {
  getResponse: () => void;
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

export default function AddDetail({ getResponse }: Props) {
  const { authToken } = useAuth();
  const { id } = useParams();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState("");
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

  const [selectedOption, setSelectedOption] = React.useState({
    value: null,
    label: "Pilih Barang",
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
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTransaksi = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/transaksi/detail`,
        {
          id_transaksi: id,
          keranjang: keranjang,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      showToast("#transaksiAdded");
      getResponse();
      setOpenAdd(false);
      setKeranjang([]);
      setIsMutating(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
      showToast("#stokKurang");
      setIsMutating(false);
    }
  };

  function HandleAddToKeranjang() {
    setKeranjang(
      keranjang.concat({
        id_product: formItems.id_product,
        nama_product: formItems.nama_product,
        harga: formItems.harga,
        hpp: formItems.hpp,
        qty: formItems.qty,
        total: formItems.qty * formItems.harga,
      })
    );
    setFormItems({
      id_product: null,
      nama_product: null,
      hpp: 0,
      harga: 0,
      qty: 0,
      total: 0,
    });
    setSelectedOption({
      value: null,
      label: "Pilih Barang",
    });
  }

  useEffect(() => {
    fetchProduk();
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
          setOpenAdd(false);
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
            <div className="col-span-12 grid grid-cols-4 gap-4">
              <div className="co-4">
                <FormLabel htmlFor="modal-form-1">Pilih Barang</FormLabel>
                <Select
                  className="shadow-md"
                  options={products.map((item: any) => ({
                    value: item,
                    label: item.nama,
                  }))}
                  onChange={(selectedOption: { value: any } | null) => {
                    setFormItems({
                      ...formItems,
                      id_product: selectedOption?.value.id_product,
                      nama_product: selectedOption?.value.nama,
                      harga: selectedOption?.value.harga,
                      hpp: selectedOption?.value.hpp,
                      qty: 1,
                      total: selectedOption?.value.harga * 1,
                    });
                    setSelectedOption({
                      value: selectedOption?.value,
                      label: selectedOption?.value.nama,
                    });
                  }}
                  value={selectedOption}
                />
              </div>
              <div className="3">
                <FormLabel htmlFor="pos-form-4" className="form-label">
                  Quantity
                </FormLabel>
                <div className="flex">
                  <Button
                    type="button"
                    className="w-12 mr-1 shadow-md border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500"
                    onClick={handleDecrement}
                  >
                    -
                  </Button>
                  <FormInput
                    id="pos-form-3"
                    type="text"
                    className="w-24 text-center shadow-md"
                    placeholder="Item quantity"
                    value={formItems?.qty}
                    onChange={(e: { target: { value: string } }) =>
                      setFormItems({
                        ...formItems!,
                        qty: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <Button
                    type="button"
                    className="w-12 ml-1 shadow-md border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500"
                    onClick={handleIncrement}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="3">
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
                    }).format(formItems?.qty! * formItems?.harga!)}
                    onChange={(e: any) => {
                      var total = formItems?.qty! * formItems?.harga!;
                      setFormItems({
                        ...formItems!,
                        total: total,
                      });
                    }}
                  />
                </div>
              </div>
              <div className=" mt-7">
                {formItems.id_product != null ? (
                  <Button
                    className="shadow-md"
                    onClick={() => HandleAddToKeranjang()}
                  >
                    Tambahkan
                  </Button>
                ) : (
                  <Button disabled className="shadow-md">
                    Tambahkan
                  </Button>
                )}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-12 mt-3 mb-3">
              <Table className="shadow-md border-collapse border-gray-200 -mt-2 rounded-lg">
                <Table.Thead className="rounded-full ">
                  <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                    <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                      NO
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      BARANG
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      HARGA
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      QTY
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      TOTAL
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
                        No matching data found.
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
                          {item.nama_product}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.harga)}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {item.qty}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.total)}
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Button
                            variant="danger"
                            onClick={() => {
                              setKeranjang(
                                keranjang.filter(
                                  (_: any, i: number) => i !== index
                                )
                              );
                            }}
                            className="w-20"
                          >
                            Hapus
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
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
    </>
  );
}
