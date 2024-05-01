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

interface UnitTerdaftarAddProps {
  getResponse: () => void;
  members: member[];
  garansis: garansi[];
}

type member = {
  id_member: number;
  nama_member: string;
};

type garansi = {
  id_garansi: number;
  jenis_garansi: string;
};

export default function UnitTerdaftarAdd({
  getResponse,
  members,
  garansis,
}: UnitTerdaftarAddProps) {
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    nama_unit: "",
    tanggal_berakhir_garansi: "",
    id_member: null,
    id_garansi: null,
  });
  const [harga, setHarga] = React.useState<any>(0);
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
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
          `${Api}/api/unit-terdaftar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        getResponse();
        setOpenAdd(false);
        setIsMutating(false);
        setFormData({
          ...formData,
          nama_unit: "",
          tanggal_berakhir_garansi: "",
          id_memeber: null,
          id_garansi: null,
        });
        setHarga(0);
        showToast("#unitAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      nama_unit: "",
      tanggal_berakhir_garansi: "",
      id_member: null,
      id_garansi: null,
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
        id="unitAdded"
        title="Unit Added"
        message="Unit has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        Add New Unit Terdaftar
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
              <FormLabel htmlFor="modal-form-9">Member</FormLabel>
              <Select
                options={members?.map(
                  (member: { id_member: any; nama_member: any }) => ({
                    value: member.id_member,
                    label: member.nama_member,
                  })
                )}
                onChange={(selectedOption: { value: any } | null) =>
                  setFormData({
                    ...formData,
                    id_member: selectedOption ? selectedOption.value : null,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama Unit</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Unit Name"
                value={formData.nama_unit ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_unit: e.target.value,
                  });
                }}
                name="nama_unit"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-9">Garansi</FormLabel>
              <Select
                options={garansis?.map(
                  (garansi: { id_garansi: any; jenis_garansi: any }) => ({
                    value: garansi.id_garansi,
                    label: garansi.jenis_garansi,
                  })
                )}
                onChange={(selectedOption: { value: any } | null) =>
                  setFormData({
                    ...formData,
                    id_garansi: selectedOption ? selectedOption.value : null,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Tanggal Berahir Garansi</FormLabel>
              <FormInput
                id="modal-form-1"
                type="date"
                value={formData.tanggal_berakhir_garansi ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    tanggal_berakhir_garansi: e.target.value,
                  });
                }}
                name="nama_unit"
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
    </>
  );
}
