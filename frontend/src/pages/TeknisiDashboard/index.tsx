import { Form } from "react-router-dom";
import Tab from "../../base-components/Headless/Tab";
import FormModal from "./Form";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Api from "../../../api";
import { useAuth } from "../../auth/authContext";
import Loading from "../../base-components/Loading";
import JobDone from "./JobDone";
import JobPending from "./JobPending";

interface Response {
  servisDone: Servis[];
  servisPending: Servis[];
}

type Servis = {
  id_servis: number;
  nama_member: string;
  id_member: number;
  jumlah_unit: number;
  deskripsi_servis: string;
  tanggal_waktu: string;
  status_servis: string;
};

function Main() {
  useEffect(() => {
    // Load the script dynamically
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
    script.type = "module";
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const { data } = useAuth();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [responses, setResponses] = useState<Response>({
    servisDone: [],
    servisPending: [],
  });
  const [search, setSearch] = useState<string | null | []>([]);
  const [limit, setLimit] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [meta, setMeta] = React.useState<any>({});
  const [isMutating, setIsMutating] = useState(true);
  const getResponse = async () => {
    try {
      const response = await axios.get(
        `${Api}/api/servis/${data.id_karyawan}/teknisi?page=${activePage}&search=${search}&limit=${limit}`
      );
      setResponses({
        servisDone: response.data.servisDone,
        servisPending: response.data.servisPending,
      });
      setIsMutating(false);
      setMeta(response.data.servis);
      console.log(response.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResponse();
  }, []);
  return (
    <>
      <FormModal
        openAdd={openAdd}
        setOpenAdd={setOpenAdd}
        getResponse={getResponse}
      />
      {isMutating && <Loading />}
      <div className="flex items-center mt-8 mb-7 intro-y">
        <h2 className="mr-auto text-lg font-medium">Dashboard</h2>
      </div>
      {/* BEGIN: Page Layout */}
      <Tab.Group>
        <Tab.List variant="tabs" className="bg-gray p-2">
          <Tab className="">
            <Tab.Button className="w-full py-2" as="button">
              Job Today
            </Tab.Button>
          </Tab>
          <Tab>
            <Tab.Button className="w-full py-2" as="button">
              Job Done
            </Tab.Button>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-5">
          <Tab.Panel className="leading-relaxed px-1">
            <JobPending responses={responses.servisPending} />
          </Tab.Panel>
          <Tab.Panel className="leading-relaxed">
            <JobDone responses={responses.servisDone} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      {/* </div> */}
      {/* END: Page Layout */}
    </>
  );
}

export default Main;
