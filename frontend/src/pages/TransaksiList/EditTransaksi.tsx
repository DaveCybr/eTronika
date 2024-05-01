// src/components/transaksiUpdate.tsx
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
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";

interface Props {
  getResponse: () => void;
  data: any;
}

type Transaksi = {
  lokasi: any;
  nomor_telepon: string;
  nama_pelanggan: string;
  alamat: string;
  catatan: string;
  ref: string;
};

export default function TransaksiUpdate({ getResponse, data }: Props) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<Transaksi>({
    nama_pelanggan: data.nama_pelanggan,
    lokasi: data.lokasi,
    nomor_telepon: data.nomor_telepon,
    alamat: data.alamat,
    ref: data.ref,
    catatan: data.catatan,
  });
  const [isMutating, setIsMutating] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/transaksi/${data.id_transaksi}/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      getResponse();
      setOpenEdit(false);
      setIsMutating(false);
      showToast("#transaksiUpdateed");
    } catch (error: any) {
      setError(error.response.data.message);
      console.error(error);
      setIsMutating(false);
      showToast("#stokKurang");
    }
  };
  return (
    <>
      <Toast id="stokKurang" title="Failed" message={error} type="error" />
      <Toast
        id="transaksiUpdateed"
        title="Data Updated"
        message="Data has been Updated successfully"
        type="success"
      />
      <Tippy
        className="shadow-md "
        as={Button}
        variant="outline-warning"
        content="Edit"
        size="sm"
        onClick={() => {
          setOpenEdit(true);
        }}
      >
        <Lucide icon="Edit" className="w-4 h-4 text-warning" />
      </Tippy>
      <Dialog
        open={openEdit}
        size="xl"
        onClose={() => {
          setOpenEdit(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">EDIT TRANSAKSI</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Referensi Kerja</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                readOnly={data.id_member ? true : false}
                placeholder="Referensi Kerja"
                name="ref"
                onChange={handleChange}
                value={formData.ref}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama Pelanggan</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Nama Pelanggan"
                name="nama_pelanggan"
                readOnly={data.id_member ? true : false}
                onChange={handleChange}
                value={formData.nama_pelanggan}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Nomor Telepon</FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                placeholder="Nomor Telepon"
                readOnly={data.id_member ? true : false}
                name="nomor_telepon"
                onChange={handleChange}
                value={formData.nomor_telepon}
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-3">Alamat</FormLabel>
              <FormTextarea
                id="modal-form-3"
                placeholder="Alamat"
                readOnly={data.id_member ? true : false}
                rows={4}
                onChange={handleChange}
                name="alamat"
              >
                {formData.alamat}
              </FormTextarea>
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-3">Catatan</FormLabel>
              <FormTextarea
                id="modal-form-3"
                placeholder="Catatan"
                rows={4}
                onChange={handleChange}
                name="catatan"
              >
                {formData.catatan}
              </FormTextarea>
            </div>

            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-3">Link Gmaps</FormLabel>
              <FormInput
                id="modal-form-3"
                placeholder="https://maps.app.goo.gl/..."
                onChange={handleChange}
                value={formData.lokasi}
                name="lokasi"
                type="text"
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setOpenEdit(false);
                }}
              >
                Cancel
              </Button>
              {isMutating ? (
                <Button
                  variant="primary"
                  type="button"
                  className="w-30"
                  disabled
                >
                  Updating
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  Update
                </Button>
              )}
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
