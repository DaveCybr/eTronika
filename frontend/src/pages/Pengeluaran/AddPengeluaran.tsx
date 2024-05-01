// src/components/PengeluaranAdd.tsx
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
import { set } from "lodash";

interface PengeluaranAddProps {
  getResponse: () => void;
}

export default function PengeluaranAdd({ getResponse }: PengeluaranAddProps) {
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    keterangan: "",
    nominal: 0,
    tanggal: "",
    jenis_pengeluaran: "",
  });
  const [nominal, setNominal] = React.useState<any>("Rp 0");
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(`${Api}/api/pengeluaran`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      getResponse();
      setOpenAdd(false);
      setIsMutating(false);
      resetForm();
      showToast("#PengeluaranAdded");
    } catch (error) {
      setIsMutating(false);
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      keterangan: "",
      nominal: 0,
      tanggal: "",
      jenis_pengeluaran: "",
    });
    setNominal(0);
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

    if (name === "nominal") setNominal(formattedValue);
  };

  return (
    <>
      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Please fill all required fields."
        type="error"
      />
      <Toast
        id="PengeluaranAdded"
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
        Tambah
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
            <h2 className="mr-auto text-base font-medium">FORM</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Keterangan</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Keterangan"
                value={formData.keterangan ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    keterangan: e.target.value,
                  });
                }}
                name="keterangan"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Jenis</FormLabel>
              <Select
                options={[
                  { value: "Pengeluaran", label: "Pengeluaran" },
                  { value: "Pemasukan", label: "Pemasukan" },
                ]}
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    jenis_pengeluaran: e.value,
                  });
                }}
              />
            </div>
            <div className="col-span-6 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">Tanggal</FormLabel>
              <FormInput
                id="modal-form-5"
                type="date"
                placeholder="Price"
                value={formData.tanggal ?? ""}
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    tanggal: e.target.value,
                  });
                }}
                name="tanggal"
              />
            </div>
            <div className="col-span-6 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">Nominal</FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Price"
                value={nominal}
                onChange={handleInputChange}
                name="nominal"
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
