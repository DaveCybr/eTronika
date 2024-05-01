import React, { useEffect } from "react";
import Button from "../../../base-components/Button";
import axios from "axios";
import Api from "../../../../api";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import Select from "react-select";
import { useParams } from "react-router-dom";
import showToast from "../../../base-components/Toast";
import Toast from "../../../base-components/Notif/Notification";
import Dialog from "../../../base-components/Headless/Dialog";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Lucide from "../../../base-components/Lucide";
import { set } from "lodash";
import { useAuth } from "../../../auth/authContext";
import Table from "../../../base-components/Table";

interface Props {
  unit: Unit[];
  response: Response;
  getResponse: () => void;
}

type Unit = {
  id_unit_terdaftar: number;
  nama_unit: string;
};

type Response = {
  id_servis: number;
  id_detail_servis: number;
  id_unit_terdaftar: number;
  id_karyawan: number;
  nama_karyawan: string;
  nama_unit: string;
  unique_seri: string;
  deskripsi_servis: string;
};

export default function EditForm({ getResponse, unit, response }: Props) {
  const { id } = useParams();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [karyawan, setKaryawan] = React.useState<any>([]);
  const [formData, setFormData] = React.useState<any>({
    id_servis: id,
    nama_unit: response.nama_unit,
    id_unit_terdaftar: response.id_unit_terdaftar,
    id_karyawan: response.id_karyawan,
    deskripsi_servis: response.deskripsi_servis,
  });

  const [selectedOption, setSelectedOption] = React.useState<any>({
    value: response.id_karyawan,
    label: response.nama_karyawan,
  });

  const handleAdd = async () => {
    setIsMutating(true);
    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const resp = await axios.post(
          `${Api}/api/servis/${response.id_detail_servis}/detail-servis/update`,
          formData
        );
        getResponse();
        setOpenAdd(false);
        setIsMutating(false);
        showToast("#Updated");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resp = async () => {
    try {
      const response = await axios.get(`${Api}/api/karyawan`);
      setKaryawan(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    resp();
  }, []);

  const resetForm = () => {
    setFormData({
      id_servis: id,
      nama_unit: response.nama_unit,
      id_unit_terdaftar: response.id_unit_terdaftar,
      deskripsi_servis: response.deskripsi_servis,
      id_karyawan: response.id_karyawan,
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
        message="Data has been updated successfully"
        type="success"
      />
      <Button
        variant="outline-secondary"
        className="shadow-md mr-2"
        onClick={() => {
          setOpenAdd(true);
        }}
      >
        <span className="text-warning flex align-middle items-center">
          <Lucide icon="Edit" className="w-4 h-4 me-2" />
          Edit
        </span>
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
            <h2 className="mr-auto text-base font-medium">Form Edit</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Pilih Unit</FormLabel>
              <UnitTerdaftar setFormData={setFormData} formData={formData} />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Keluhan</FormLabel>
              <FormTextarea
                id="modal-form-1"
                placeholder="Keluhan atau Kebutuhan Servis"
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
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-9">Pilih Karyawan</FormLabel>
              <Select
                options={karyawan.map(
                  (karyawan: { id_karyawan: any; nama_karyawan: any }) => ({
                    value: karyawan.id_karyawan,
                    label: karyawan.nama_karyawan,
                  })
                )}
                value={selectedOption}
                onChange={(selectedOption: { value: any } | null) => {
                  setSelectedOption(selectedOption);
                  setFormData({
                    ...formData,
                    id_karyawan: selectedOption ? selectedOption.value : null,
                  });
                }}
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

interface UnitTerdaftarProps {
  setFormData: (data: FormData) => void;
  formData: any;
}

type FormData = {
  id_unit_terdaftar: null;
  nama_unit: string;
};

function UnitTerdaftar({ setFormData, formData }: UnitTerdaftarProps) {
  const { id_member } = useParams();
  const [open, setOpen] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [response, setResponse] = React.useState<Response[] | null>(null);
  const [search, setSearch] = React.useState<string | null>("");
  const [activePage, setActivePage] = React.useState<number>(1);
  const [limit, setLimit] = React.useState<number>(5);

  const FetchData = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/unitTerdaftar/${id_member}?page=${activePage}&search=${search}&limit=${limit}`
      );
      setResponse(response.data.data.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [activePage, search, limit]);

  return (
    <>
      <form
        className="mb-3"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="">
          <span
            id="default-search"
            className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {formData.nama_unit ? formData.nama_unit : "Pilih Unit"}
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
            <h2 className="mr-auto text-base font-medium">
              List Unit Terdaftar
            </h2>
            <UnitTerdaftarAdd
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
                    ID UNIK
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    PEMILIK
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    UNIT
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    GARANSI
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r w-auto text-white whitespace-nowrap">
                    GARANSI HABIS
                  </Table.Th>
                  <Table.Th className="text-center w-[10%] text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
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
                          {data.unique_seri}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.nama_member}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.nama_unit}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.jenis_garansi}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.tanggal_berakhir_garansi}
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Button
                            variant="primary"
                            onClick={() => {
                              setFormData({
                                id_unit_terdaftar: data.id_unit_terdaftar,
                                nama_unit: data.nama_unit,
                              });
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

interface UnitTerdaftarAddProps {
  getResponse: () => void;
}
function UnitTerdaftarAdd({ getResponse }: UnitTerdaftarAddProps) {
  const { authToken } = useAuth();
  const { id, id_member } = useParams();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [garansis, setGaransis] = React.useState<any>([]);
  const [formData, setFormData] = React.useState<any>({
    nama_unit: "",
    tanggal_berakhir_garansi: "",
    id_member: id_member,
    id_garansi: null,
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
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
          `${Api}/api/unit-terdaftar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        getResponse();
        setOpenAdd(false);
        setFormData({
          ...formData,
          nama_unit: "",
          tanggal_berakhir_garansi: "",
          id_member: null,
          id_garansi: null,
        });
        showToast("#unitAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      nama_unit: "",
      tanggal_berakhir_garansi: "",
      id_member: id_member,
      id_garansi: null,
    });
  };

  const resp = async () => {
    try {
      const response = await axios.get(`${Api}/api/garansi`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setGaransis(response.data.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    resp();
  }, []);

  return (
    <>
      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Please fill all required fields."
        type="error"
      />
      <Toast
        id="unitAdded"
        title="Unit Added"
        message="Unit has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        Unit Terdaftar Baru
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
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama Unit</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Unit Name"
                value={formData.nama_unit ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_unit: e.target.value,
                  });
                }}
                name="nama_unit"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-9">Garansi</FormLabel>
              <Select
                options={garansis.map(
                  (garansi: { id_garansi: any; jenis_garansi: any }) => ({
                    value: garansi.id_garansi,
                    label: garansi.jenis_garansi,
                  })
                )}
                onChange={(selectedOption: { value: any } | null) =>
                  setFormData({
                    ...formData,
                    id_garansi: selectedOption ? selectedOption.value : null,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">
                Tanggal Berahir Garansi
              </FormLabel>
              <FormInput
                id="modal-form-1"
                type="date"
                value={formData.tanggal_berakhir_garansi ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    tanggal_berakhir_garansi: e.target.value,
                  });
                }}
                name="tanggal_berakhir_garansi"
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
