// src/components/transaksiAdd.tsx
import React, { useEffect } from "react";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { Dialog } from "../../../base-components/Headless";
import axios from "axios";
import showToast from "../../../base-components/Toast";
import Api from "../../../../api";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Toast from "../../../base-components/Notif/Notification";
import { useAuth } from "../../../auth/authContext";
import Tippy from "../../../base-components/Tippy";
import Lucide from "../../../base-components/Lucide";
import { useParams } from "react-router-dom";

interface Props {
  getResponse: () => void;
  data: any;
}

type FormItems = {
  id_transaksi: any;
  id_product: number | null;
  nama_product: string | null;
  harga: number;
  hpp: number;
  qty: number;
  total: number;
};

export default function EditDetail({ getResponse, data }: Props) {
  const { id } = useParams();
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isMutating, setIsMutating] = React.useState(false);
  const [harga, setHarga] = React.useState<any>(0);

  const [formItems, setFormItems] = React.useState<FormItems>({
    id_transaksi: id,
    id_product: data.id_product,
    nama_product: data.nama_product,
    hpp: data.hpp,
    harga: data.harga,
    qty: data.qty,
    total: data.subtotal,
  });

  const formatCurrency = (value: any) => {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleAddTransaksi = async () => {
    setIsMutating(true);
    console.log(formItems);
    try {
      const response = await axios.post(
        `${Api}/api/transaksi/detail/${data.id_detail_transaksi}/update`,
        formItems,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      showToast("#transaksiUpdated");
      getResponse();
      setIsMutating(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
      showToast("#stokKurang");
      setIsMutating(false);
    }
  };

  const resetForm = () => {
    setFormItems({
      id_transaksi: id,
      id_product: data.id_product,
      nama_product: data.nama_product,
      hpp: data.hpp,
      harga: data.harga,
      qty: data.qty,
      total: data.subtotal,
    });
    setHarga(0);
  };

  return (
    <>
      <Toast id="stokKurang" title="Failed" message={error} type="error" />
      <Toast
        id="transaksiUpdated"
        title="Data Updated"
        message="Data has been Updated successfully"
        type="success"
      />
      <Tippy
        className="shadow-md "
        as={Button}
        variant="outline-warning"
        content="Edit"
        size="sm"
        onClick={() => {
          setOpenAdd(true);
        }}
      >
        <Lucide icon="Edit" className="w-4 h-4 text-warning" />
      </Tippy>
      <Dialog
        open={openAdd}
        size="lg"
        onClose={() => {
          setOpenAdd(false);
          resetForm();
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              EDIT DETAIL TRANSAKSI
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12">
              <FormLabel>Barang</FormLabel>
              <FormInput
                type="text"
                placeholder="Nama Product"
                value={data.nama_product}
                readOnly
              />
            </div>
            <div className="col-span-12">
              <FormLabel>Harga Beli</FormLabel>
              <FormInput
                type="text"
                placeholder="Nama Pelanggan"
                value={new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(data.hpp)}
                readOnly
              />
            </div>
            <div className="col-span-6">
              <FormLabel>Harga Jual</FormLabel>
              <FormInput
                type="text"
                placeholder="Total Pembelian"
                name="harga"
                value={
                  harga !== 0
                    ? harga
                    : new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(data.harga))
                }
                onChange={(e) => {
                  const numericValue = formatCurrency(e.target.value);
                  setFormItems({ ...formItems, harga: numericValue });
                  setHarga(
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(numericValue)
                  );
                }}
              />
            </div>
            <div className="col-span-2">
              <FormLabel htmlFor="pos-form-4" className="form-label">
                Quantity
              </FormLabel>
              <div className="flex">
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
                  readOnly
                />
                <Button
                  variant="primary"
                  className=" ml-4 w-full shadow-md"
                  onClick={() => {
                    let qty = formItems.qty;
                    let harga = formItems.harga;
                    let total = qty * harga;
                    setFormItems({
                      ...formItems,
                      total: total,
                    });
                  }}
                >
                  Hitung
                </Button>
              </div>
            </div>
            <div className="col-span-12">
              <FormLabel>Total</FormLabel>
              <FormInput
                type="text"
                placeholder="Total"
                name="total"
                value={new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(formItems.total)}
                readOnly
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setOpenAdd(false);
                  resetForm();
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
                  Saving
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
