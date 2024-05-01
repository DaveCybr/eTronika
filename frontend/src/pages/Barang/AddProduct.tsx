// src/components/ProductAdd.tsx
import React, { useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Dropify from "../../base-components/Dropify";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Select from "react-select";
import axios from "axios";
import showToast from "../../base-components/Toast";
import Api from "../../../api";
import LoadingIcon from "../../base-components/LoadingIcon";
import Toast from "../../base-components/Notif/Notification";
import { useAuth } from "../../auth/authContext";
import { options } from "dropzone";

interface ProductAddProps {
  getResponse: () => void;
  satuan: any[];
  kategori: any[];
}

export default function ProductAdd({
  getResponse,
  satuan,
  kategori,
}: ProductAddProps) {
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    nama: "",
    seri: "",
    harga: 0,
    hpp: 0,
    stok: 0,
    satuan: null,
    kategori: null,
    foto: null,
    deskripsi: "",
  });
  const [harga, setHarga] = React.useState<any>(0);
  const [hpp, setHpp] = React.useState<any>(0);
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(`${Api}/api/product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      getResponse();
      setOpenAdd(false);
      setIsMutating(false);
      setFormData({
        ...formData,
        nama: "",
        hpp: 0,
        seri: "",
        satuan: null,
        kategori: null,
        harga: 0,
        stok: 0,
        foto: null,
        deskripsi: "",
      });
      setHarga(0);
      setHpp(0);
      showToast("#productAdded");
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      nama: "",
      seri: "",
      hpp: 0,
      harga: 0,
      stok: 0,
      foto: null,
      satuan: null,
      kategori: null,
      deskripsi: "",
    });
    setHarga(0);
    setHpp(0);
  };

  const formatCurrency = (value: any) => {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value }: { name: string; value: string } = e.target;
    const strippedValue = value.replace(/[^\d]/g, "");
    const numericValue = formatCurrency(strippedValue);

    const formattedValue = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);

    setFormData({
      ...formData,
      [name]: numericValue,
    });

    if (name === "hpp") setHpp(formattedValue);
    if (name === "harga") setHarga(formattedValue);
  };

  const [Selectedoptions, setSelectedOptions] = React.useState({
    value: "",
    label: "Pilih Satuan",
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
        id="productAdded"
        title="Product Added"
        message="Product has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        Tambah PriceList
      </Button>
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          resetForm();
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Add New</h2>
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
              <FormLabel htmlFor="modal-form-5">Satuan</FormLabel>
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
                onChange={(selectedOption: any) => {
                  setSelectedOptions(selectedOption);
                  setFormData({
                    ...formData,
                    satuan: selectedOption ? selectedOption.value : null,
                  });
                }}
                value={Selectedoptions}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">Kategori</FormLabel>
              <Select
                options={[
                  { value: "Barang", label: "Barang" },
                  { value: "Jasa", label: "Jasa" },
                  { value: "Sparepart", label: "Sparepart" },
                ]}
                onChange={(selectedOption: { value: any } | null) =>
                  setFormData({
                    ...formData,
                    kategori: selectedOption ? selectedOption.value : null,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-5">Harga Beli</FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Price"
                value={hpp}
                onChange={handleInputChange}
                name="hpp"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">Harga</FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Price"
                value={harga}
                onChange={handleInputChange}
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
                setOpenAdd(false);
                resetForm();
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="primary" type="button" className="w-30" disabled>
                Sending
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
    </>
  );
}
