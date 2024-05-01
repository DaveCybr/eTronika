import { useRoutes } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
// import SideMenu from "../layouts/SideMenu";
import TopMenu from "../layouts/TopMenu";
import Page1 from "../pages/Page1";
import Page2 from "../pages/Barang";
import Supplier from "../pages/Supplier";
import Kategori from "../pages/Kategori";
import Member from "../pages/Member";
import Login from "../pages/Login";
import UnitTerdaftar from "../pages/UnitTerdaftar";
import Servis from "../pages/Servis";
import DetailServis from "../pages/Servis/DetailServis";
import Karyawan from "../pages/Karyawan";
import Aset from "../pages/Aset";
import TeknisiDashboard from "../pages/TeknisiDashboard";
import Garansi from "../pages/Garansi";
import TransaksiList from "../pages/TransaksiList";
import Pembayaran from "../pages/Pembayaran";
import DetailTransaksi from "../pages/TransaksiList/DetailTransaksi";
import FreeServis from "../pages/FreeServis";
import ServisGratis from "../pages/FreeServis/List";
import ServisHistory from "../pages/History";
import Saldo from "../pages/Pengeluaran";
import LaporanHarian from "../pages/Laporan/LaporanHarian/LaporanHarian";
import LaporanBulanan from "../pages/Laporan/LaporanBulanan/LaporanBulanan";
import LaporanTahunan from "../pages/Laporan/LaporanTahunan/LaporanTahunan";

function Router() {
  const routes = [
    {
      path: "/dashboard",
      element: <SideMenu />,
      children: [
        {
          path: "/dashboard",
          element: <Page1 />,
        },
      ],
    },
    {
      path: "/dashboard-teknisi",
      element: <SideMenu />,
      children: [
        {
          path: "/dashboard-teknisi",
          element: <TeknisiDashboard />,
        },
      ],
    },
    {
      path: "/unit-terdaftar",
      element: <SideMenu />,
      children: [
        {
          path: "/unit-terdaftar",
          element: <UnitTerdaftar />,
        },
      ],
    },
    {
      path: "/servisGratis",
      element: <SideMenu />,
      children: [
        {
          path: "/servisGratis",
          element: <ServisGratis />,
        },
      ],
    },
    {
      path: "/servisHistory",
      element: <SideMenu />,
      children: [
        {
          path: "/servisHistory",
          element: <ServisHistory />,
        },
      ],
    },
    {
      path: "/schedule",
      element: <SideMenu />,
      children: [
        {
          path: "service",
          element: <Servis />,
        },
        {
          path: "detail-service/:id/:id_member",
          element: <DetailServis />,
        },
      ],
    },
    {
      path: "/master",
      element: <SideMenu />,
      children: [
        {
          path: "product",
          element: <Page2 />,
        },
        {
          path: "supplier",
          element: <Supplier />,
        },
        {
          path: "kategori",
          element: <Kategori />,
        },
        {
          path: "member",
          element: <Member />,
        },
        {
          path: "karyawan",
          element: <Karyawan />,
        },
        {
          path: "aset",
          element: <Aset />,
        },
        {
          path: "garansi",
          element: <Garansi />,
        },
      ],
    },
    {
      path: "/simple-menu",
      element: <SideMenu />,
      children: [
        {
          path: "dashboard",
          element: <Page1 />,
        },
        {
          path: "master/barang",
          element: <Page2 />,
        },
      ],
    },
    {
      path: "/top-menu",
      element: <TopMenu />,
      children: [
        {
          path: "dashboard",
          element: <Page1 />,
        },
        {
          path: "master/barang",
          element: <Page2 />,
        },
      ],
    },
    {
      path: "/transaksi",
      element: <SideMenu />,
      children: [
        {
          path: "list",
          element: <TransaksiList />,
        },
        {
          path: "list-detail/:id",
          element: <DetailTransaksi />,
        },
      ],
    },
    {
      path: "/",
      element: <FreeServis />,
    },
    {
      path: "/pembayaran",
      element: <SideMenu />,
      children: [
        {
          path: "/pembayaran",
          element: <Pembayaran />,
        },
      ],
    },
    {
      path: "/saldo",
      element: <SideMenu />,
      children: [
        {
          path: "/saldo",
          element: <Saldo />,
        },
      ],
    },
    {
      path: "/laporan",
      element: <SideMenu />,
      children: [
        {
          path: "harian",
          element: <LaporanHarian />,
        },
        {
          path: "bulanan",
          element: <LaporanBulanan />,
        },
        {
          path: "tahunan",
          element: <LaporanTahunan />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
