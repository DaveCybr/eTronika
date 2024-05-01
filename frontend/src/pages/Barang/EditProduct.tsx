// src/components/ProductAdd.tsx
import React from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Dropify from "../../base-components/Dropify";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import Select from "react-select";
import axios from "axios";
import Api from "../../../api";
import showToast from "../../base-components/Toast";
import Toast from "../../base-components/Notif/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useAuth } from "../../auth/authContext";
import Tippy from "../../base-components/Tippy";

interface ProductEditProps {
  product: any;
  getProducts: () => void;
  satuan: any[];
  kategori: any[];
}

export default function ProductEdit({
  product,
  getProducts,
  kategori,
  satuan,
}: ProductEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [harga, setHarga] = React.useState<any>(0);
  const [hpp, setHpp] = React.useState<any>(0);
  const [isMutating, setIsMutating] = React.useState(false);
  const [selectedSatuan, setSelectedSatuan] = React.useState<any>({
    value: product.satuan,
    label: product.satuan,
  });
  const [selectedKategori, setSelectedKategori] = React.useState<any>({
    value: product.kategori,
    label: product.kategori,
  });

  const [formData, setFormData] = React.useState<any>({
    id_product: product.id_product,
    nama: product.nama,
    seri: product.seri,
    harga: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(product.harga)),
    hpp: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(product.hpp)),
    satuan: product.satuan,
    kategori: product.kategori,
    stok: product.stok,
    deskripsi: product.deskripsi,
    foto: null,
  });

  const handleUpdate = async (id: number) => {
    console.log(formData);
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/product/${id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      getProducts();
      setOpenEdit(false);
      showToast("#productUpdated");
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const formatCurrency = (value: any) => {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      id_product: product.id_product,
      nama: product.nama,
      seri: product.seri,
      satuan: product.satuan,
      kategori: product.kategori,
      harga: product.harga,
      hpp: product.hpp,
      stok: product.stok,
      foto: null,
      deskripsi: product.deskripsi,
    });
    setHarga(0);
    setHpp(0);
  };

  return (
    <>
      <Toast
        id="productUpdated"
        title="Success"
        message="Product has been updated"
        type="success"
      />
      <Tippy
        className="shadow-md mr-1"
        as={Button}
        variant="outline-warning"
        content="Edit"
        size="sm"
        onClick={() => {
          setOpenEdit(true);
          resetForm();
        }}
      >
        <Lucide icon="Edit" className="w-4 h-4 text-warning" />
      </Tippy>
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Update</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Product Name"
                value={formData.nama ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama: e.target.value,
                  });
                }}
                name="nama"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Seri/Tipe</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                placeholder="Seri/Tipe"
                value={formData?.seri ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, seri: e.target.value })
                }
                name="seri"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-3">Satuan</FormLabel>
              <Select
                options={[
                  { value: "PCS", label: "PCS" },
                  { value: "ROLL", label: "ROLL" },
                  { value: "METER", label: "METER" },
                  { value: "LITER", label: "LITER" },
                  { value: "BOX", label: "BOX" },
                  { value: "UNIT", label: "UNIT" },
                  { value: "SET", label: "SET" },
                  { value: "PAK", label: "PAK" },
                  { value: "DUS", label: "DUS" },
                  { value: "BIJI", label: "BIJI" },
                  { value: "KOTAK", label: "KOTAK" },
                  { value: "BOTOL", label: "BOTOL" },
                  { value: "GALON", label: "GALON" },
                  { value: "DRUM", label: "DRUM" },
                  { value: "TUBE", label: "TUBE" },
                  { value: "BAG", label: "BAG" },
                  { value: "BTL", label: "BTL" },
                ]}
                onChange={(selectedOption: { value: any } | null) => {
                  setSelectedSatuan(selectedOption);
                  setFormData({
                    ...formData,
                    satuan: selectedOption ? selectedOption.value : null,
                  });
                }}
                value={selectedSatuan}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-3">Kategori</FormLabel>
              <Select
                options={[
                  { value: "Barang", label: "Barang" },
                  { value: "Jasa", label: "Jasa" },
                  { value: "Sparepart", label: "Sparepart" },
                ]}
                onChange={(selectedOption: { value: any } | null) => {
                  setSelectedKategori(selectedOption);
                  setFormData({
                    ...formData,
                    kategori: selectedOption ? selectedOption.value : null,
                  });
                }}
                value={selectedKategori}
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-5">Harga Beli</FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Price"
                value={
                  hpp !== 0
                    ? hpp
                    : new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(product.hpp))
                }
                onChange={(e) => {
                  const numericValue = formatCurrency(e.target.value);
                  setFormData({ ...formData, hpp: numericValue });
                  setHpp(
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(numericValue)
                  );
                }}
                name="hpp"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">Harga</FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Price"
                value={
                  harga !== 0
                    ? harga
                    : new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(product.harga))
                }
                onChange={(e) => {
                  const numericValue = formatCurrency(e.target.value);
                  setFormData({ ...formData, harga: numericValue });
                  setHarga(
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(numericValue)
                  );
                }}
                name="harga"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-6">Stok</FormLabel>
              <FormInput
                id="modal-form-6"
                type="text"
                placeholder="0"
                value={formData?.stok ?? ""}
                onChange={(e) => {
                  const numericValue = formatCurrency(e.target.value);
                  setFormData({ ...formData, stok: numericValue });
                }}
                name="stok"
              />
            </div>
            <div className="col-span-12">
              <FormLabel htmlFor="modal-form-4">
                Foto <br />
              </FormLabel>
              <Dropify
                onFileChange={(file) => {
                  setFormData({
                    ...formData,
                    foto: file,
                  });
                }}
              />
              <span className="text-red-400 font-bold">
                *abaikan jika tidak ada perubahan
              </span>
            </div>
            <div className="col-span-12">
              <FormLabel htmlFor="modal-form-5">Keterangan</FormLabel>
              <FormTextarea
                id="modal-form-5"
                rows={3}
                placeholder="Keterangan"
                value={formData?.deskripsi ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                name="deskripsi"
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenEdit(false);
                resetForm();
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="primary" className="mb-2 mr-1">
                Saving
                <LoadingIcon
                  icon="oval"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              </Button>
            ) : (
              <Button
                variant="primary"
                type="button"
                onClick={() => handleUpdate(formData.id_product)}
                className="w-20"
              >
                Save
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
