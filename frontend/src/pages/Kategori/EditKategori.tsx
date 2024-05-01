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

interface KategoriEditProps {
  getResponse: () => void;
  kategori: Kategori;
}

type Kategori = {
  id_kategori: number;
  nama_kategori: string;
};

export default function KategoriEdit({
  getResponse,
  kategori,
}: KategoriEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<Kategori>(kategori);
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
          `${Api}/api/kategori/${kategori.id_kategori}/update`,
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
        showToast("#KategoriEdited");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_kategori: kategori.id_kategori,
      nama_kategori: kategori.nama_kategori,
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
        id="KategoriEdited"
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
              <FormLabel htmlFor="modal-form-1">Nama Kategori</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Kategori Name"
                value={formData.nama_kategori ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_kategori: e.target.value,
                  });
                }}
                name="nama_kategori"
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
