import React from "react";
import DotLottiePlayer from "./NotFoundIcon";

interface JobDoneProps {
  responses: JobDone[];
}

interface JobDone {
  id_servis: number;
  deskripsi_servis: string;
  jumlah_unit: number;
  status_servis: string;
}

export default function JobDone({ responses }: JobDoneProps) {
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
            Opps, Tidak ada job yang selesai saat ini.
          </h1>
        </div>
      ) : (
        responses.map((servis, servisKey) => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              console.log("clicked");
            }}
            key={servisKey}
            className=""
          >
            <div className="flex items-center space-x-4 p-3.5 rounded-lg bg-white">
              <span className="flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-gray-100 text-gray-900 p-1">
                <svg
                  width="800px"
                  height="800px"
                  viewBox="0 0 1024 1024"
                  className="icon"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M841.7 915.2L518.5 797.3 183.1 915.2V107.1h658.6z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M849.7 926.7L518.4 805.8 175.1 926.5V99.1h674.5v827.6zM191.1 115.1v788.8l327.4-115.1 315.1 115V115.1H191.1z"
                    fill="#0A0408"
                  />
                  <path
                    d="M801.6 868.3l-18.2-6.6 2.2-6.2v-6.6h2.5l0.8-2.3 6.2 2.3h6.5zM256.2 856.6l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m512.4-0.3l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-482.8-10.2l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m453.3-0.6l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-423.6-9.8l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m394.1-1l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-364.5-9.4l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m334.9-1.4l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-305.2-9.1l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m275.7-1.6l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-246.1-8.8l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m216.6-2l-14.8-5.4 5.5-15 14.8 5.4-5.5 15zM434.1 794l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m157.4-2.4l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-127.8-8l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m98.2-2.8l-14.8-5.4 5.5-15 14.8 5.4-5.5 15z m-68.5-7.7l-5.3-15.1 14.8-5.2 5.3 15.1-14.8 5.2z m39-3l-14.8-5.4 5.5-15 14.8 5.4-5.5 15zM223.2 868.2v-19.3h6.6l6.2-2.2 0.8 2.2h2.4v6.6l2.2 6.3zM239.2 833.2h-16v-15.7h16v15.7z m0-31.4h-16V786h16v15.8z m0-31.5h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16V629h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.5h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V519z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V362z m0-31.5h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16V252h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7zM223.2 157.5h16v16h-16zM770 173.5h-15.6v-16H770v16z m-31.2 0h-15.6v-16h15.6v16z m-31.2 0H692v-16h15.6v16z m-31.3 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16z m-31.2 0H567v-16h15.6v16z m-31.3 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16H489v16z m-31.3 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16z m-31.3 0h-15.6v-16h15.6v16z m-31.2 0H286v-16h15.6v16z m-31.2 0h-15.6v-16h15.6v16zM785.6 157.5h16v16h-16zM801.6 833.2h-16v-15.7h16v15.7z m0-31.4h-16V786h16v15.8z m0-31.5h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16V629h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.5h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V519z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16V362z m0-31.5h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16V252h16v15.7z m0-31.4h-16v-15.7h16v15.7z m0-31.4h-16v-15.7h16v15.7z"
                    fill="#0A0408"
                  />
                  <path
                    d="M752.2 791.2l-235.4-85.9-244.2 85.9V196.6h479.6z"
                    fill="#55B7A8"
                  />
                  <path
                    d="M512.4 305.7l42.9 86.8 95.8 13.9-69.4 67.6 16.4 95.5-85.7-45.1-85.7 45.1 16.4-95.5-69.4-67.6 95.8-13.9z"
                    fill="#EBB866"
                  />
                  <path
                    d="M608.7 584.1l-96.3-50.6-96.3 50.6 18.4-107.3-77.9-76 107.7-15.7 48.2-97.6 48.2 97.6 107.7 15.7-77.9 76 18.2 107.3z m-96.3-68.7l75.1 39.5-14.3-83.6 60.7-59.2-83.9-12.2-37.5-76.1-37.5 76.1-84.1 12.1 60.7 59.2-14.3 83.6 75.1-39.4z"
                    fill="#0A0408"
                  />
                  <path d="M205.7 140h50.9v50.9h-50.9z" fill="#DC444A" />
                  <path
                    d="M264.6 198.9h-66.9V132h66.9v66.9z m-50.9-16h34.9V148h-34.9v34.9z"
                    fill="#0A0408"
                  />
                  <path d="M768.2 140h50.9v50.9h-50.9z" fill="#DC444A" />
                  <path
                    d="M827.1 198.9h-66.9V132h66.9v66.9z m-50.9-16h34.9V148h-34.9v34.9z"
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
                    {servis.jumlah_unit == null ? 0 : servis.jumlah_unit} Unit
                  </span>
                  <span className="inline-block px-3 text-xs leading-none text-gray-400 font-normal first:pl-0 ">
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
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
        ))
      )}
    </>
  );
}
