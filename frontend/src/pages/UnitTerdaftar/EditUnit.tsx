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

interface UnitTerdaftarEditProps {
  unit: any;
  getUnits: () => void;
  members: member[];
  garansis: garansi[];
}

type garansi = {
  id_garansi: number;
  jenis_garansi: string;
};

type member = {
  id_member: number;
  nama_member: string;
};

type Unit = {
  id_unit_terdaftar: number;
  nama_unit: string;
  tanggal_berakhir_garansi: string;
  nama_member: string;
  jenis_garansi: string;
  id_member: number;
  id_garansi: number;
};

export default function UnitTerdaftarEdit({
  unit,
  getUnits,
  garansis,
  members,
}: UnitTerdaftarEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [harga, setHarga] = React.useState<any>(0);
  const [isMutating, setIsMutating] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<any>({
    value: unit.id_member,
    label: unit.nama_member,
  });
  const [selectedGaransi, setSelectedGaransi] = React.useState<any>({
    value: unit.id_garansi,
    label: unit.jenis_garansi,
  });
  console.log(unit);
  const [formData, setFormData] = React.useState<any>({
    id_unit_terdaftar: unit.id_unit_terdaftar,
    nama_unit: unit.nama_unit,
    tanggal_berakhir_garansi: unit.tanggal_berakhir_garansi,
    nama_member: unit.nama_member,
    jenis_garansi: unit.jenis_garansi,
    id_member: unit.id_member,
    id_garansi: unit.id_garansi,
  });


  const handleUpdate = async (id: number) => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/unit-terdaftar/${id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      getUnits();
      setOpenEdit(false);
      showToast("#unitUpdated");
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
      id_unit_terdaftar: unit.id_unit_terdaftar,
      nama_unit: unit.nama_unit,
      tanggal_berakhir_garansi: unit.tanggal_berakhir_garansi,
      nama_member: unit.nama_member,
      jenis_garansi: unit.jenis_garansi,
      id_member: unit.id_member,
      id_garansi: unit.id_garansi,
    });
    setHarga(0);
    setSelectedGaransi({
      value: unit.id_garansi,
      label: unit.jenis_garansi,
    });
    setSelectedMember({
      value: unit.id_member,
      label: unit.nama_member,
    });
  };

  return (
    <>
      <Toast
        id="unitUpdated"
        title="Success"
        message="Unit Terdaftar has been updated"
        type="success"
      />
      <a
        href="#"
        className="mx-2 flex items-center justify-center"
        onClick={() => {
          setOpenEdit(true);
          resetForm();
        }}
      >
        <Lucide icon="Edit" className="w-4 h-4 mr-1" />{" "}
        <span className="mt-0.5"></span>
      </a>
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Add New</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-3">Merk</FormLabel>
              <Select
                options={
                  Array.isArray(members)
                    ? members?.map(
                        (member: { id_member: any; nama_member: any }) => ({
                          value: member.id_member,
                          label: member.nama_member,
                        })
                      )
                    : undefined

                }
                onChange={(selectedOption: { value: any; label: any }) => {
                  setSelectedMember({
                    value: selectedOption.value,
                    label: selectedOption.label,
                  });
                  setFormData({
                    ...formData,
                    id_member: selectedOption ? selectedOption.value : null,
                  });
                }}
                value={selectedMember}
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
                name="nama"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-3">Garansi</FormLabel>
              <Select
                options={
                  Array.isArray(garansis)
                    ? garansis?.map(
                        (garansi: { id_garansi: any; jenis_garansi: any }) => ({
                          value: garansi.id_garansi,
                          label: garansi.jenis_garansi,
                        })
                      )
                    : undefined
                }
                onChange={(selectedOption: { value: any; label: any }) => {
                  setSelectedMember({
                    value: selectedOption.value,
                    label: selectedOption.label,
                  });
                  setFormData({
                    ...formData,
                    id_garansi: selectedOption ? selectedOption.value : null,
                  });
                }}
                value={selectedGaransi}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">
                Tanggal Berakhir Garansi
              </FormLabel>
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
                name="tanggal_berakhir_garansi"
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
                onClick={() => handleUpdate(formData.id_unit_terdaftar)}
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
