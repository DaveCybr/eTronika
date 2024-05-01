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

export interface TopMenuState {
  menu: Array<Menu>;
}

const initialState: TopMenuState = {
  menu: [
    {
      icon: "Home",
      pathname: "/top-menu/dashboard",
      title: "Dashboard",
    },
    {
      icon: "Activity",
      title: "Master Data",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/top-menu/master/barang",
          title: "Barang",
        },
        {
          icon: "Activity",
          pathname: "/top-menu/master/supplier",
          title: "Supplier",
        },
      ],
    },
  ],
};

export const topMenuSlice = createSlice({
  name: "topMenu",
  initialState,
  reducers: {},
});

export const selectTopMenu = (state: RootState) => state.topMenu.menu;

export default topMenuSlice.reducer;
