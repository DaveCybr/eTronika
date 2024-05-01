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
import Lucide from "../../base-components/Lucide";

interface MemberAddProps {
  getResponse: () => void;
}

type Member = {
  id_member: number;
  nama_member: string;
  nomor_telepon: string;
  alamat: string;
};

export default function MemberAdd({ getResponse }: MemberAddProps) {
  const { authToken } = useAuth();
  const [openMember, setopenMember] = React.useState(false);
  const [formData, setFormData] = React.useState<Member>({
    id_member: 0,
    nama_member: "",
    nomor_telepon: "",
    alamat: "",
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);

    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(`${Api}/api/member`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        getResponse();
        setopenMember(false);
        setIsMutating(false);
        resetForm();
        showToast("#MemberAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_member: 0,
      nama_member: "",
      nomor_telepon: "",
      alamat: "",
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
        id="MemberAdded"
        title="Data Added"
        message="Data has been added successfully"
        type="success"
      />
      <Button
        onClick={() => {
          setopenMember(true);
        }}
      >
        <Lucide icon="Plus" className="w-5 h-5 mr-2" />
        Member Baru
      </Button>
      <Dialog
        open={openMember}
        onClose={() => {
          setopenMember(false);
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
              <FormLabel htmlFor="modal-form-1">Nama Pelanggan</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Nama Pelanggan"
                value={formData.nama_member ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_member: e.target.value,
                  });
                }}
                name="nama_member"
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
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-3">Alamat</FormLabel>
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
                setopenMember(false);
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
