// src/components/SupplierAdd.tsx
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
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import MemberAdd from "../Member/AddMember";

interface Props {
  getResponse: () => void;
  response: Response;
}

type Response = {
  id_servis: number | string;
  id_member: number;
  nama_member: string;
  deskripsi_servis: string;
  tanggal_waktu: string;
  status_servis: string;
};

export default function EditForm({ getResponse, response }: Props) {
  const servisId = response.id_servis;
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    id_member: response.id_member,
    nama_member: response.nama_member,
    deskripsi_servis: response.deskripsi_servis,
    tanggal_waktu: response.tanggal_waktu,
    status_servis: response.status_servis,
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const [selectedStatus, setSelectedStatus] = React.useState<any>({
    value: response.status_servis,
    label: response.status_servis,
  });

  const handleUpdate = async () => {
    setIsMutating(true);

    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(
          `${Api}/api/servis/${servisId}/update`,
          formData
        );
        getResponse();
        setOpenEdit(false);
        setIsMutating(false);
        showToast("#Updated");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_member: response.id_member,
      nama_member: response.nama_member,
      deskripsi_servis: response.deskripsi_servis,
      tanggal_waktu: response.tanggal_waktu,
      status_servis: response.status_servis,
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
        id="Updated"
        title="Data Updated"
        message="Data has been Updated successfully"
        type="success"
      />
      <Button
        variant="outline-primary"
        onClick={() => {
          setOpenEdit(true);
        }}
        className="me-1 "
      >
        <Lucide icon="Edit" className="w-4 h-4" />
      </Button>
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
            <h2 className="mr-auto text-base font-medium">Form Add New</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Pilih Pelanggan</FormLabel>
              <ListPelanggan
                setFormData={(data: FormData) =>
                  setFormData({
                    ...formData,
                    id_member: data.id_member,
                    nama_member: data.nama_member,
                  })
                }
                formData={formData}
              />
            </div>

            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Deskripsi Servis</FormLabel>
              <FormTextarea
                id="modal-form-1"
                placeholder="Deskripsi Servis"
                rows={4}
                value={formData.deskripsi_servis}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    deskripsi_servis: e.target.value,
                  });
                }}
                name="deskripsi_servis"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Tanggal Servis</FormLabel>
              <FormInput
                id="modal-form-1"
                type="date"
                value={formData.tanggal_waktu}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    tanggal_waktu: e.target.value,
                  });
                }}
                name="tanggal_waktu"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Status Servis</FormLabel>
              <Select
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "done", label: "Done" },
                ]}
                onChange={(selectedOption: { value: any } | null) => {
                  setSelectedStatus(selectedOption);
                  setFormData({
                    ...formData,
                    status_servis: selectedOption ? selectedOption.value : null,
                  });
                }}
                value={selectedStatus}
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
                onClick={() => handleUpdate()}
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
interface ListPelangganProps {
  setFormData: (data: FormData) => void;
  formData: any;
}

type FormData = {
  id_member: null;
  nama_member: string;
};

function ListPelanggan({ setFormData, formData }: ListPelangganProps) {
  const [open, setOpen] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [response, setResponse] = React.useState<Response[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState(5);
  const [activePage, setActivePage] = React.useState(1);

  const FetchData = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/member?page=${activePage}&search=${search}&limit=${limit}`
      );
      setResponse(response.data.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [search, activePage, limit]);

  return (
    <>
      <form
        className="mb-3"
        onClick={() => {
          setOpen(true);
        }}
      >
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
          Pilih Pelanggan
        </label>
        <div className="">
          <span
            id="default-search"
            className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {formData.nama_member === ""
              ? "Pilih Pelanggan"
              : formData.nama_member}
          </span>
        </div>
      </form>
      <Dialog
        size="xl"
        open={open}
        onClose={() => setOpen(false)}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title className="flex justify-between items-center">
            <h2 className="mr-auto text-base font-medium">List Pelanggan</h2>
            <MemberAdd
              getResponse={() => {
                FetchData();
              }}
            />
          </Dialog.Title>
          <Dialog.Description className="flex justify-between items-center">
            <div className="relative border text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </Dialog.Description>
          <div className="p-4">
            <Table className="shadow-md border-collapse border-gray-200 -mt-2 rounded-lg">
              <Table.Thead className="rounded-full ">
                <Table.Tr className="rounded-full  bg-primary dark:bg-darkmode-800">
                  <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                    NO
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    NAMA PELANGGAN
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    NOMOR TELEPON
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    ALAMAT
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
                          {data.nama_member}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.nomor_telepon}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.alamat}
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Button
                            variant="primary"
                            onClick={() => {
                              setFormData({
                                id_member: data.id_member,
                                nama_member: data.nama_member,
                              });
                              console.log(setFormData);
                              setOpen(false);
                            }}
                            className="w-20"
                          >
                            Pilih
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
              </Table.Tbody>
            </Table>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
