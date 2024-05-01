// src/components/SupplierAdd.tsx
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

interface AsetAddProps {
  getResponse: () => void;
}

type Aset = {
  id_aset: number;
  nama_aset: string;
  nilai_aset: string;
  jumlah: string;
};

export default function AsetAdd({ getResponse }: AsetAddProps) {
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [formData, setFormData] = React.useState<Aset>({
    id_aset: 0,
    nama_aset: "",
    nilai_aset: "",
    jumlah: "",
  });
  const [harga, setHarga] = React.useState<any>(0);
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);

    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(`${Api}/api/aset`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        getResponse();
        setOpenAdd(false);
        setIsMutating(false);
        resetForm();
        setHarga(0);
        showToast("#AsetAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_aset: 0,
      nama_aset: "",

      nilai_aset: "",
      jumlah: "",
    });
    setHarga(0);
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

    setHarga(formattedValue);
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
        id="AsetAdded"
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
        Add New Aset
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
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Nama</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Aset Name"
                value={formData.nama_aset ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_aset: e.target.value,
                  });
                }}
                name="nama_aset"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nilai Aset</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Nilai Aset"
                value={harga}
                onChange={handleInputChange}
                name="nilai_aset"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-4">Jumlah</FormLabel>
              <FormInput
                id="modal-form-1"
                type="number"
                placeholder="Jumlah"
                value={formData.jumlah ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    jumlah: e.target.value,
                  });
                }}
                name="jumlah"
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
    </>
  );
}
