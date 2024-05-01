import axios from "axios";
import React from "react";
import Api from "../../../../api";
import showToast from "../../../base-components/Toast";
import Toast from "../../../base-components/Notif/Notification";
import Lucide from "../../../base-components/Lucide";
import { Dialog } from "../../../base-components/Headless";
import Button from "../../../base-components/Button";
import LoadingIcon from "../../../base-components/LoadingIcon";

interface DeleteProps {
  id_detail_servis: number;
  getResponse: any;
}

export default function DeleteFunction({
  id_detail_servis,
  getResponse,
}: DeleteProps) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);

  const handleDelete = async () => {
    setIsMutating(true);
    try {
      const response = await axios.delete(
        `${Api}/api/servis/${id_detail_servis}/detail-servis`
      );
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
      <Button
        variant="outline-secondary"
        className="shadow-md  mr-2"
        onClick={() => {
          setOpenDelete(true);
        }}
      >
        <span className="text-danger flex align-middle items-center">
          <Lucide icon="Trash" className="w-4 h-4 mr-1" />
          Delete
        </span>
      </Button>
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
                onClick={() => handleDelete()}
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
