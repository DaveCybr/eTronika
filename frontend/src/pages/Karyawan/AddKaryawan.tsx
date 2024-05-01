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

interface KaryawanAddProps {
  getResponse: () => void;
}

type Karyawan = {
  id_karyawan: number;
  nama_karyawan: string;
  nomor_telepon: string;
  alamat: string;
  email: string;
  jenis_kelamin: string;
  status_karyawan: string;
};

export default function KaryawanAdd({ getResponse }: KaryawanAddProps) {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);

  const [formData, setFormData] = React.useState<Karyawan>({
    id_karyawan: 0,
    nama_karyawan: "",
    nomor_telepon: "",
    alamat: "",
    email: "",
    jenis_kelamin: "",
    status_karyawan: "",
  });

  const handleAdd = async () => {
    setIsMutating(true);

    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(`${Api}/api/karyawan`, formData);
        getResponse();
        setOpenAdd(false);
        setIsMutating(false);
        resetForm();
        showToast("#KaryawanAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_karyawan: 0,
      nama_karyawan: "",
      nomor_telepon: "",
      alamat: "",
      email: "",
      jenis_kelamin: "",
      status_karyawan: "",
    });
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
        id="KaryawanAdded"
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
        Add New Karyawan
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
                placeholder="Karyawan Name"
                value={formData.nama_karyawan ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_karyawan: e.target.value,
                  });
                }}
                name="nama_karyawan"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Nomor Telepon</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                placeholder="Nomor Telepon"
                value={formData?.nomor_telepon ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, nomor_telepon: e.target.value })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-3">Email</FormLabel>
              <FormInput
                id="modal-form-1"
                type="email"
                placeholder="Karyawan Email"
                value={formData.email ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  });
                }}
                name="email"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-4">Jenis Kelamin</FormLabel>
              <Select
                options={[
                  { value: "Pria", label: "Pria" },
                  { value: "Wanita", label: "Wanita" },
                ]}
                value={
                  formData.jenis_kelamin
                    ? {
                        value: formData.jenis_kelamin,
                        label: formData.jenis_kelamin,
                      }
                    : { value: "", label: "Pilih Jenis Kelamin" }
                }
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    jenis_kelamin: selectedOption ? selectedOption.value : "",
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-5">Status Karyawan</FormLabel>
              <Select
                options={[
                  { value: "Kerja", label: "Kerja" },
                  { value: "Ready", label: "Ready" },
                  { value: "Cuti", label: "Cuti" },
                ]}
                value={
                  formData.status_karyawan
                    ? {
                        value: formData.status_karyawan,
                        label: formData.status_karyawan,
                      }
                    : { value: "", label: "Pilih Status Karyawan" }
                }
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    status_karyawan: selectedOption ? selectedOption.value : "",
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-6">Alamat</FormLabel>
              <FormTextarea
                id="modal-form-3"
                placeholder="Alamat"
                rows={4}
                value={formData?.alamat ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
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
