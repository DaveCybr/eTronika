import { Transition } from "react-transition-group";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { selectSimpleMenu } from "../../stores/simpleMenuSlice";
import { useAppSelector } from "../../stores/hooks";
import { FormattedMenu, linkTo, nestedMenu } from "../SimpleMenu/simple-menu";
import TopBar from "../../components/TopBar";
import MobileMenu from "../../components/MobileMenu";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import { useAuth } from "../../auth/authContext";
import clsx from "clsx";

function Main() {
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const simpleMenuStore = useAppSelector(selectSimpleMenu);
  const simpleMenu = () => nestedMenu(simpleMenuStore, location);

  useEffect(() => {
    setFormattedMenu(simpleMenu());
  }, [simpleMenuStore, location.pathname]);

  const { authToken } = useAuth();

  if (!authToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className="py-5 md:py-0">
      <Outlet />
    </div>
  );
}

export default Main;
