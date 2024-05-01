import _ from "lodash";
import React, { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import Api from "../../../api";
import Loading from "../../base-components/Loading";
import Paginate from "../../base-components/Paginate";
import SupplierAdd from "./AddSupplier";
import DeleteSupplier from "./DeleteSupplier";
import SupplierEdit from "./EditSupplier";
import { useAuth } from "../../auth/authContext";

type Supplier = {
  id_supplier: number;
  nama_supplier: string;
  alamat: string;
  nomor_telepon: string;
};

function Main() {
  const { authToken } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = useState(true);

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/supplier?page=${activePage}&search=${search}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuppliers(response.data.data);
      setMeta(response.data);
      console.log(response.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    getResponse();
  }, [activePage, search, limit]);

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Supplier List</h2>
      <div className="grid grid-cols-12 gap-6 mt-3 ">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <SupplierAdd
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
          <div className="hidden mx-auto md:block text-slate-500">
            Showing {meta.from} to {meta.to} of {meta.total} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
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
          </div>
        </div>
        {isMutating && <Loading />}
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-collapse border border-gray-200 -mt-2">
            <Table.Thead className="rounded-full border">
              <Table.Tr className="rounded-full border bg-primary dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border text-white text-center whitespace-nowrap first:rounded-tl-md">
                  NO
                </Table.Th>
                <Table.Th className="border-b-0 border text-white whitespace-nowrap">
                  PERUSAHAAN/PT/CV
                </Table.Th>
                <Table.Th className=" text-white border border-b-0 whitespace-nowrap">
                  ALAMAT PERUSAHAAN
                </Table.Th>
                <Table.Th className=" text-white border border-b-0 whitespace-nowrap">
                  TELP PERUSAHAAN
                </Table.Th>
                <Table.Th className="text-center border text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating && suppliers && suppliers.length === 0 && (
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
              {suppliers.map((rows, rowsKey) => (
                <Table.Tr
                  key={rowsKey}
                  className="intro-x dark:hover:bg-darkmode-700"
                >
                  <Table.Td className="border text-center">
                    {rowsKey + 1}
                  </Table.Td>
                  <Table.Td className="border">{rows.nama_supplier}</Table.Td>
                  <Table.Td className="border">{rows.alamat}</Table.Td>
                  <Table.Td className="border">{rows.nomor_telepon}</Table.Td>
                  <Table.Td className="border">
                    <div className="flex items-center justify-center">
                      <SupplierEdit
                        suppliers={rows}
                        getResponse={getResponse}
                      />
                      <DeleteSupplier
                        supplierId={rows.id_supplier}
                        getResponse={getResponse}
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
          <Paginate meta={meta} onPageChange={handlePageChange} />
          <div className="text-center flex items-center justify-center">
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
        </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
