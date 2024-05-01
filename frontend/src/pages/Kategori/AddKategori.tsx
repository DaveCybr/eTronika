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

interface KategoriAddProps {
  getResponse: () => void;
}

type Kategori = {
  id_kategori: number;
  nama_kategori: string;
};

export default function KategoriAdd({ getResponse }: KategoriAddProps) {
  const { authToken } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [formData, setFormData] = React.useState<Kategori>({
    id_kategori: 0,
    nama_kategori: "",
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);

    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(`${Api}/api/kategori`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        getResponse();
        setOpenAdd(false);
        setIsMutating(false);
        resetForm();
        showToast("#KategoriAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_kategori: 0,
      nama_kategori: "",
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
        id="KategoriAdded"
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
        Add New Kategori
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
