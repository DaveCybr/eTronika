import axios from "axios";
import Api from "../../../api";
import React from "react";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Paginate from "../../base-components/Paginate";
import { useAuth } from "../../auth/authContext";
import Loading from "../../base-components/Loading";
import Table from "../../base-components/Table";
import RupiahFormat from "../../base-components/RupiahFormat";
import { Link } from "react-router-dom";
import Button from "../../base-components/Button";
import showToast from "../../base-components/Toast";
import Toast from "../../base-components/Notif/Notification";
import Tippy from "../../base-components/Tippy";
import LoadingIcon from "../../base-components/LoadingIcon";
import Select from "react-select";
import { Dialog } from "../../base-components/Headless";
import Litepicker from "../../base-components/Litepicker";
import { set } from "lodash";
import { X } from "lucide-react";
import DokumenFunction from "../Servis/DetailServis/Dokumentasi";

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

interface Data {
  products: any[];
  meta: Meta;
  satuan: any[];
  kategori: any[];
}

export default function Main() {
  // const { authToken } = useAuth();
  const [response, setResponse] = React.useState([]);
  const [limit, setLimit] = React.useState<number>(8);
  const [activePage, setActivePage] = React.useState<number>(1);
  const [search, setSearch] = React.useState("");
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id_member: "",
    tanggal_1: Date,
    tanggal_2: Date,
  });

  async function getResponse() {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/servisHistory?limit=${limit}&search=${search}`
      );
      setResponse(response.data);
      console.log(response.data);
      setIsMutating(false);
    } catch (error) {
      setIsMutating(false);
      console.log(error);
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  React.useEffect(() => {
    getResponse();
  }, []);

  return (
    <div>
      <h2 className="mt-10 text-lg font-medium intro-y">HISTORY SERVIS UNIT</h2>
      <div className="mt-5">
        <div className=" mb-4 col-span-12 mt-2 intro-y max-w-screen bg-white p-4 rounded-md shadow-md">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <label className="block mb-2 font-bold text-gray-600">
                Search
              </label>
              <input
                type="text"
                className="border border-gray-300 shadow w-full rounded mb-"
                onChange={(e: any) => {
                  setSearch(e.target.value);
                }}
                placeholder="Nama Pelanggan, Unit, kode unik.."
              />
            </div>
            <div className="col-span-3">
              <label className="block mb-2 font-bold text-gray-600">
                Dari Tanggal
              </label>
              <input
                type="date"
                className="border border-gray-300 shadow w-full rounded mb-"
                onChange={(e: any) => {
                  setFormData({ ...formData, tanggal_1: e.target.value });
                }}
              />
            </div>
            <div className="col-span-3">
              <label className="block mb-2 font-bold text-gray-600">
                Hingga Tanggal
              </label>
              <input
                type="date"
                className="border border-gray-300 shadow w-full rounded mb-"
                onChange={(e: any) => {
                  setFormData({ ...formData, tanggal_2: e.target.value });
                }}
              />
            </div>
            <div className="col-span-3 align- items-end flex w-full">
              <Button
                className="flex items-center mr-3 mb-1 text-sm text-white"
                variant="facebook"
                onClick={() => {
                  getResponse();
                }}
              >
                <p className="text-sm">FILTER</p>
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 ">
          {isMutating && <Loading />}
          <div className="overflow-x-auto col-span-12">
            <Table className="shadow-md">
              <Table.Thead className="">
                <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                  <Table.Th className="border-b-0 border-r text-white first:rounded-tl-md">
                    KODE UNIK
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white">
                    NAMA PELANGGAN
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white">
                    UNIT
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    KELUHAN
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    PENANGANAN SERVIS
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    TANGGAL SERVIS
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 last:rounded-tr-md">
                    ACTIONS
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              {!isMutating && response && response.length === 0 && (
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td
                      colSpan={7}
                      className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                    >
                      No matching data found.
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              )}
              <Table.Tbody className="bg-white shadow-md">
                {response.map((row: any, i) => (
                  <Table.Tr key={i} className="">
                    <Table.Td className="border-r text-">
                      {row.id_transaksi}
                    </Table.Td>
                    <Table.Td className="border-r">
                      {row.nama_pelanggan}
                    </Table.Td>
                    <Table.Td className="border-r">{row.nama_unit}</Table.Td>
                    <Table.Td className="border-r">
                      {row.deskripsi_servis}
                    </Table.Td>
                    <Table.Td className="border-r">
                      {row.penanganan_servis}
                    </Table.Td>
                    <Table.Td className="border-r ">
                      {row.tanggal_transaksi}
                    </Table.Td>
                    <Table.Td className="border-r text-center">
                      <DokumenFunction
                        id_detail_servis={row.id_detail_servis}
                        unit={row}
                        getResponse={getResponse}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

type dataEditProps = {
  getResponse: () => void;
  data: any;
};

function Editdata({ getResponse, data }: dataEditProps) {
  const { authToken } = useAuth();
  const [openEdit, setOpenEdit] = React.useState(false);
  const [formData, setFormData] = React.useState({
    status: data.status,
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleEdit = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/daftarServis/${data.id}/update`,
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
      showToast("#dataEdited");
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      status: data.status,
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
        id="dataEdited"
        title="Data Updated"
        message="Data has been Updated successfully"
        type="success"
      />
      <Button
        className="flex items-center mr-3 text-sm text-white"
        variant="facebook"
        onClick={() => {
          setOpenEdit(true);
        }}
        size="sm"
      >
        <p className="text-sm">Ubah Status</p>
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
            <h2 className="mr-auto text-base font-medium">
              FORM UPDATE STATUS
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">STATUS</FormLabel>
              <select
                id="countries"
                name="merk"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setFormData({ ...formData, status: e.target.value });
                }}
                value={formData.status}
              >
                <option value="Dikerjakan">Dikerjakan</option>
                <option value="Selesai">Selesai</option>
              </select>
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
              <Button variant="primary" type="button" className="w-30" disabled>
                Menyimpan
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
                Simpan
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
