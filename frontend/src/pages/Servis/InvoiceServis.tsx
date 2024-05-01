import Table from "../../base-components/Table";
import logoUrl from "../../assets/images/logo.svg";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Api from "../../../api";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";

type Response = {
  id_servis: number;
  id_member: number;
  nama_member: string;
  alamat: string;
  nomor_telepon: string;
  deskripsi_servis: string;
  tanggal_waktu: string;
};

type JasaTransaksi = {
  id_jasa_transaksi: number;
  id_servis: number;
  id_jasa: number;
  nama_jasa: string;
  qty: number;
  total: number;
  harga: number;
};
function Invoice() {
  const { id } = useParams();
  const [responses, setResponses] = useState<Response[]>();
  const [responseJasaTransaksi, setResponseJasaTransaksi] =
    useState<JasaTransaksi[]>();
  const [total, setTotal] = useState<number>(0);

  const getResponse = async () => {
    try {
      const response = await axios.get(`${Api}/api/servis/${id}`);
      setResponses(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getResponseJasaTransaksi = async () => {
    try {
      const response = await axios.get(`${Api}/api/getJasaTransaksi/${id}`);
      setResponseJasaTransaksi(response.data.data);
      console.log(response.data.data);

      let totalHarga = 0;
      response.data.data.forEach((item: JasaTransaksi) => {
        totalHarga += item.total;
      });
      setTotal(totalHarga);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResponse();
    getResponseJasaTransaksi();
  }, []);
  
  useEffect(() => {
    // Cetak setelah data dimuat
    if (responses && responseJasaTransaksi) {
      window.print();
    }
  }, [responses, responseJasaTransaksi]);


  return (
    <>
      <div className="py-5">
        
        <div className="flex justify-center">
          <div className="segitiga1 bg-blue-500 w-[335px] h-[70px] relative flex items-center px-7">
            <div className="flex">
              <img src={logoUrl} alt="" className="w-6" />
              <div className="block ml-3">
                <h1 className="font-bold text-white text-[16px]">
                  ElectroCare
                </h1>
                <h1 className="text-white w-[300px] text-[12px]">
                  Elektronik untuk Hidup Modernmu.
                </h1>
              </div>
            </div>
          </div>
          <div className="segitiga2 bg-blue-500 w-[495px] h-[100px] relative flex items-center justify-end px-7 gap-3">
            <h1 className="font-bold text-white text-[36px]">INVOICE</h1>
            <div className="block w-[160px]">
              <div className="flex text-white font-semibold justify-between text-[12px]">
                <h1>Invoice No : </h1>
                <h1># {responses?.[0]?.id_servis}</h1>
              </div>
              <div className="flex text-white font-semibold justify-between text-[12px]">
                <h1>Invoice Date : </h1>
                <h1>{responses?.[0]?.tanggal_waktu}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="px-12">
          <div className="flex mt-9 justify-between">
            <div className="space-y-2">
              <h1 className="font-semibold">Invoice to :</h1>
              <h1 className="text-[30px] font-bold">
                {responses?.[0]?.nama_member}
              </h1>
              <div className="flex w-[500px]">
                <p className="mr-10">Alamat </p>
                <p>{responses?.[0]?.alamat}</p>
              </div>
              <div className="flex">
                <p className="mr-3">No Telepon </p>
                <p>{responses?.[0]?.nomor_telepon}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Table className="shadow-md border-collapse border-gray-200 -mt-2">
            <Table.Thead className="">
              <Table.Tr className="bg-blue-500 dark:bg-darkmode-800">
                <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap ">
                  NO
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                  JASA SERVIS
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                  HARGA
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                  QTY
                </Table.Th>
                <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                  SUBTOTAL
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {responseJasaTransaksi?.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="text-center">{index + 1}</Table.Td>
                  <Table.Td className="border border-t-0">
                    {item.nama_jasa}
                  </Table.Td>
                  <Table.Td className="border border-t-0">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.harga)}
                  </Table.Td>
                  <Table.Td className="border border-t-0">{item.qty}</Table.Td>
                  <Table.Td className="border border-t-0">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(item.total)}
                  </Table.Td>
                </Table.Tr>
              ))}
              <Table.Tr>
                <Table.Td colSpan={4} className="text-right">
                  Total:
                </Table.Td>
                <Table.Td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(total)}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        <div className="px-12 mt-10 flex gap-2">
          <h1 className="font-semibold w-[150px]">Deskripsi Servis </h1>
          <FormTextarea value={responses?.[0].deskripsi_servis} />
        </div>
      </div>
    </>
  );
}

export default Invoice;
