import { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import axios from "axios";
import Api from "../../../api";
import Swal from "sweetalert2";
import Marquee from "react-fast-marquee";
import { Dialog } from "../../base-components/Headless";
import { Link } from "react-router-dom";
import { set } from "lodash";

export default function Main() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <main className="flex-grow">
        <HeroHome />
      </main>
    </div>
  );
}

function HeroHome() {
  const [openAdd, setOpenAdd] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    nomor_telepon: "",
    alamat: "",
    jenis: "",
    merk: "",
    keluhan: "",
    seri: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsMutating(true);
    try {
      const response = await axios.post(`${Api}/api/daftarServis`, formData);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Jika anda Beruntung, Kami akan menghubungi anda!",
      });
      console.log("success");
      setOpenAdd(false);
      setIsMutating(false);
      setFormData({
        nama: "",
        nomor_telepon: "",
        alamat: "",
        jenis: "",
        merk: "",
        seri: "",
        keluhan: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Mohon isi Formulir dengan Benar!",
      });
      setIsMutating(false);
    }
  };

  return (
    <section className="relative bg-primary max-h-lvh">
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src={`/backend/public/gambar/RAFA_ELEKTRONIC.png`}
              className="h-11"
              alt="Flowbite Logo"
            />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <Link to="/login">Login</Link>
            </button>
          </div>
        </div>
      </nav>

      {/* <div className="max-w-6xl px-32"></div> */}
      <div className="max-w-screen">
        {/* Hero content */}
        <div className="pt-36 px-4 md:px-0 mx-auto md:max-w-3xl">
          {/* Section header */}
          <div className="text-center md:h-72">
            <h1
              className="text-4xl md:text-6xl font-extrabold leading-tight md:leading-tighter tracking-tighter text-white"
              data-aos="zoom-y-out"
            >
              Servis Gratis{" "}
            </h1>
            <h1
              className="text-4xl md:text-6xl font-extrabold "
              data-aos="zoom-y-out"
            >
              <span
                style={{ textShadow: "1px 1px 0px white, 1px 1px 0px white" }}
              >
                <span style={{ color: "black" }}>R</span>
                <span className="text-black" style={{ color: "blue" }}>
                  AFA
                </span>
                <br />
                <span className="" style={{ color: "red" }}>
                  ELECTRONICS
                </span>
              </span>
            </h1>
            <div className="max-w-md mx-auto">
              <p
                className="text-lg text-white mb-3 mt-6"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Dalam rangka Grand Opening RafaElektronik, Kami memberikan
                layanan servis gratis untuk 100 orang pertama yang mendaftar,
                silahkan isi formulir dibawah untuk mendapatkan layanan servis
                gratis.
              </p>
              <Button
                variant="outline-secondary"
                className="text-white mt-3 md:mt-6 w-full md:w-auto"
                onClick={() => {
                  setOpenAdd(true);
                }}
              >
                Daftar Sekarang
              </Button>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center mt-6"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              ></div>
            </div>
          </div>

          <section className=" mb-3 mt-3 text-center">
            <Marquee gradient={false} speed={70}>
              <img
                src="/backend/public/gambar/philips.png"
                alt="Partner 1"
                height={100}
                width={200}
              />
              <img
                src="/backend/public/gambar/maspion.png"
                alt="Partner 2"
                height={100}
                width={100}
              />
              <img
                src="/backend/public/gambar/changhong.png"
                alt="Partner 3"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/sharp.png"
                alt="Partner 4"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/panasonic.png"
                alt="Partner 6"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/lg.png"
                alt="Partner 9"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/toshiba.png"
                alt="Partner 10"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/modena.png"
                alt="Partner 13"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/paloma.webp"
                alt="Partner 14"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/daikin.svg"
                alt="Partner 15"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/gree.svg"
                alt="Partner 16"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/midea.png"
                alt="Partner 17"
                height={100}
                width={100}
                className="mr-5"
              />
              <img
                src="/backend/public/gambar/yongma.webp"
                alt="Partner 17"
                height={100}
                width={100}
                className="mr-5"
              />
            </Marquee>
          </section>

          {/* Hero image */}
          <Dialog
            open={openAdd}
            onClose={() => {
              setOpenAdd(false);
            }}
            className="w-96"
          >
            <Dialog.Panel>
              <Dialog.Title className="flex flex-col justify-start text-left items-start">
                <h1 className="text-2xl font-bold text-gray-600 mb-5">
                  Formulir Pendaftaran
                </h1>
                <div
                  className="flex p-4  text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Ketentuan:</span>
                    <ul className="mt-1.5 list-disc ">
                      <li>
                        Domisili Tanggul, Semboro, Umbulsari, Sumberbaru, Dan
                        Bangsalsari.
                      </li>
                      <li>Hanya bisa servis Merk yang tersedia</li>
                    </ul>
                  </div>
                </div>
              </Dialog.Title>
              <form action="" className="mt-3" onSubmit={handleSubmit}>
                <Dialog.Description>
                  <div className="mb-5 cols-span-12">
                    <label className="block mb-2 font-bold text-gray-600">
                      Nama
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="nama"
                      placeholder="Masukan Nama sesuai KTP"
                      className="border border-gray-300 shadow p-3 w-full rounded mb-"
                      onChange={handleChange}
                      value={formData.nama}
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-600">
                      Nomor Telepon
                    </label>
                    <input
                      type="number"
                      id="twitter"
                      name="nomor_telepon"
                      placeholder="Masukan Nomor Telepon"
                      className="border border-gray-300  shadow p-3 w-full rounded mb-"
                      onChange={handleChange}
                      value={formData.nomor_telepon}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-600">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="alamat"
                      placeholder="Alamat Lengkap Sesuai KTP"
                      className="border border-gray-300  shadow p-3 w-full rounded mb-"
                      onChange={handleChange}
                      value={formData.alamat}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-600">
                      Jenis Barang Elektronik
                    </label>
                    <input
                      type="text"
                      placeholder="TV, AC, Mesin Cuci"
                      className="border border-gray-300  shadow p-3 w-full rounded mb-"
                      name="jenis"
                      onChange={handleChange}
                      value={formData.jenis}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-600">
                      Merk
                    </label>
                    <select
                      id="countries"
                      name="merk"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={handleChange}
                      value={formData.merk}
                    >
                      <option>Pilih Merk</option>
                      <option value="Sharp">Sharp</option>
                      <option value="LG">LG</option>
                      <option value="Panasonic">Panasonic</option>
                      <option value="Toshiba">Toshiba</option>
                      <option value="Daikin">Daikin</option>
                      <option value="Miyako">Miyako</option>
                      <option value="Paloma">Paloma</option>
                      <option value="Modena">Modena</option>
                      <option value="Akari">Akari</option>
                      <option value="Maspion">Maspion</option>
                      <option value="Philips">Philips</option>
                      <option value="Sanyo">Sanyo</option>
                      <option value="Sanken">Sanken</option>
                      <option value="COSMOS">COSMOS</option>
                      <option value="Midea">Midea</option>
                      <option value="YongMa">YongMa</option>
                      <option value="Gree">Gree</option>
                      <option value="Artugo">Artugo</option>
                      <option value="RINNAI">RINNAI</option>
                      <option value="ROADMASTER">ROADMASTER</option>
                      <option value="AUX">AUX</option>
                      <option value="TURBO">TURBO</option>
                      <option value="FRIGIGATE">FRIGIGATE</option>
                      <option value="SHIMIZU">SHIMIZU</option>
                      <option value="HINSENSE">HINSENSE</option>
                      <option value="GEA-RSA-GETRA">GEA-RSA-GETRA</option>
                      <option value="Mitshubisi">Mitshubisi</option>
                      <option value="Kirin">Kirin</option>
                      <option value="Ariston">Ariston</option>
                      <option value="Sanyo">Sanyo</option>
                    </select>
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-600">
                      Seri atau Tipe
                    </label>
                    <input
                      type="text"
                      id="message"
                      name="seri"
                      placeholder="Seri atau Tipe"
                      className="border border-gray-300  shadow p-3 w-full rounded mb-"
                      onChange={handleChange}
                      value={formData.seri}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-bold text-gray-600">
                      Keluhan atau Deskripsi Kerusakan
                    </label>
                    <input
                      type="text"
                      id="message"
                      name="keluhan"
                      placeholder="AC Bunyi berisik dan tidak dingin"
                      className="border border-gray-300  shadow p-3 w-full rounded mb-"
                      onChange={handleChange}
                      value={formData.keluhan}
                    />
                  </div>

                  {isMutating ? (
                    <button
                      className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg"
                      type="submit"
                      disabled
                    >
                      Loading...
                    </button>
                  ) : (
                    <button
                      className="block w-full bg-blue-500 text-white font-bold p-4 rounded-lg"
                      type="submit"
                    >
                      Kirim Permohonan
                    </button>
                  )}
                </Dialog.Description>
              </form>
            </Dialog.Panel>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
