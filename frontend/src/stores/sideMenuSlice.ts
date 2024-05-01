import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      pathname: "/dashboard",
      title: "Dashboard",
    },
    {
      icon: "ListOrdered",
      pathname: "/master/product",
      title: "Pricelist",
    },
    {
      icon: "Users",
      pathname: "/master/member",
      title: "Member",
    },
    {
      icon: "Album",
      pathname: "/unit-terdaftar",
      title: "Unit Terdaftar",
    },
    {
      icon: "History",
      pathname: "/servisHistory",
      title: "History Servis",
    },
    {
      icon: "ShoppingCart",
      pathname: "/transaksi/list",
      title: "Transaksi",
    },
    {
      icon: "Package",
      pathname: "/servisGratis",
      title: "Data Pemohon",
    },
    {
      icon: "Wallet",
      pathname: "/pembayaran",
      title: "Pembayaran",
    },
    {
      icon: "BookOpen",
      pathname: "/saldo",
      title: "Saldo",
    },

    {
      icon: "Book",
      title: "Laporan",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/laporan/harian",
          title: "Laporan Harian",
        },
        {
          icon: "Activity",
          pathname: "/laporan/bulanan",
          title: "Laporan Bulanan",
        },
        {
          icon: "Activity",
          pathname: "/laporan/tahunan",
          title: "Laporan Tahunan",
        },
      ],
    },
    {
      icon: "Database",
      pathname: "/master/aset",
      title: "Aset",
    },

    // {
    //   icon: "Layers",
    //   title: "Price List",
    //   subMenu: [
    //     {
    //       icon: "Package",
    //       pathname: "/master/product",
    //       title: "Harga Servis",
    //     },
    //   ],
    // },
    // {
    //   icon: "Layers",
    //   title: "Master Data",
    //   subMenu: [
    //     {
    //       icon: "Package",
    //       pathname: "/master/product",
    //       title: "Product",
    //     },
    //     {
    //       icon: "Contact",
    //       pathname: "/master/supplier",
    //       title: "Supplier",
    //     },
    //     {
    //       icon: "Keyboard",
    //       pathname: "/master/kategori",
    //       title: "Kategori",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/master/merk",
    //       title: "Merk",
    //     },
    //     {
    //       icon: "Users",
    //       pathname: "/master/member",
    //       title: "Member",
    //     },
    //     {
    //       icon: "User",
    //       pathname: "/master/karyawan",
    //       title: "Karyawan",
    //     },
    //     {
    //       icon: "Database",
    //       pathname: "/master/aset",
    //       title: "Aset",
    //     },
    //     {
    //       icon: "FileCog",
    //       pathname: "/master/garansi",
    //       title: "Garansi",
    //     },
    //   ],
    // },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
