import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./Invoice.css";
import { Dialog } from "../../base-components/Headless";
import { useReactToPrint } from "react-to-print";
import Tippy from "../../base-components/Tippy";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import Api from "../../../api";
import axios from "axios";

interface Response {
  data: any;
}
function Invoice({ data }: Response) {
  const [open, setOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const [response, setResponse] = useState({
    barang: [],
    sparepart: [],
  });

  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/transaksiPrint/${data.id_transaksi}`
      );
      setResponse({
        barang: response.data.detail_transaksi,
        sparepart: response.data.unit_transaksi,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    getResponse();
  }, []);

  const totalHarga = response.sparepart
    .concat(response.barang)
    .reduce((total: number, item: any) => total + item.harga * item.qty, 0);

  const subtotal = totalHarga;
  const total = totalHarga;

  return (
    <>
      <Tippy
        variant="outline-primary"
        className="shadow-md"
        content="Print"
        as={Button}
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Lucide icon="Printer" className="w-4 h-4 text-primary" />
      </Tippy>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        // as="div"
        // id="print-area"
        size="lg"
        // ref={componentRef}
      >
        <Dialog.Panel>
          <Dialog.Title>
            <div className="w-full items-center flex justify-between">
              <h3>Invoice</h3>
              <div>
                <Button
                  onClick={() => {
                    handlePrint();
                  }}
                  className="mr-2"
                >
                  <Lucide icon="Printer" className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <Lucide icon="X" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Dialog.Title>
          <div ref={componentRef} className="invoice">
            <div
              className="invoice-container"
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <div className="invoice-head">
                <div className="flex justify-between mb-3">
                  <div className="invoice-head-top-left text-start">
                    <img src={`${Api}/gambar/RAFA_ELEKTRONIC.png`} />
                  </div>
                  <div className="invoice-head-top-right flex flex-col justify-between items-end text-end">
                    <h3>Invoice</h3>
                    <div>
                      <p>
                        <span className="text-bold">Tanggal :</span>{" "}
                        {new Date().toLocaleDateString()}
                      </p>
                      <p>
                        <span className="text-bold">No. INVOICE :</span>{" "}
                        {data.id_transaksi}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hr"></div>
                <div className="invoice-head-bottom">
                  <div className="invoice-head-bottom-left">
                    <ul>
                      <li className="text-bold">Invoiced To:</li>
                      <li>{data.nama_pelanggan}</li>
                      <li>{data.nomor_telepon}</li>
                      <li>{data.alamat}</li>
                    </ul>
                  </div>
                  <div className="invoice-head-bottom-right">
                    <ul className="text-end">
                      <li className="text-bold">Pay To:</li>
                      <li>Rafa Electronics</li>
                      <li>082335704609</li>
                      <li>Jl. Raya PB Sudirman Tanggul Kulon No.15</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="-view">
                <div className="invoice-body">
                  <table>
                    <thead>
                      <tr>
                        <td className="text-bold">Item</td>
                        <td className="text-bold text-end">Harga</td>
                        <td className="text-bold text-center">QTY</td>
                        <td className="text-bold text-end">TOTAL</td>
                      </tr>
                    </thead>
                    <tbody>
                      {response.sparepart
                        .concat(response.barang)
                        .map((item: any, i: number) => (
                          <tr key={i}>
                            <td>{item.nama_product}</td>
                            <td className="text-end">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              }).format(item.harga)}
                            </td>
                            <td className="text-center">{item.qty}</td>
                            <td className="text-end">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(item.harga * item.qty)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="invoice-body-bottom">
                    <div className="invoice-body-info-item border-bottom">
                      <div className="info-item-td text-end text-bold">
                        Sub Total:
                      </div>
                      <div className="info-item-td text-end">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(subtotal)}
                      </div>
                    </div>
                    <div className="invoice-body-info-item">
                      <div className="info-item-td text-end text-bold">
                        Total:
                      </div>
                      <div className="info-item-td text-end">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(total)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h1>
                    Terima kasih telah berlangganan di Rafa Electronics, semoga
                    hari anda menyenangkan.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default Invoice;
