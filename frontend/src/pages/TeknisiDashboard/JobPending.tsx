import React, { useState } from "react";
import DotLottiePlayer from "./NotFoundIcon";
import Dialog from "../../base-components/Headless/Dialog";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import Dropify from "../../base-components/Dropify";
import { Form } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import { AnyAction } from "@reduxjs/toolkit";

interface JobPendingProps {
  responses: JobPending[];
}

interface JobPending {
  id_servis: number;
  deskripsi_servis: string;
  jumlah_unit: number;
  status_servis: string;
}

export default function JobPending({ responses }: JobPendingProps) {
  const [openAdd, setOpenAdd] = React.useState(false);

  return (
    <>
      <form className="mb-3">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">
          Search
        </label>
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Jobs..."
            required
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
      {responses.length === 0 ? (
        <div className="flex-col flex items-center content-center justify-center h-full rounded-md">
          <DotLottiePlayer />
          <br />
          <h1 className="text-2xl text-center font-medium text-gray-500">
            Opps, Belum ada Job untuk hari ini.
          </h1>
        </div>
      ) : (
        responses.map((servis, servisKey) => (
          <>
            <React.Fragment key={servisKey}>
              <ModalUpload
                openAdd={openAdd}
                setOpenAdd={setOpenAdd}
                id_servis={servis.id_servis}
              />
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenAdd(true);
                }}
                key={servisKey}
                className=""
              >
                <div className="flex items-center space-x-4 p-3.5 rounded-lg bg-white">
                  <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-gray-100 text-gray-900 p-1">
                    <svg
                      width="600px"
                      height="600px"
                      viewBox="0 0 1024 1024"
                      className="icon"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M153.9 105.9h715.4v812.8H153.9z"
                        fill="#55B7A8"
                      />
                      <path
                        d="M877.3 926.8H145.9V97.9h731.4v828.9z m-715.4-16h699.4V113.9H161.9v796.9z"
                        fill="#0A0408"
                      />
                      <path
                        d="M221.3 182.9h580.5v658.8H221.3z"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M793.8 833.8h16v16h-16zM777.7 849.8h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0H568v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0H439v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0H310v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16zM213.3 833.8h16v16h-16zM229.3 818.1h-16v-15.7h16v15.7z m0-31.4h-16V771h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V724z m0-31.3h-16V677h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16V332h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V285z m0-31.4h-16V238h16v15.6z m0-31.3h-16v-15.7h16v15.7zM213.3 174.9h16v16h-16zM777.7 190.9h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0H568v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0H439v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16z m-32.3 0H310v-16h16.1v16z m-32.3 0h-16.1v-16h16.1v16z m-32.2 0h-16.1v-16h16.1v16zM793.8 174.9h16v16h-16zM809.8 818.1h-16v-15.7h16v15.7z m0-31.4h-16V771h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V724z m0-31.3h-16V677h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16V332h16v15.7z m0-31.3h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V285z m0-31.4h-16V238h16v15.6z m0-31.3h-16v-15.7h16v15.7z"
                        fill="#0A0408"
                      />
                      <path
                        d="M364.5 306.6m-44.8 0a44.8 44.8 0 1 0 89.6 0 44.8 44.8 0 1 0-89.6 0Z"
                        fill="#DC444A"
                      />
                      <path
                        d="M364.5 359.4c-29.1 0-52.8-23.7-52.8-52.8s23.7-52.8 52.8-52.8 52.8 23.7 52.8 52.8-23.7 52.8-52.8 52.8z m0-89.6c-20.3 0-36.8 16.5-36.8 36.8s16.5 36.8 36.8 36.8 36.8-16.5 36.8-36.8-16.5-36.8-36.8-36.8zM459.3 262.6h144.1v16H459.3zM459.3 332.2h244.1v16H459.3z"
                        fill="#0A0408"
                      />
                      <path
                        d="M364.5 516.3m-44.8 0a44.8 44.8 0 1 0 89.6 0 44.8 44.8 0 1 0-89.6 0Z"
                        fill="#DC444A"
                      />
                      <path
                        d="M364.5 569.1c-29.1 0-52.8-23.7-52.8-52.8s23.7-52.8 52.8-52.8 52.8 23.7 52.8 52.8-23.7 52.8-52.8 52.8z m0-89.6c-20.3 0-36.8 16.5-36.8 36.8 0 20.3 16.5 36.8 36.8 36.8s36.8-16.5 36.8-36.8c0-20.3-16.5-36.8-36.8-36.8zM459.3 472.3h144.1v16H459.3zM459.3 541.9h244.1v16H459.3z"
                        fill="#0A0408"
                      />
                      <path
                        d="M364.5 726m-44.8 0a44.8 44.8 0 1 0 89.6 0 44.8 44.8 0 1 0-89.6 0Z"
                        fill="#DC444A"
                      />
                      <path
                        d="M364.5 778.8c-29.1 0-52.8-23.7-52.8-52.8s23.7-52.8 52.8-52.8 52.8 23.7 52.8 52.8-23.7 52.8-52.8 52.8z m0-89.6c-20.3 0-36.8 16.5-36.8 36.8 0 20.3 16.5 36.8 36.8 36.8s36.8-16.5 36.8-36.8c0-20.3-16.5-36.8-36.8-36.8zM459.3 682h144.1v16H459.3zM459.3 751.6h244.1v16H459.3z"
                        fill="#0A0408"
                      />
                      <path d="M359 72.4h305.2v75.9H359z" fill="#EBB866" />
                      <path
                        d="M672.2 156.2H351V64.4h321.2v91.8z m-305.2-16h289.2V80.4H367v59.8z"
                        fill="#0A0408"
                      />
                      <path
                        d="M808.3 807.9m-141.7 0a141.7 141.7 0 1 0 283.4 0 141.7 141.7 0 1 0-283.4 0Z"
                        fill="#EBB866"
                      />
                      <path
                        d="M808.3 957.6c-82.5 0-149.7-67.1-149.7-149.7s67.1-149.7 149.7-149.7S958 725.4 958 807.9s-67.2 149.7-149.7 149.7z m0-283.4c-73.7 0-133.7 60-133.7 133.7s60 133.7 133.7 133.7S942 881.6 942 807.9s-60-133.7-133.7-133.7z"
                        fill="#0A0408"
                      />
                      <path
                        d="M810.3 727.1l26 52.5 58 8.5-42 40.9 9.9 57.8-51.9-27.3-51.9 27.3 9.9-57.8-41.9-40.9 58-8.5z"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M872.8 901.4l-62.5-32.9-62.5 32.9 11.9-69.6-50.6-49.3 69.9-10.2 31.3-63.3 31.3 63.3 69.9 10.2-50.6 49.3 11.9 69.6z m-62.5-51l41.3 21.7-7.9-45.9 33.4-32.5L831 787l-20.6-41.8-20.7 41.8-46.1 6.7 33.4 32.5-7.9 45.9 41.2-21.7z"
                        fill="#0A0408"
                      />
                    </svg>
                  </span>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm font-medium">
                      {servis.deskripsi_servis}
                    </h3>
                    <div className="divide-x divide-gray-200 mt-auto">
                      <span className="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0">
                        {servis.jumlah_unit === null ? 0 : servis.jumlah_unit}{" "}
                        Unit
                      </span>
                      <span className="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0 ">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                          {servis.status_servis}
                        </span>
                      </span>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 shrink-0"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M9 6l6 6l-6 6"></path>
                  </svg>
                </div>
              </a>
            </React.Fragment>
          </>
        ))
      )}
    </>
  );
}

