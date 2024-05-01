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

export interface SimpleMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SimpleMenuState = {
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
      icon: "Coins",
      pathname: "/servisGratis",
      title: "Pengeluaran",
    },

    {
      icon: "Book",
      pathname: "/servisGratis",
      title: "Laporan",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/laporan",
          title: "Laporan Harian",
        },
        {
          icon: "Activity",
          pathname: "/laporan",
          title: "Laporan Bulanan",
        },
        {
          icon: "Activity",
          pathname: "/laporan",
          title: "Laporan Tahunan",
        },
      ],
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

export const simpleMenuSlice = createSlice({
  name: "simpleMenu",
  initialState,
  reducers: {},
});

export const selectSimpleMenu = (state: RootState) => state.simpleMenu.menu;

export default simpleMenuSlice.reducer;
