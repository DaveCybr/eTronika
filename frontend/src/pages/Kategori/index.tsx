import _ from "lodash";
import KategoriAdd from "./AddKategori";
import KategoriEdit from "./EditKategori";
import DeleteKategori from "./DeleteKategori";
import { useState, useRef, useEffect } from "react";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import Paginate from "../../base-components/Paginate";
import Table from "../../base-components/Table";
import axios from "axios";
import Api from "../../../api";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/authContext";

type Kategori = {
  id_kategori: number;
  nama_kategori: string;
};

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

interface Data {
  meta: Meta;
  kategori: Kategori[];
}

const loadingIndicatorOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(237, 233, 232, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const loadingIndicator: React.CSSProperties = {
  padding: 20,
  borderRadius: 8,
  height: 100,
  textAlign: "center",
};

function Main() {
  const { authToken } = useAuth();
  const [response, setResponse] = useState<Data>({
    kategori: [],
    meta: {
      current_page: 0,
      from: 0,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },
  });
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [meta, setMeta] = useState<any>({});
  const [isMutating, setIsMutating] = useState(true);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/kategori?page=${activePage}&search=${search}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setResponse({
        kategori: response.data.data.data,
        meta: response.data,
      });
      setMeta(response.data.data);
      setKategori(response.data.data.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak dapat mengembalikan tindakan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, saya yakin!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Terkonfirmasi!",
          "Tindakan Anda berhasil dikonfirmasi.",
          "success"
        );
        // Tempatkan tindakan yang ingin Anda lakukan setelah konfirmasi di sini
      }
    });
  };

  useEffect(() => {
    getResponse();
  }, [activePage, search, limit]);

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Kategori List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <KategoriAdd
            getResponse={() => {
              getResponse();
            }}
          />
          {/* <Menu>
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                Excel
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                PDF
              </Menu.Item>
            </Menu.Items>
          </Menu> */}
          <div className="hidden mx-auto md:block text-slate-500 justify-center align-center text-center">
            Showing {meta.from} to {meta.to} of {meta.total} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
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
        {isMutating && (
          <div
            className="loading-indicator-overlay"
            style={loadingIndicatorOverlay}
          >
            <div className="loading-indicator-content" style={loadingIndicator}>
              <LoadingIcon icon="bars" className="w-12 h-12" />
              <div className="mt-5 text-lg text-center font-medium">
                Please Wait...
              </div>
            </div>
          </div>
        )}
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-collapse border border-gray-200 -mt-2">
            <Table.Thead className="rounded-full">
              <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border text-white text-center whitespace-nowrap first:rounded-tl-md">
                  NO
                </Table.Th>
                <Table.Th className="border-b-0 border text-white whitespace-nowrap">
                  NAMA KATEGORI
                </Table.Th>
                <Table.Th className="text-center border text-white whitespace-nowrap last:rounded-tr-md">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating && kategori && response.kategori.length === 0 && (
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td
                    colSpan={5}
                    className="text-center rounded-md shadow-sm bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                  >
                    No matching data found.
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            )}
            <Table.Tbody>
              {kategori.map((rows, key) => (
                <Table.Tr
                  key={key}
                  className="intro-x hover:bg-gray-100 dark:hover:bg-darkmode-700"
                >
                  <Table.Td className="border w-10">
                    <div className="flex justify-center items-center h-full">
                      {key + 1}
                    </div>
                  </Table.Td>
                  <Table.Td className="border">
                    <div className="flex flex-col items-start">
                      <a href="#" className="font-medium">
                        {rows.nama_kategori}
                      </a>
                    </div>
                  </Table.Td>
                  <Table.Td className="border">
                    <div className="flex items-center justify-center">
                      <KategoriEdit
                        kategori={rows}
                        getResponse={() => {
                          getResponse();
                        }}
                      />
                      <DeleteKategori
                        kategoriId={rows.id_kategori}
                        getResponse={() => {
                          getResponse();
                        }}
                      />
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          {isMutating === true ? (
            ""
          ) : (
            <Paginate meta={meta} onPageChange={handlePageChange} />
          )}
          <span>Showing </span>
          <div className="w-20 mt-3 !box sm:mt-0 mx-2">
            <FormSelect
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
              }}
              value={limit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </FormSelect>
          </div>
        </div>
        {/* END: Pagination */}
      </div>
    </>
  );
}

export default Main;
