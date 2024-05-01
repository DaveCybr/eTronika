import axios from "axios";
import Api from "../../../api";
import React from "react";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Paginate from "../../base-components/Paginate";
import { useAuth } from "../../auth/authContext";
import Loading from "../../base-components/Loading";
import Table from "../../base-components/Table";
import RupiahFormat from "../../base-components/RupiahFormat";
import PengeluaranAdd from "./AddPengeluaran";
import PengeluaranEdit from "./EditPengeluaran";
import PengeluaranDelete from "./DeletePengeluaran";

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export default function Main() {
  const { authToken } = useAuth();
  const [response, setResponse] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState<number>(10);
  const [activePage, setActivePage] = React.useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = React.useState(false);

  async function getResponse() {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/pengeluaran?page=${activePage}&search=${search}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setResponse(response.data.data);
      setMeta(response.data);
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

  return (
    <div>
      <h2 className="mt-10 text-lg font-medium intro-y">SALDO</h2>
      <div className="">
        <div className="grid grid-cols-12 gap-4 ">
          <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
            <PengeluaranAdd getResponse={() => getResponse()} />
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
                  <Table.Th className="text-center text-white border-r border-b-0 first:rounded-tl-md">
                    NO
                  </Table.Th>
                  <Table.Th className="text- text-white border-r border-b-0">
                    KETERANGAN
                  </Table.Th>
                  <Table.Th className="text-center text-white border-r border-b-0">
                    JENIS
                  </Table.Th>
                  <Table.Th className="text-center text-white border-r border-b-0">
                    NOMINAL
                  </Table.Th>
                  <Table.Th className="text-center text-white border-r border-b-0">
                    TANGGAL
                  </Table.Th>
                  <Table.Th className="text-center text-white border-r border-b-0 last:rounded-tr-md">
                    ACTIONS
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              {!isMutating && response && response.length === 0 && (
                <Table.Tbody className=" shadow-lg">
                  <Table.Tr className=" shadow-lg">
                    <Table.Td
                      colSpan={8}
                      className="text-center rounded-b-md border-b-0 bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                    >
                      No matching data found.
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              )}
              <Table.Tbody className="bg-white ">
                {response?.map((row: any, i) => (
                  <Table.Tr key={i} className="rounded-lg">
                    <Table.Td className="border-r text-center">
                      {i + 1}
                    </Table.Td>
                    <Table.Td className="border-r  text-">
                      {row.keterangan}
                    </Table.Td>
                    <Table.Td className="border-r  text-center">
                      {row.jenis_pengeluaran}
                    </Table.Td>
                    <Table.Td className="border-r  text-center">
                      <RupiahFormat amount={row.nominal} />
                    </Table.Td>
                    <Table.Td className="border-r  text-center">
                      {row.tanggal}
                    </Table.Td>
                    <Table.Td className="border-r  text-center flex justify-center ">
                      <PengeluaranEdit
                        getResponse={() => getResponse()}
                        data={row}
                      />
                      <PengeluaranDelete
                        getResponse={() => getResponse()}
                        id_pengeluaran={row.id_pengeluaran}
                      />
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
            <div className="text-center flex items-center justify-center">
              <span>Tampilkan </span>
              <div className="w-20 mt-3 !box sm:mt-0 mx-2">
                <FormSelect
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                  }}
                  value={limit}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="54">54</option>
                  <option value="100">100</option>
                </FormSelect>
              </div>
              <span> Data </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
