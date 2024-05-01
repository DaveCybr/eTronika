import axios from "axios";
import React, { useState } from "react";
import Api from "../../../../api";
import showToast from "../../../base-components/Toast";
import Toast from "../../../base-components/Notif/Notification";
import Lucide from "../../../base-components/Lucide";
import { Dialog } from "../../../base-components/Headless";
import Button from "../../../base-components/Button";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Table from "../../../base-components/Table";
import { set } from "lodash";
import Dropify from "../../../base-components/Dropify";
import { FormLabel, FormTextarea } from "../../../base-components/Form";
import Tippy from "../../../base-components/Tippy";

interface Props {
  id_detail_servis: number;
  unit: any;
  getResponse: any;
}

export default function DokumenFunction({
  id_detail_servis,
  unit,
  getResponse,
}: Props) {
  const [openModal, setOpenModal] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [response, setResponse] = React.useState<any>([]);
  const [penanganan_servis, setPenangananServis] = React.useState(
    unit.penanganan_servis
  );

  const FetchData = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/servis/${id_detail_servis}/dokumentasi`
      );
      setResponse(response.data);
      setIsMutating(false);
    } catch (error) {
      setIsMutating(false);
      console.error(error);
    }
  };

  const handleUpdatePenanganan = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/servis/${id_detail_servis}/detail-servis/update`,
        { penanganan_servis: penanganan_servis }
      );
      getResponse();
      setIsMutating(false);
      showToast("#updateSuccess");
      setOpenModal(false);
    } catch (error) {
      setIsMutating(false);
      console.error(error);
    }
  };

  React.useEffect(() => {
    FetchData();
  }, []);

  return (
    <>
      <Toast
        id="updateSuccess"
        title="Success"
        message="Data has been Updated"
        type="success"
      />
      <Toast
        id="deleteSuccess"
        title="Success"
        message="Data has been deleted"
        type="success"
      />
      <Tippy
        content="View Dokumentasi"
        as={Button}
        variant="outline-secondary"
        className="shadow-md"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <span className="text-info flex align-middle items-center">
          <Lucide icon="Edit" className="w-4 h-4" />
        </span>
      </Tippy>
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        size="xl"
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              ID :{" "}
              <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {unit.id_detail_servis}
              </span>
              <br />
              UNIT : {unit.nama_unit}
            </h1>
            <ModalUpload
              id_detail_servis={id_detail_servis}
              getResponse={FetchData}
            />
          </Dialog.Title>
          <Dialog.Description>
            <div className="grid grid-cols-12 gap-4 ">
              <div className="col-span-12">
                <FormLabel htmlFor="modal-form-9">
                  Keterangan Penanganan
                </FormLabel>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Keterangan Penanganan Servis"
                  value={penanganan_servis}
                  onChange={(e) => setPenangananServis(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto mt- col-span-12">
                <Table className="shadow-md border-collapse border-black ">
                  <Table.Thead className="rounded-full ">
                    <Table.Tr className="rounded-full  bg-primary dark:bg-darkmode-800">
                      <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                        NO
                      </Table.Th>
                      <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                        KETERANGAN FOTO
                      </Table.Th>
                      <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                        FOTO DOKUMENTASI
                      </Table.Th>
                      <Table.Th className="text-center w-[10%]  text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                        ACTIONS
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  {!isMutating && response && response.length === 0 && (
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td
                          colSpan={4}
                          className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                        >
                          No matching data found.
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  )}
                  <Table.Tbody>
                    {!isMutating &&
                      response &&
                      response.map((data: any, index: number) => {
                        return (
                          <Table.Tr key={index}>
                            <Table.Td className="text-center ">
                              {index + 1}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              {data.deskripsi_foto}
                            </Table.Td>
                            <Table.Td className="border border-t-0">
                              <img
                                src={data.foto}
                                alt="foto dokumentasi"
                                className="w-full h-40"
                              />
                            </Table.Td>
                            <Table.Td className="text-center">
                              <ModalUpdate
                                response={data}
                                id_detail_servis={id_detail_servis}
                                getResponse={FetchData}
                              />
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setOpenModal(false);
              }}
              className="w-20 mr-1"
            >
              Close
            </Button>
            {isMutating ? (
              <Button variant="primary" className="w-30" disabled>
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
                onClick={() => {
                  handleUpdatePenanganan();
                }}
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

interface FormModalProps {
  id_detail_servis: number;
  getResponse: any;
}

const ModalUpload = ({ id_detail_servis, getResponse }: FormModalProps) => {
  const [openAdd, setOpenAdd] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [formData, setFormData] = useState({
    id_detail_servis: id_detail_servis,
    foto: null,
    deskripsi_foto: "",
  });

  const handleAdd = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/servis/${id_detail_servis}/dokumentasi`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOpenAdd(false);
      setIsMutating(false);
      setFormData({
        id_detail_servis: id_detail_servis,
        foto: null,
        deskripsi_foto: "",
      });
      getResponse();
      showToast("#success");
    } catch (error) {
      console.error(error);
      setIsMutating(false);
    }
  };

  return (
    <>
      <Toast
        id="success"
        title="Success"
        message="Data has been added"
        type="success"
      />
      <Button
        variant="outline-secondary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="text-primary dark:text-darkmode-200"
      >
        Add Dokumentasi
      </Button>
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              Upload Dokumentasi
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 bg-white  rounded-lg shadow-xl p-5">
              <FormLabel className="flex justify-between content-center items-center w-full mb-2">
                <span className="text-xs">
                  Foto Dokumentasi dan Keterangan Foto
                </span>
              </FormLabel>
              <div className="col-span-12">
                <Dropify
                  onFileChange={(file: any) => {
                    setFormData({ ...formData, foto: file });
                  }}
                />
              </div>
              <br />
              <div className="col-span-12">
                <FormTextarea
                  placeholder="Keterangan Foto"
                  rows={4}
                  className="w-full"
                  name="deskripsi_foto"
                  value={formData.deskripsi_foto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deskripsi_foto: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenAdd(false);
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
};

interface FormModalUpdateProps {
  response: any;
  id_detail_servis: number;
  getResponse: any;
}

const ModalUpdate = ({
  response,
  id_detail_servis,
  getResponse,
}: FormModalUpdateProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [formData, setFormData] = useState({
    id_detail_servis: id_detail_servis,
    foto: response.foto,
    deskripsi_foto: response.deskripsi_foto,
  });

  const handleUpdate = async () => {
    setIsMutating(true);
    try {
      const resp = await axios.post(
        `${Api}/api/servis/${response.id_detail_deskripsi}/dokumentasi/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOpenEdit(false);
      setIsMutating(false);
      getResponse();
      showToast("#success");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Toast
        id="success"
        title="Success"
        message="Data has been updated"
        type="success"
      />
      <Button
        variant="outline-secondary"
        onClick={() => {
          setOpenEdit(true);
        }}
        className="text-primary dark:text-darkmode-200"
      >
        <Lucide icon="Edit" className="w-4 h-4 mr-1" />
        Edit
      </Button>
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              Upload Dokumentasi
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 bg-white  rounded-lg shadow-xl p-5">
              <FormLabel className="flex justify-between content-center items-center w-full mb-2">
                <span className="text-xs">
                  Foto Dokumentasi dan Keterangan Foto
                </span>
              </FormLabel>
              <div className="col-span-12">
                <Dropify
                  onFileChange={(file: any) => {
                    setFormData({ ...formData, foto: file });
                  }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  *Kosongkan jika tidak ingin mengubah foto
                </span>
              </div>
              <br />
              <div className="col-span-12">
                <FormTextarea
                  placeholder="Keterangan Foto"
                  rows={4}
                  className="w-full"
                  name="deskripsi_foto"
                  value={formData.deskripsi_foto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deskripsi_foto: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenEdit(false);
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="primary" type="button" className="w-20" disabled>
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
                onClick={() => handleUpdate()}
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
};
