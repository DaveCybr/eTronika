import clsx from "clsx";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import React from "react";
import axios from "axios";
import Api from "../../../api";
import { set } from "lodash";
import RupiahFormat from "../../base-components/RupiahFormat";
import { Tab } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import Loading from "../../base-components/Loading";

function Main() {
  const [isMutating, setIsMutating] = React.useState(false);
  const [response, setResponse] = React.useState<any>({});

  const getResponse = async () => {
    setIsMutating(true);
    try {
      const reponses = await axios.get(`${Api}/api/dashboard`);
      setResponse(reponses.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
      setIsMutating(false);
    }
  };

  React.useEffect(() => {
    getResponse();
  }, []);
  return (
    <>
      {isMutating && <Loading />}
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Dashboard</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="ShoppingCart"
                  className="w-[28px] h-[28px]"
                  style={{
                    color: "#FFA500",
                  }}
                />
                <div className="ml-auto">
                  <Tippy
                    as="div"
                    className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                    content="100% dari transaksi yang sudah diinputkan"
                  >
                    100%
                    <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                  </Tippy>
                </div>
              </div>
              <div className="mt-6 text-xl font-medium ">
                {response.transaksi}
              </div>
              <div className="mt-1 text-base text-slate-500">
                Data Transaksi
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="ShoppingCart"
                  className="w-[28px] h-[28px]"
                  style={{
                    color: "#FFA500",
                  }}
                />
              </div>
              <div className="mt-6 text-xl font-medium ">
                {response.transaksi_hari_ini}
              </div>
              <div className="mt-1 text-base text-slate-500">
                Transaksi Hari Ini
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="Wallet"
                  className="w-[28px] h-[28px] text-success"
                />
                <div className="ml-auto">
                  <Tippy
                    as="div"
                    className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-1 pr-1 items-center font-medium"
                    content={`Total Pemasukan Hari Ini`}
                  >
                    (<Lucide icon="Plus" className="w-4 h-4" />)
                  </Tippy>
                </div>
              </div>
              <div className="mt-6 text-xl font-medium ">
                <RupiahFormat amount={response.pemasukan_hari_ini} />
              </div>
              <div className="mt-1 text-base text-slate-500">
                Pemasukan Hari Ini
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="Wallet"
                  className="w-[28px] h-[28px] text-danger"
                />
                <div className="ml-auto">
                  <Tippy
                    as="div"
                    className="cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs pl-1 pr-1 items-center font-medium"
                    content={`Total Pengeluaran Hari Ini`}
                  >
                    (<Lucide icon="Minus" className="w-4 h-4" />)
                  </Tippy>
                </div>
              </div>
              <div className="mt-6 text-xl font-medium ">
                <RupiahFormat amount={response.pengeluaran_hari_ini} />
              </div>
              <div className="mt-1 text-base text-slate-500">
                Pengeluaran Hari Ini
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 mt-3 xl:col-span-12">
          <div className="flex items-center h-10 intro-y">
            <h2 className="mr-5 text-lg font-medium truncate">
              General Report
            </h2>
          </div>
          <div className="mt-5 intro-y">
            <div className="grid grid-cols-12 box">
              <div className="flex flex-col justify-center col-span-12 px-8 py-12 lg:col-span-4">
                <Lucide icon="PieChart" className="w-10 h-10 text-pending" />
                <div className="flex items-center justify-start mt-12 text-slate-600 dark:text-slate-300">
                  Total Omset
                  <Tippy
                    content={`Total value of your sales: Rp ${new Intl.NumberFormat(
                      "id-ID"
                    ).format(response.total_omset)}`}
                  >
                    <Lucide icon="AlertCircle" className="w-4 h-4 ml-1.5" />
                  </Tippy>
                </div>
                <div className="flex items-center justify-start mt-4">
                  <div className="relative text-2xl font-medium">
                    <RupiahFormat amount={response.total_omset} />
                  </div>
                  <a className="ml-4 text-slate-500" href="">
                    <Lucide icon="RefreshCcw" className="w-4 h-4" />
                  </a>
                </div>
                <div className="mt-4 text-xs text-slate-500">Last updated</div>
              </div>
              <div className="col-span-12 p-8 border-t border-dashed lg:col-span-8 lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300">
                <div className="grid grid-cols-12 gap-y-8 gap-x-10">
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Piutang</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        <RupiahFormat amount={response.piutang} />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Belum Dibayar</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        {response.transaksi_belum_dibayar}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Dibayar</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        {response.transaksi_dibayar}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Transaksi Selesai</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        {response.transaksi_selesai}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Jumlah Pricelist</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">{response.pricelist}</div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Total Pricelist</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        <RupiahFormat amount={response.total_pricelist} />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">HPP Pricelist</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        <RupiahFormat amount={response.total_hpp_pricelist} />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3"></div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Net Margin</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">{response.margin}%</div>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-3 md:col-span-3">
                    <div className="text-slate-500">Laba Bersih</div>
                    <div className="mt-1.5 flex items-center">
                      <div className="text-base">
                        <RupiahFormat amount={response.laba} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
