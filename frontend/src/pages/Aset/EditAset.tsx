// src/components/SupplierEdit.tsx
import React, { useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";
import showToast from "../../base-components/Toast";
import Api from "../../../api";
import LoadingIcon from "../../base-components/LoadingIcon";
import Toast from "../../base-components/Notif/Notification";
import Lucide from "../../base-components/Lucide";
import { useAuth } from "../../auth/authContext";

interface AsetEditProps {
  getResponse: () => void;
  aset: Aset;
}

type Aset = {
  id_aset: number;
  nama_aset: string;
  nilai_aset: number;
  jumlah: string;
};

export default function AsetEdit({ getResponse, aset }: AsetEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [harga, setHarga] = React.useState<any>(0);
  const [formData, setFormData] = React.useState({
    id_aset: aset.id_aset,
    nama_aset: aset.nama_aset,
    nilai_aset: aset.nilai_aset,
    jumlah: aset.jumlah,
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleEdit = async () => {
    setIsMutating(true);
    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value === ""
    );
    if (isAnyFieldEmpty) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(
          `${Api}/api/aset/${aset.id_aset}/update`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        getResponse();
        setIsMutating(false);
        setOpenEdit(false);
        showToast("#AsetEdited");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatCurrency = (value: any) => {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const resetForm = () => {
    setFormData({
      id_aset: aset.id_aset,
      nama_aset: aset.nama_aset,
      nilai_aset: aset.nilai_aset,
      jumlah: aset.jumlah,
    });
    setHarga(0);
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
        id="AsetEdited"
        title="Data Updated"
        message="Data has been Updated successfully"
        type="success"
      />
      <a
        className="flex items-center mr-3 text-primary"
        href="#"
        onClick={() => {
          setOpenEdit(true);
        }}
      >
        <Lucide icon="Edit" className="w-4 h-4 mr-1 text-primary" />
      </a>
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          resetForm();
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Edit New</h2>
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
                value={
                  harga !== 0
                    ? harga
                    : new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(aset.nilai_aset))
                }
                onChange={(e) => {
                  const numericValue = formatCurrency(e.target.value);
                  setFormData({ ...formData, nilai_aset: numericValue });
                  setHarga(
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(numericValue)
                  );
                }}
                name="nilai_aset"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Jumlah</FormLabel>
              <FormInput
                id="modal-form-2"
                type="number"
                placeholder="Jumlah"
                value={formData?.jumlah ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: e.target.value })
                }
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
              <Button variant="primary" type="button" className="w-20" disabled>
                Editing
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
                onClick={() => handleEdit()}
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
