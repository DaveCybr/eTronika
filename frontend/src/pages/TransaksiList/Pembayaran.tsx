import React from "react";
import Dialog from "../../base-components/Headless/Dialog";
import showToast from "../../base-components/Toast";
import axios from "axios";
import Api from "../../../api";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useAuth } from "../../auth/authContext";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Button from "../../base-components/Button";
import Select from "react-select";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Toast from "../../base-components/Notif/Notification";

interface Props {
  data: any;
  getResponse: () => void;
}

export default function Pembayaran({ data, getResponse }: Props) {
  const [open, setOpen] = React.useState(false);
  const { authToken } = useAuth();
  const [nominal, setNominal] = React.useState("Rp 0");
  const [formData, setFormData] = React.useState({
    nominal: 0,
    tanggal_bayar: "",
    keterangan: "",
    catatan: "",
  });
  const [isMutating, setIsMutating] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (id: any) => {
    setIsMutating(true);
    if (Object.values(formData).some((value) => value === "")) {
      showToast("#failed-notification-content");
      setIsMutating(false);
    } else {
      try {
        const response = await axios.post(
          `${Api}/api/transaksi/bayar/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        getResponse();
        setOpen(false);
        setIsMutating(false);
        console.log(response);
        resetForm();
        showToast("#success-notification-content");
      } catch (error) {
        console.log(error);
        setIsMutating(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nominal: 0,
      tanggal_bayar: "",
      keterangan: "",
      catatan: "",
    });
    setNominal("Rp 0");
  };

  const formatCurrency = (value: any) => {
    const numericValue = parseFloat(value.replace(/[^\d]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value }: { name: string; value: string } = e.target;
    const strippedValue = value.replace(/[^\d]/g, "");
    const numericValue = formatCurrency(strippedValue);

    const formattedValue = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);

    setFormData({
      ...formData,
      [name]: numericValue,
    });

    setNominal(formattedValue);
  };

  return (
    <>
      <Toast
        id="failed-notification-content"
        title="Failed"
        message="Input Tidak Boleh Kosong."
        type="error"
      />
      <Toast
        id="success-notification-content"
        title="Data Added"
        message="Data has been added successfully"
        type="success"
      />
      <Tippy
        as={Button}
        variant="outline-dark"
        content="Bayar"
        size="sm"
        className="shadow-md "
        onClick={() => {
          setOpen(true);
        }}
      >
        <Lucide icon="Wallet" className="w-4 h-4 text-dark" />
      </Tippy>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        className="w-96"
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Form Pembayaran</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Nama Pelanggan</FormLabel>
              <FormInput
                id="modal-form-1"
                type="text"
                value={data.nama_pelanggan}
                readOnly
                autoFocus={false}
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">
                Keterangan Pembayaran
              </FormLabel>
              <Select
                id="modal-form-2"
                options={[
                  { value: "Pelunasan", label: "Pelunasan" },
                  { value: "Lunas", label: "Lunas" },
                  { value: "DP", label: "DP" },
                  { value: "Cicilan", label: "Cicilan" },
                ]}
                onChange={(e: any) =>
                  setFormData({ ...formData, keterangan: e.value })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-3">Tanggal</FormLabel>
              <FormInput
                id="modal-form-3"
                type="date"
                value={formData.tanggal_bayar}
                onChange={handleChange}
                required
                name="tanggal_bayar"
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-4">Nominal</FormLabel>
              <FormInput
                id="modal-form-4"
                type="text"
                value={nominal}
                onChange={handleInputChange}
                name="nominal"
              />
            </div>
            <div className="col-span-12 sm:col-span-12">
              <FormLabel htmlFor="modal-form-5">Catatan</FormLabel>
              <FormTextarea
                id="modal-form-5"
                value={formData.catatan}
                onChange={(e: any) => handleChange(e)}
                name="catatan"
              />
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="w-20 mr-1"
            >
              Cancel
            </Button>
            {isMutating ? (
              <Button variant="primary" type="button" className="w-30" disabled>
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
                onClick={(e: any) => handleAdd(data.id_transaksi)}
                className="w-20"
              >
                Simpan
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}
