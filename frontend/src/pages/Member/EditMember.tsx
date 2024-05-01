// src/components/MemberEdit.tsx
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
import Tippy from "../../base-components/Tippy";

interface MemberEditProps {
  getResponse: () => void;
  members: Member;
}

type Member = {
  id_member: number;
  nama_member: string;
  nomor_telepon: string;
  alamat: string;
};

export default function MemberEdit({ getResponse, members }: MemberEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<Member>(members);
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
          `${Api}/api/member/${members.id_member}/update`,
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
        showToast("#MemberEdited");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_member: members.id_member,
      nama_member: members.nama_member,
      nomor_telepon: members.nomor_telepon,
      alamat: members.alamat,
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
        id="MemberEdited"
        title="Data Updated"
        message="Data has been Updated successfully"
        type="success"
      />
      <Tippy
        className="shadow-md text-center flex items-center justify-center mr-1"
        content="Edit"
        as={Button}
        variant="outline-warning"
        // size="sm"
        onClick={() => {
          setOpenEdit(true);
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
            <h2 className="mr-auto text-base font-medium">Form Edit New</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Member Name"
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
