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
import UnitTerdaftarAdd from "./AddUnit";
import DeleteUnitTerdaftar from "./DeleteUnit";
import UnitTerdaftarEdit from "./EditUnit";
// import logoRafaElectro from "../../assets/images/logo/logo-rafa-electronic.jpg";
import { QRCode } from "react-qrcode-logo";

type Unit = {
  id_unit_terdaftar: number;
  unique_seri: string;
  nama_unit: string;
  nama_member: string;
  id_member: number;
  id_garansi: number;
  jenis_garansi: string;
  tanggal_berakhir_garansi: string;
};

interface Data {
  members: member[];
  garansis: garansi[];
}

type member = {
  id_member: number;
  nama_member: string;
};

type garansi = {
  id_garansi: number;
  jenis_garansi: string;
};

function Main() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [response, setResponse] = React.useState<Data>({
    members: [],
    garansis: [],
  });
  const [isMutating, setIsMutating] = useState(true);

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/unit-terdaftar?page=${activePage}&search=${search}&limit=${limit}`
      );
      setResponse({
        members: response.data.member,
        garansis: response.data.garansi,
      });
      setUnits(response.data.unit_terdaftar.data);
      setMeta(response.data.unit_terdaftar);
      console.log(response.data.member[0]);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const downloadQRCode = () => {
    const qrCodeEl = document.getElementById("qrCodeEl") as HTMLCanvasElement;
    if (!qrCodeEl) {
      console.error("QR code element not found.");
      return;
    }

    const qrCodeURL = qrCodeEl
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log(qrCodeURL);

    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QrCode.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };

  useEffect(() => {
    getResponse();
  }, [activePage, search, limit]);

  return (
    <>
      {units.map((rows, rowsKey) => (
        <div className="hidden">
          <QRCode
            id="qrCodeEl"
            size={500}
            value={rows.unique_seri}
            // logoImage={logoRafaElectro}
            logoWidth={200}
            ecLevel="H"
          />
        </div>
      ))}
      <h2 className="mt-10 text-lg font-medium intro-y">Unit List</h2>
      <div className="grid grid-cols-12 gap-6 mt-3 ">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <UnitTerdaftarAdd
            members={response.members}
            garansis={response.garansis}
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
        <div className="overflow-x-auto col-span-12">
          <Table className="bg-white">
            <Table.Thead className="rounded-full border">
              <Table.Tr className="rounded-full border bg-primary dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border text-white text-center whitespace-nowrap first:rounded-tl-md">
                  NO
                </Table.Th>
                <Table.Th className="border-b-0 border text-white whitespace-nowrap">
                  UniqId
                </Table.Th>
                <Table.Th className="border-b-0 border text-white whitespace-nowrap">
                  Nama Member/Pemilik
                </Table.Th>
                <Table.Th className=" text-white border border-b-0 whitespace-nowrap">
                  Unit
                </Table.Th>
                <Table.Th className=" text-white border border-b-0 whitespace-nowrap">
                  Garansi
                </Table.Th>
                <Table.Th className=" text-white border border-b-0 whitespace-nowrap">
                  Garansi Habis
                </Table.Th>
                <Table.Th className="text-center border text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            {!isMutating && units && units.length === 0 && (
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
            <Table.Tbody>
              {units.map((rows, rowsKey) => (
                <Table.Tr
                  key={rowsKey}
                  className="intro-x dark:hover:bg-darkmode-700"
                >
                  <Table.Td className="border text-center">
                    {rowsKey + 1}
                  </Table.Td>
                  <Table.Td className="border">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      {rows.unique_seri}
                    </span>
                  </Table.Td>
                  <Table.Td className="border">{rows.nama_member}</Table.Td>
                  <Table.Td className="border">{rows.nama_unit}</Table.Td>
                  <Table.Td className="border">{rows.jenis_garansi}</Table.Td>
                  <Table.Td className="border">
                    {rows.tanggal_berakhir_garansi}
                  </Table.Td>
                  <Table.Td className="border">
                    <div className="flex items-center justify-center">
                      <a
                        href="#"
                        className="mx-2 flex items-center justify-center text-blue-800"
                        onClick={downloadQRCode}
                      >
                        <Lucide icon="Download" className="w-4 h-4" />{" "}
                      </a>
                      <UnitTerdaftarEdit
                        unit={rows}
                        members={response.members}
                        garansis={response.garansis}
                        getUnits={getResponse}
                      />
                      <DeleteUnitTerdaftar
                        unitTerdaftarId={rows.id_unit_terdaftar}
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
