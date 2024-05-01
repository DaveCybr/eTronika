import React from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import "./style.css";
import Tippy from "../../base-components/Tippy";

interface ProductDetailProps {
  product: any;
  getProducts: () => void;
}

export default function ProductDetail({
  product,
  getProducts,
}: ProductDetailProps) {
  const [openDetail, setOpenDetail] = React.useState(false);

  return (
    <>
      <Tippy
        variant="outline-primary"
        as={Button}
        content="Lihat Gambar"
        size="sm"
        className="flex items-center justify-center mr-1"
        onClick={() => {
          setOpenDetail(true);
        }}
      >
        <Lucide icon="Eye" className="w-4 h-4 " />
      </Tippy>
      <Dialog
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
        }}
        size="xl"
        className=" "
      >
        <Dialog.Panel className="bg-transparent bg-opacity-0 shadow-none">
          <Dialog.Description className=" ">
            <div className="card">
              <div
                className="shoeBackground bg-contain bg-no-repeat bg-center shadow-none"
                style={{
                  backgroundImage: `url(${product.foto})`,
                }}
              ></div>
              <div className="info">
                <div className="shoeName">
                  <div>
                    <h1 className="big">{product.nama}</h1>
                  </div>
                </div>
                <div className="color-container">
                  <div className="flex justify-between">
                    <h3 className="title">Stok :</h3>
                    <h3 className="">{product.stok}</h3>
                  </div>
                </div>
                <div className="color-container">
                  <div className="flex justify-between">
                    <h3 className="title">Seri / Tipe :</h3>
                    <h3 className="">{product.seri || "-"}</h3>
                  </div>
                  <div className="flex justify-between">
                    <h3 className="title">Kategori :</h3>
                    <h3 className="">{product.nama_kategori}</h3>
                  </div>
                </div>
                <div className="buy-price">
                  <span className="buy">Price</span>
                  <div className="price">
                    <h1>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.harga)}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
