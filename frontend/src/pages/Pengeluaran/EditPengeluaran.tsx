// src/components/PengeluaranEdit.tsx
import React, { useEffect } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import axios from "axios";
import showToast from "../../base-components/Toast";
import Api from "../../../api";
import LoadingIcon from "../../base-components/LoadingIcon";
import Toast from "../../base-components/Notif/Notification";
import { useAuth } from "../../auth/authContext";
import Tippy from "../../base-components/Tippy";
import Lucide from "../../base-components/Lucide";
import { set } from "lodash";
import Select from "react-select";
import { InputActionMeta } from "react-select";

interface PengeluaranEditProps {
  getResponse: () => void;
  data: any;
}

export default function PengeluaranEdit({
  getResponse,
  data,
}: PengeluaranEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    keterangan: data.keterangan,
    nominal: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(data.nominal),
    tanggal: data.tanggal,
    jenis_pengeluaran: data.jenis_pengeluaran,
  });
  const [nominal, setNominal] = React.useState<any>(0);
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/pengeluaran/${data.id_pengeluaran}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      getResponse();
      setOpenEdit(false);
      showToast("#PengeluaranEdited");
      setIsMutating(false);
    } catch (error) {
      console.log(error);
      setIsMutating(false);
      showToast("#failed");
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      keterangan: data.keterangan,
      nominal: data.nominal,
      tanggal: data.tanggal,
      jenis_pengeluaran: data.jenis_pengeluaran,
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
        id="failed"
        title="Failed"
        message="Gagal Mengubah Data."
        type="error"
      />
      <Toast
        id="PengeluaranEdited"
        title="Data Updated"
        message="Data has been updated successfully"
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
                placeholder="Keterangan "
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
                value={{
                  value: formData.jenis_pengeluaran,
                  label: formData.jenis_pengeluaran,
                }}
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
                onChange={(e) => {
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
                name="nominal"
                value={
                  nominal !== 0
                    ? nominal
                    : new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(Number(data.nominal))
                }
                onChange={(e) => {
                  const numericValue = formatCurrency(e.target.value);
                  setFormData({ ...formData, nominal: numericValue });
                  setNominal(
                    new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(numericValue)
                  );
                }}
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
              <Button variant="primary" type="button" className="w-30" disabled>
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
                type="button"
                onClick={() => handleAdd()}
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
