import axios from "axios";
import Api from "../../../../api";
import React from "react";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Paginate from "../../../base-components/Paginate";
import { useAuth } from "../../../auth/authContext";
import Loading from "../../../base-components/Loading";
import Table from "../../../base-components/Table";
import RupiahFormat from "../../../base-components/RupiahFormat";
import { Link } from "react-router-dom";
import Button from "../../../base-components/Button";
import showToast from "../../../base-components/Toast";
import Toast from "../../../base-components/Notif/Notification";
import Tippy from "../../../base-components/Tippy";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Select from "react-select";
import { Dialog } from "../../../base-components/Headless";

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
  const { authToken } = useAuth();
  const [response, setResponse] = React.useState([]);
  const [search, setSearch] = React.useState<string | null | []>([]);
  const [limit, setLimit] = React.useState<number>(8);
  const [activePage, setActivePage] = React.useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = React.useState(true);

  async function getResponse() {
    try {
      const response = await axios.get(
        `${Api}/api/daftarServis?page=${activePage}&search=${search}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setResponse(response.data.data.data);
      setMeta(response.data.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  React.useEffect(() => {
    getResponse();
  }, [activePage, search, limit]);

  const statusMap = (status: any) => {
    if (status === "Dikerjakan") {
      return <span className="text-blue-500">Dikerjakan</span>;
    } else if (status === "Selesai") {
      return <span className="text-green-500">Selesai</span>;
    } else {
      return <span className="text-yellow-500">Memohon</span>;
    }
  };

  return (
    <div>
      <h2 className="mt-10 text-lg font-medium intro-y">
        Daftar Pemohon Servis Gratis
      </h2>
      <div className="">
        <div className="grid grid-cols-12 gap-4 ">
          <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
            <div className="text-center flex items-center justify-center">
              <span>Tampilkan </span>
              <div className="w-20 mt-3 !box sm:mt-0 mx-2">
                <FormSelect
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                  }}
                  value={limit}
                >
                  <option value="9">9</option>
                  <option value="12">12</option>
                  <option value="21">21</option>
                  <option value="54">54</option>
                  <option value="100">100</option>
                </FormSelect>
              </div>
              <span> Data </span>
            </div>
            <div className="hidden mx-auto md:block text-slate-500 justify-center align-center text-center">
              Menampilan {meta.per_page} data dari {meta.total} entries
            </div>
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
              <div className="relative w-56 text-slate-500">
                <FormInput
                  type="text"
                  className="w-full pr-10 !box"
                  placeholder="Search..."
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Lucide
                  icon="Search"
                  className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                />
              </div>
            </div>
          </div>
          {isMutating && <Loading />}
          <div className="overflow-x-auto col-span-12">
            <Table className="">
              <Table.Thead className="">
                <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                  <Table.Th className="border-b-0 border-r text-white first:rounded-tl-md">
                    NO
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white">
                    NAMA
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white">
                    NOMOR TELEPON
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    ALAMAT
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    SERI
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    MERK
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 ">
                    JENIS
                  </Table.Th>
                  <Table.Th className=" text-white border-r border-b-0 last:rounded-tr-md">
                    KELUHAN / KERUSAKAN
                  </Table.Th>

                  <Table.Th className=" text-white border-r border-b-0 last:rounded-tr-md">
                    STATUS
                  </Table.Th>

                  <Table.Th className="text-center text-white border-r border-b-0 last:rounded-tr-md">
                    ACTIONS
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              {!isMutating && response && response.length === 0 && (
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td
                      colSpan={8}
                      className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                    >
                      No matching data found.
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              )}
              <Table.Tbody className="">
                {response.map((row: any, i) => (
                  <Table.Tr
                    key={i}
                    className={`intro-y first:rounded-bl-md ${
                      row.status === "Selesai"
                        ? "bg-green-100 dark:bg-green-700"
                        : row.status === "Dikerjakan"
                        ? "bg-blue-100 dark:bg-blue-700"
                        : "bg-yellow-100 dark:bg-yellow-700"
                    }`}
                  >
                    <Table.Td className="border-r border-gray-400 text-center">
                      {i + 1}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400">
                      {row.nama}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400">
                      {row.nomor_telepon}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400">
                      {row.alamat}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400">
                      {row.seri ? row.seri : "-"}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400">
                      {row.merk}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400 ">
                      {row.jenis}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400 ">
                      {row.keluhan}
                    </Table.Td>
                    <Table.Td className="border-r border-gray-400">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                          row.status === "Selesai"
                            ? "bg-green-500"
                            : row.status === "Dikerjakan"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </Table.Td>

                    <Table.Td className="border-r-0 border-gray-400">
                      <Editdata data={row} getResponse={getResponse} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
            {isMutating === true ? (
              ""
            ) : (
              <Paginate meta={meta} onPageChange={handlePageChange} />
            )}
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
      console.log(response);
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
                <option value="">Pilih Status</option>
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
