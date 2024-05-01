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
import Select from "react-select";

interface KaryawanEditProps {
  getResponse: () => void;
  karyawan: Karyawan;
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

export default function KaryawanEdit({
  getResponse,
  karyawan,
}: KaryawanEditProps) {
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<Karyawan>(karyawan);
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
          `${Api}/api/karyawan/${karyawan.id_karyawan}/update`,
          formData
        );
        getResponse();
        setIsMutating(false);
        setOpenEdit(false);
        showToast("#KaryawanEdited");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_karyawan: karyawan.id_karyawan,
      nama_karyawan: karyawan.nama_karyawan,
      nomor_telepon: karyawan.nomor_telepon,
      alamat: karyawan.alamat,
      email: karyawan.email,
      jenis_kelamin: karyawan.jenis_kelamin,
      status_karyawan: karyawan.status_karyawan,
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
        id="KaryawanEdited"
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
                id="modal-form-2"
                options={[
                  { value: "Pria", label: "Pria" },
                  { value: "Wanita", label: "Wanita" },
                ]}
                value={{
                  value: formData.jenis_kelamin,
                  label: formData.jenis_kelamin,
                }}
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
                id="modal-form-3"
                options={[
                  { value: "Kerja", label: "Kerja" },
                  { value: "Ready", label: "Ready" },
                  { value: "Cuti", label: "Cuti" },
                ]}
                value={{
                  value: formData.status_karyawan,
                  label: formData.status_karyawan,
                }}
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
