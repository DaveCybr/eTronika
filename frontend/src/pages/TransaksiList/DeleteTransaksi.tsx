import React from "react";
import Button from "../../base-components/Button";
import { Dialog, Menu } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import axios from "axios";
import Api from "../../../api";
import showToast from "../../base-components/Toast";
import Toast from "../../base-components/Notif/Notification";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useAuth } from "../../auth/authContext";
import Tippy from "../../base-components/Tippy";

interface props {
  id: number;
  getResponse: () => void;
}

export default function DeleteTransaksi({ id, getResponse }: props) {
  const { authToken } = useAuth();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);

  const handleDelete = async (id: number) => {
    setIsMutating(true);
    try {
      const response = await axios.delete(`${Api}/api/transaksi/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      getResponse();
      setOpenDelete(false);
      setIsMutating(false);
      showToast("#deleteSuccess");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Toast
        id="deleteSuccess"
        title="Success"
        message="Data has been deleted"
        type="success"
      />
      <Tippy
        as={Button}
        variant="outline-danger"
        content="Hapus"
        className="shadow-md "
        size="sm"
        onClick={() => {
          setOpenDelete(true);
        }}
      >
        <Lucide icon="Trash" className="w-4 h-4 text-danger" />
      </Tippy>
      <Dialog
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setOpenDelete(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="danger" type="button" className="w-24" disabled>
                Deleting
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              </Button>
            ) : (
              <Button
                variant="danger"
                type="button"
                className="w-24"
                onClick={() => handleDelete(id)}
              >
                Delete
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
