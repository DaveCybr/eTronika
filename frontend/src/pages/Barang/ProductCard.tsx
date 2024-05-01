import React from "react";
import Lucide from "../../base-components/Lucide";
import RupiahFormat from "../../base-components/RupiahFormat";
import ProductDelete from "./DeleteProduct";
import ProductEdit from "./EditProduct";
import { set } from "lodash";
import ProductDetail from "./DetailProduct";
import Table from "../../base-components/Table";

interface ProductCardProps {
  response: response | undefined;
  getResponse: () => void;
  isMutating: boolean;
}

interface response {
  products: any[];
  meta: Meta;
  satuan: any[];
  kategori: any[];
}

type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export default function ProductCard({
  response,
  isMutating,
  getResponse,
}: ProductCardProps) {
  return (
    <>
      <Table className="shadow-md">
        <Table.Thead className="">
          <Table.Tr className=" bg-primary dark:bg-darkmode-800">
            <Table.Th className="border-b-0 border-r text-white first:rounded-tl-md">
              NO
            </Table.Th>
            <Table.Th className="border-b-0 border-r text-white">
              UNIT/SPAREPART/JASA
            </Table.Th>
            <Table.Th className="border-b-0 border-r text-white">
              KATEGORI
            </Table.Th>
            <Table.Th className="border-b-0 border-r text-white">
              SATUAN
            </Table.Th>
            <Table.Th className=" text-white border-r border-b-0 ">
              HARGA BELI (HPP)
            </Table.Th>
            <Table.Th className=" text-white border-r border-b-0 ">
              HARGA JUAL
            </Table.Th>
            <Table.Th className=" text-white border-r border-b-0 ">
              STOK
            </Table.Th>
            <Table.Th className=" text-white border-r border-b-0 ">
              KETERANGAN
            </Table.Th>
            <Table.Th className="text-center text-white border-r border-b-0 last:rounded-tr-lg">
              ACTIONS
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        {!isMutating && response && response.products.length === 0 && (
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
          {response?.products.map((product, i) => (
            <Table.Tr key={i} className="bg-white">
              <Table.Td className="border-r text-center">{i + 1}</Table.Td>
              <Table.Td className="border-r">{product.nama}</Table.Td>
              <Table.Td className="border-r">{product.kategori}</Table.Td>
              <Table.Td className="border-r">{product.satuan}</Table.Td>
              <Table.Td className="border-r">
                <RupiahFormat amount={product.hpp} />
              </Table.Td>
              <Table.Td className="border-r">
                <RupiahFormat amount={product.harga} />
              </Table.Td>
              <Table.Td className="border-r text-center">
                {product.stok}
              </Table.Td>
              <Table.Td className="border-r">{product.deskripsi}</Table.Td>
              <Table.Td className="border-r flex justify-center ">
                <ProductDetail product={product} getProducts={getResponse} />
                <ProductEdit
                  product={product}
                  getProducts={getResponse}
                  satuan={response.satuan}
                  kategori={response.kategori}
                />
                <ProductDelete product={product} getProducts={getResponse} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
