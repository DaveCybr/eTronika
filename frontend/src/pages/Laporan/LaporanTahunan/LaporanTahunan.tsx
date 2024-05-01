import clsx from "clsx";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import React from "react";
import Button from "../../../base-components/Button";
import RupiahFormat from "../../../base-components/RupiahFormat";
import Loading from "../../../base-components/Loading";
import axios from "axios";
import Api from "../../../../api";
import PemasukanList from "./PemasukanTahunan";
import PengeluaranList from "./PengeluaranTahunan";

const LaporanTahunan = () => {
  const [isMutating, setIsMutating] = React.useState(false);
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [formData, setFormData] = React.useState<any>({
    bulan: currentMonth,
    tahun: currentYear,
  });

  const [response, setResponse] = React.useState<any>([]);

  const fetch = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/laporanTahunan?tahun=${formData.tahun}`
      );
      setResponse(response.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium text-darkmode-400 truncate mr-5">
          Laporan Bulanan
        </h2>
      </div>
      {isMutating && <Loading />}
      <div className="grid grid-cols-12 gap-6 mt-5 ">
        <div className=" mb-2 items-end p-3 justify-between col-span-12 mt-2 intro-y sm:flex-nowrap bg-white rounded-md shadow">
          <div className=" item justify-center w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-3">
                <label className="block mb-2 font-bold text-gray-600">
                  Tahun
                </label>
                <select
                  name="tahun"
                  className="border border-gray-300 shadow w-full rounded mb-"
                  defaultValue={currentYear}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      tahun: e.target.value,
                    });
                  }}
                >
                  {[...Array(10)].map((_, i) => {
                    const tahun = currentYear - i;
                    return (
                      <option key={tahun} value={tahun}>
                        {tahun}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="col-span-3 flex items-end">
                <Button
                  className="flex items-center mr-3 mb-1 text-sm text-white"
                  variant="facebook"
                  onClick={() => {
                    fetch();
                  }}
                >
                  <p className="text-sm">FILTER</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
          <PemasukanList tahun={formData.tahun} data={response} />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
          <PengeluaranList data={response} tahun={formData.tahun} />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-md before:bg-green-300 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box bg-green-400">
              <div className="flex">
                <Lucide
                  icon="Wallet"
                  className="w-[28px] h-[28px] text-primary"
                />
                <div className="ml-auto">
                  <Tippy
                    as="div"
                    className="cursor-pointer bg-primary flex rounded-full text-white p-1 text-xs items-center font-medium"
                    content="Total Fund"
                  >
                    <Lucide icon="ArrowBigUp" className="w-4 h-4 " />
                  </Tippy>
                </div>
              </div>
              <div className="mt-6 text-3xl font-bold leading-8">
                <RupiahFormat amount={response.total} />
              </div>
              <div className="mt-1 text-base font-bold ">Total Fund</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaporanTahunan;
