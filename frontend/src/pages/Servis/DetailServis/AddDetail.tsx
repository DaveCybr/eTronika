import React, { useEffect, useState } from "react";
import showToast from "../../../base-components/Toast";
import axios from "axios";
import Api from "../../../../api";
import Toast from "../../../base-components/Notif/Notification";
import Button from "../../../base-components/Button";
import Dialog from "../../../base-components/Headless/Dialog";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import { useParams } from "react-router-dom";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Table from "../../../base-components/Table";
import { useAuth } from "../../../auth/authContext";
import Select from "react-select";
import Lucide from "../../../base-components/Lucide";

interface Props {
  unit: Unit[] | undefined;
  getResponse: () => void;
}

type Unit = {
  id_unit_terdaftar: number;
  nama_unit: string;
};

export default function AddForm({ getResponse }: Props) {
  const { id } = useParams();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [openWarning, setOpenWarning] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    id_unit_terdaftar: null,
    nama_unit: "",
    deskripsi_servis: "",
    id_karyawan: null,
  });
  const [products, setProducts] = React.useState<any>([]);
  const [karyawan, setKaryawan] = React.useState<any>([]);
  const [keranjang, setKeranjang] = React.useState<any>([]);
  const [formItems, setFormItems] = React.useState({
    id_product: null,
    nama: null,
    harga: 0,
    qty: 0,
    total: 0,
  });

  const [selectedOption, setSelectedOption] = React.useState({
    value: null,
    label: "Select Sparepart",
  });

  const handleIncrement = () => {
    setFormItems((prevFormData) => ({
      ...prevFormData,
      qty: (prevFormData.qty || 0) + 1,
    }));
  };

  const handleDecrement = () => {
    setFormItems((prevFormData) => ({
      ...prevFormData,
      qty: Math.max((prevFormData.qty || 0) - 1, 0),
    }));
  };

  const fetchProduk = async () => {
    try {
      const response = await axios.get(`${Api}/api/ready-product`);
      const karyawanResponse = await axios.get(`${Api}/api/karyawan`);
      setKaryawan(karyawanResponse.data.data);
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    setIsMutating(true);
    try {
      const response = await axios.post(
        `${Api}/api/servis/${id}/detail-servis`,
        {
          ...formData,
          keranjang: keranjang,
        }
      );
      getResponse();
      setOpenWarning(false);
      setOpenAdd(false);
      setIsMutating(false);
      setKeranjang([]);
      resetForm();
      showToast("#UnitAdded");
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFormData({
      id_unit: null,
      deskripsi_servis: "",
      tanggal_waktu: "",
      status_servis: "",
      id_karyawan: null,
    });
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  return (
    <>
      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Please fill all required fields."
        type="error"
      />
      <Toast
        id="UnitAdded"
        title="Data Added"
        message="Data has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        Tambah Unit
      </Button>
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
        className="w-96"
        size="xl"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Add New</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">Nama Unit</FormLabel>
              <UnitTerdaftar
                setFormData={(data) => {
                  setFormData({
                    ...formData,
                    id_unit_terdaftar: data.id_unit_terdaftar,
                    nama_unit: data.nama_unit,
                  });
                }}
                formData={formData}
              />
            </div>
            <div className="col-span-12 grid grid-cols-4 gap-4">
              <div className="co-4">
                <FormLabel htmlFor="modal-form-1">Sparepart</FormLabel>
                <Select
                  className="shadow-md"
                  options={products.map((item: any) => ({
                    value: item,
                    label: item.nama,
                  }))}
                  onChange={(selectedOption: { value: any } | null) => {
                    setFormItems({
                      ...formItems,
                      id_product: selectedOption?.value.id_product,
                      nama: selectedOption?.value.nama,
                      harga: selectedOption?.value.harga,
                      qty: 1,
                      total: selectedOption?.value.harga * 1,
                    });
                    setSelectedOption({
                      value: selectedOption?.value,
                      label: selectedOption?.value.nama,
                    });
                  }}
                  value={selectedOption}
                />
              </div>
              <div className="3">
                <FormLabel htmlFor="pos-form-4" className="form-label">
                  Quantity
                </FormLabel>
                <div className="flex">
                  <Button
                    type="button"
                    className="w-12 mr-1 shadow-md border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500"
                    onClick={handleDecrement}
                  >
                    -
                  </Button>
                  <FormInput
                    id="pos-form-3"
                    type="text"
                    className="w-24 text-center shadow-md"
                    placeholder="Item quantity"
                    value={formItems?.qty}
                    onChange={(e) =>
                      setFormItems({
                        ...formItems!,
                        qty: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <Button
                    type="button"
                    className="w-12 ml-1 shadow-md border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500"
                    onClick={handleIncrement}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="3">
                <FormLabel htmlFor="pos-form-4" className="form-label">
                  SubTotal
                </FormLabel>
                <div className="flex flex-1">
                  <FormInput
                    id="pos-form-4"
                    type="text"
                    readOnly
                    className="w-full shadow-md"
                    placeholder="Item quantity"
                    value={new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(formItems?.qty! * formItems?.harga!)}
                    onChange={(e) => {
                      var total = formItems?.qty! * formItems?.harga!;
                      setFormItems({
                        ...formItems!,
                        total: total,
                      });
                      console.log(total);
                    }}
                  />
                </div>
              </div>
              <div className=" mt-7">
                {formItems.id_product != null ? (
                  <Button
                    className="shadow-md"
                    onClick={() => {
                      setKeranjang(
                        keranjang.concat({
                          id_product: formItems.id_product,
                          nama: formItems.nama,
                          harga: formItems.harga,
                          qty: formItems.qty,
                          total: formItems.qty * formItems.harga,
                        })
                      );
                      setFormItems({
                        id_product: null,
                        nama: null,
                        harga: 0,
                        qty: 0,
                        total: 0,
                      });
                      setSelectedOption({
                        value: null,
                        label: "Select Sparepart",
                      });
                    }}
                  >
                    Tambahkan
                  </Button>
                ) : (
                  <Button disabled className="shadow-md">
                    Tambahkan
                  </Button>
                )}
              </div>
            </div>
            <div className="col-span-6"></div>
            <div className="col-span-12 sm:col-span-12">
              <Table className="shadow-md border-collapse border-gray-200 -mt-2 rounded-lg">
                <Table.Thead className="rounded-full ">
                  <Table.Tr className="rounded-full bg-primary dark:bg-darkmode-800">
                    <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                      NO
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      SPAREPART
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      HARGA
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      QTY
                    </Table.Th>
                    <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                      TOTAL
                    </Table.Th>
                    <Table.Th className="text-center w-[10%] text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                      ACTIONS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {keranjang.length === 0 && (
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td
                        colSpan={6}
                        className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                      >
                        No matching data found.
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                )}
                <Table.Tbody>
                  {keranjang.map((item: any, index: number) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td className="text-center ">
                          {index + 1}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {item.nama}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.harga)}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {item.qty}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.total)}
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Button
                            variant="danger"
                            onClick={() => {
                              setKeranjang(
                                keranjang.filter(
                                  (_: any, i: number) => i !== index
                                )
                              );
                            }}
                            className="w-20"
                          >
                            Hapus
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
            <div className="col-span-12 sm:col-span-12 mt-5">
              <FormLabel htmlFor="modal-form-1">Keluhan</FormLabel>
              <FormTextarea
                id="modal-form-1"
                placeholder="Keluhan atau Kebutuhan servis"
                rows={4}
                value={formData.deskripsi_servis}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    deskripsi_servis: e.target.value,
                  });
                }}
                name="deskripsi_servis"
              />
            </div>
            <div className="col-span-12 sm:col-span-12 mt-5">
              <FormLabel htmlFor="modal-form-1">Pilih Teknisi</FormLabel>
              <Select
                options={karyawan.map((item: any) => ({
                  value: item.id_karyawan,
                  label: item.nama_karyawan,
                }))}
                onChange={(selectedOption: { value: any } | null) => {
                  setFormData({
                    ...formData,
                    id_karyawan: selectedOption?.value,
                  });
                }}
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => setOpenWarning(true)}
              className="w-20"
            >
              Send
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      <Dialog
        open={openWarning}
        onClose={() => {
          setOpenWarning(false);
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="AlertCircle"
              className="w-16 h-16 mx-auto mt-3 text-warning"
            />
            <div className="mt-5 text-3xl">Apa anda yakin?</div>
            <div className="mt-2 text-slate-500">
              Kamu yakin mau menyimpan transaksi ini? <br />
              Setelah transaksi Masuk Nota maka tidak bisa dibatalkan.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setOpenWarning(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button
                variant="outline-success"
                type="button"
                className="w-24"
                disabled
              >
                Mengirim
                <LoadingIcon
                  icon="puff"
                  color="black"
                  className="w-4 h-4 ml-2"
                />
              </Button>
            ) : (
              <Button
                variant="outline-success"
                type="button"
                className="w-24 "
                onClick={() => handleAdd()}
              >
                Yakin
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

interface UnitTerdaftarProps {
  setFormData: (data: FormData) => void;
  formData: any;
}

type FormData = {
  id_unit_terdaftar: null;
  nama_unit: string;
};

function UnitTerdaftar({ setFormData, formData }: UnitTerdaftarProps) {
  const { id_member } = useParams();
  const [open, setOpen] = React.useState(false);
  const [isMutating, setIsMutating] = React.useState(false);
  const [response, setResponse] = React.useState<Response[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState(5);
  const [activePage, setActivePage] = React.useState(1);

  const FetchData = async () => {
    setIsMutating(true);
    try {
      const response = await axios.get(
        `${Api}/api/unitTerdaftar/${id_member}?page=${activePage}&search=${search}&limit=${limit}`
      );
      setResponse(response.data.data.data);
      console.log(response.data.data);
      setIsMutating(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [activePage, search, limit]);

  return (
    <>
      <form
        className="mb-3"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="">
          <span
            id="default-search"
            className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {formData.nama_unit ? formData.nama_unit : "Pilih Unit"}
          </span>
        </div>
      </form>
      <Dialog
        size="xl"
        open={open}
        onClose={() => setOpen(false)}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title className="flex justify-between items-center">
            <h2 className="mr-auto text-base font-medium">
              List Unit Terdaftar
            </h2>
            <UnitTerdaftarAdd
              getResponse={() => {
                FetchData();
              }}
            />
          </Dialog.Title>
          <Dialog.Description className="flex justify-between items-center">
            <div className="relative border text-slate-500">
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
          </Dialog.Description>
          <div className="p-4">
            <Table className="shadow-md border-collapse border-gray-200 -mt-2 rounded-lg">
              <Table.Thead className="rounded-full ">
                <Table.Tr className="rounded-full  bg-primary dark:bg-darkmode-800">
                  <Table.Th className="border-b-0 border-r w-10 text-white text-center whitespace-nowrap first:rounded-tl-md">
                    NO
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    ID UNIK
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    PEMILIK
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    UNIT
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r text-white whitespace-nowrap">
                    GARANSI
                  </Table.Th>
                  <Table.Th className="border-b-0 border-r w-auto text-white whitespace-nowrap">
                    GARANSI HABIS
                  </Table.Th>
                  <Table.Th className="text-center w-[10%] text-white border-b-0 whitespace-nowrap last:rounded-tr-md">
                    ACTIONS
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              {!isMutating && response && response.length === 0 && (
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td
                      colSpan={4}
                      className="text-center rounded-b-lg bg-white text-slate-500 dark:bg-darkmode-600 dark:text-slate-400"
                    >
                      No matching data found.
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              )}
              <Table.Tbody>
                {!isMutating &&
                  response &&
                  response.map((data: any, index: number) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td className="text-center ">
                          {index + 1}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.unique_seri}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.nama_member}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.nama_unit}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.jenis_garansi}
                        </Table.Td>
                        <Table.Td className="border border-t-0">
                          {data.tanggal_berakhir_garansi}
                        </Table.Td>
                        <Table.Td className="text-center">
                          <Button
                            variant="primary"
                            onClick={() => {
                              setFormData({
                                id_unit_terdaftar: data.id_unit_terdaftar,
                                nama_unit: data.nama_unit,
                              });
                              setOpen(false);
                            }}
                            className="w-20"
                          >
                            Pilih
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
              </Table.Tbody>
            </Table>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

interface UnitTerdaftarAddProps {
  getResponse: () => void;
}
function UnitTerdaftarAdd({ getResponse }: UnitTerdaftarAddProps) {
  const { authToken } = useAuth();
  const { id, id_member } = useParams();
  const [openAdd, setOpenAdd] = React.useState(false);
  const [garansis, setGaransis] = React.useState<any>([]);
  const [formData, setFormData] = React.useState<any>({
    nama_unit: "",
    id_member: id_member,
    tanggal_berakhir_garansi: "",
    id_garansi: null,
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleAdd = async () => {
    setIsMutating(true);
    const isAnyFieldEmpty = Object.values(formData).some(
      (value) => value === ""
    );
    if (isAnyFieldEmpty) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(
          `${Api}/api/unit-terdaftar`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        getResponse();
        setOpenAdd(false);
        setFormData({
          ...formData,
          nama_unit: "",
          tanggal_berakhir_garansi: "",
          id_member: id_member,
          id_garansi: null,
        });
        showToast("#unitAdded");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ...formData,
      nama_unit: "",
      tanggal_berakhir_garansi: "",
      id_member: id_member,
      id_garansi: null,
    });
  };

  const resp = async () => {
    try {
      const response = await axios.get(`${Api}/api/garansi`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setGaransis(response.data.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    resp();
  }, []);

  return (
    <>
      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Please fill all required fields."
        type="error"
      />
      <Toast
        id="unitAdded"
        title="Unit Added"
        message="Unit has been added successfully"
        type="success"
      />
      <Button
        variant="primary"
        onClick={() => {
          setOpenAdd(true);
        }}
        className="mr-2 shadow-md"
      >
        Unit Terdaftar Baru
      </Button>
      <Dialog
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          resetForm();
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Add New</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama Unit</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Unit Name"
                value={formData.nama_unit ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    nama_unit: e.target.value,
                  });
                }}
                name="nama_unit"
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-9">Garansi</FormLabel>
              <Select
                options={garansis.map(
                  (garansi: { id_garansi: any; jenis_garansi: any }) => ({
                    value: garansi.id_garansi,
                    label: garansi.jenis_garansi,
                  })
                )}
                onChange={(selectedOption: { value: any } | null) =>
                  setFormData({
                    ...formData,
                    id_garansi: selectedOption ? selectedOption.value : null,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-1">
                Tanggal Berahir Garansi
              </FormLabel>
              <FormInput
                id="modal-form-1"
                type="date"
                value={formData.tanggal_berakhir_garansi ?? ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    tanggal_berakhir_garansi: e.target.value,
                  });
                }}
                name="tanggal_berakhir_garansi"
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenAdd(false);
                resetForm();
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="primary" type="button" className="w-20" disabled>
                Adding
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              </Button>
            ) : (
              <Button
                variant="primary"
                type="button"
                onClick={() => handleAdd()}
                className="w-20"
              >
                Send
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

interface Response {
  products: any[];
  keranjang: any[];
  setKeranjang: (keranjang: any) => void;
}

function AddItems({ products, keranjang, setKeranjang }: Response) {
  const [addItemModal, setAddItemModal] = useState(false);
  const [subtotal, setSubtotal] = React.useState(0);
  const [totalCharge, setTotalCharge] = React.useState(0);
  const [formData, setFormData] = useState({
    id_product: null,
    nama: "",
    harga: 0,
    qty: 0,
  });

  const handleIncrement = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      qty: (prevFormData.qty || 0) + 1,
    }));
  };

  const handleDecrement = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      qty: Math.max((prevFormData.qty || 0) - 1, 0),
    }));
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setAddItemModal(true);
        }}
        className="mr-2 shadow-md"
      >
        Tambah Item
      </Button>
      <Dialog
        open={addItemModal}
        onClose={() => {
          setAddItemModal(false);
        }}
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              {formData?.nama ?? "Item Name"}
            </h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12">
              <Select
                options={products.map((item: any) => ({
                  value: item,
                  label: item.nama,
                }))}
                onChange={(selectedOption: { value: any } | null) => {
                  setFormData({
                    ...formData,
                    id_product: selectedOption ? selectedOption.value : null,
                    nama: selectedOption?.value.nama,
                    harga: selectedOption?.value.harga,
                    qty: 1,
                  });
                }}
              />
            </div>
            <div className="col-span-6">
              <FormLabel htmlFor="pos-form-4" className="form-label">
                Quantity
              </FormLabel>
              <div className="flex flex-1">
                <Button
                  type="button"
                  className="w-12 mr-1 border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500"
                  onClick={handleDecrement}
                >
                  -
                </Button>
                <FormInput
                  id="pos-form-4"
                  type="text"
                  className="w-24 text-center"
                  placeholder="Item quantity"
                  value={formData?.qty}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      qty: parseInt(e.target.value) || 0,
                    })
                  }
                />
                <Button
                  type="button"
                  className="w-12 ml-1 border-slate-200 bg-slate-100 dark:bg-darkmode-700 dark:border-darkmode-500 text-slate-500"
                  onClick={handleIncrement}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="col-span-6">
              <FormLabel htmlFor="pos-form-4" className="form-label">
                SubTotal
              </FormLabel>
              <div className="flex flex-1">
                <FormInput
                  id="pos-form-4"
                  type="text"
                  readOnly
                  className="w-full"
                  placeholder="Item quantity"
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(formData?.qty! * formData?.harga!)}
                  onChange={(e) =>
                    setFormData({
                      ...formData!,
                      qty: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </Dialog.Description>
          <Dialog.Footer className="text-right">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setAddItemModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="button"
              className="w-24"
              onClick={() => {
                setKeranjang([...keranjang, formData!]);
                setAddItemModal(false);
              }}
            >
              Add Item
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
