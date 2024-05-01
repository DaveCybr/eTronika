import axios from "axios";
import Api from "../../../api";
import ProductCard from "./ProductCard";
import React from "react";
import AddProduct from "./AddProduct";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Paginate from "../../base-components/Paginate";
import { useAuth } from "../../auth/authContext";
import Loading from "../../base-components/Loading";

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
  const [response, setResponse] = React.useState<Data>({
    products: [],
    meta: {
      current_page: 0,
      from: 0,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },
    satuan: [],
    kategori: [],
  });
  const [search, setSearch] = React.useState<string | null | []>([]);
  const [limit, setLimit] = React.useState<number>(8);
  const [activePage, setActivePage] = React.useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = React.useState(true);

  async function getResponse() {
    try {
      const response = await axios.get(
        `${Api}/api/product?page=${activePage}&search=${search}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const satuan = await axios.get(`${Api}/api/satuan`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setResponse({
        products: response.data.data.data,
        meta: response.data,
        satuan: satuan.data.data,
        kategori: response.data.kategori,
      });
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

  return (
    <div>
      <h2 className="mt-10 text-lg font-medium intro-y">Price List</h2>
      <div className="">
        <div className="grid grid-cols-12 gap-4 ">
          <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
            <AddProduct
              getResponse={() => getResponse()}
              satuan={response.satuan}
              kategori={response.kategori}
            />
            <div className="hidden mx-auto md:block text-slate-500 justify-center align-center text-center">
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
            <ProductCard
              response={response}
              getResponse={() => getResponse()}
              isMutating={isMutating}
            />
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