interface FormModalProps {
  openAdd: boolean;
  id_servis: number;
  setOpenAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormData = {
  id_servis: number;
  deskripsi_servis: string;
  foto: File[];
  deskripsi_foto: string;
};

const ModalUpload = ({ openAdd, setOpenAdd, id_servis }: FormModalProps) => {
  const [isMutating, setIsMutating] = useState(false);
  const [inputsDinamis, setInputsDinamis] = useState(["input-0"]);
  const [formData, setFormData] = useState<FormData>({
    id_servis: id_servis,
    deskripsi_servis: "",
    foto: [],
    deskripsi_foto: "",
  });

  const handleInputDinamis = () => {
    setInputsDinamis([...inputsDinamis, `input-${inputsDinamis.length}`]);
  };

  const handleRemoveInputDinamis = (index: number) => {
    const newInputsDinamis = [...inputsDinamis];
    newInputsDinamis.splice(index, 1);
    setInputsDinamis(newInputsDinamis);
  };

  const handleFileChange = (file: File, index: number) => {
    const newFormData = { ...formData };
    const newFoto = [...newFormData.foto];
    newFoto[index] = file;
    newFormData.foto = newFoto;
    setFormData(newFormData);
    console.log(newFormData);
  };

  console.log(formData);

  return (
    <Dialog
      open={openAdd}
      onClose={() => {
        setOpenAdd(false);
      }}
      className="w-96"
    >
      <Dialog.Panel>
        <Dialog.Title>
          <h2 className="mr-auto text-base font-medium">
            Upload Bukti / Dokumentasi Pengerjaan
          </h2>
        </Dialog.Title>
        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
          <div className="col-span-12 ">
            <FormLabel htmlFor="modal-form-1" className="text-xs">
              Deskripsi Servis
            </FormLabel>
            <FormTextarea
              id="modal-form-1"
              placeholder="Deskripsi Servis"
              rows={4}
              className="w-full"
            />
          </div>
          <hr className=" col-span-12" />
          {inputsDinamis.map((input, index) => (
            <div
              className="col-span-12 bg-white  rounded-lg shadow-xl p-5"
              key={index}
            >
              <FormLabel
                htmlFor={`modal-form-${index + 1}`}
                className="flex justify-between content-center items-center w-full mb-2"
              >
                <span className="text-xs">
                  Foto Dokumentasi dan Keterangan Dokumentasi
                </span>
                {inputsDinamis.length > 1 && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleRemoveInputDinamis(index)}
                    className="rounded-full"
                  >
                    <Lucide icon="Trash" className="w-3 h-3 text-danger" />
                  </Button>
                )}
              </FormLabel>
              <div className="col-span-12">
                <Dropify
                  onFileChange={(file: any) => handleFileChange(file, index)}
                />
              </div>
              <br />
              <div className="col-span-12">
                <FormTextarea
                  id={`modal-form-${index + 1}`}
                  placeholder="Keterangan Dokumentasi"
                  rows={4}
                  className="w-full"
                />
              </div>
            </div>
          ))}
          <div className="col-span-12 sm:col-span-12">
            <Button
              variant="outline-primary"
              className="w-full"
              onClick={() => handleInputDinamis()}
            >
              Add New Input
            </Button>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => {
              setOpenAdd(false);
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
              //   onClick={() => handleAdd()}
              className="w-20"
            >
              Send
            </Button>
          )}
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};
