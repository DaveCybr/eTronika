import { useState, Fragment, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import Breadcrumb from "../../base-components/Breadcrumb";
import { FormInput } from "../../base-components/Form";
import { Menu, Popover } from "../../base-components/Headless";
import fakerData from "../../utils/faker";
import _ from "lodash";
import clsx from "clsx";
import { Transition } from "@headlessui/react";
import axios from "axios";
import { useAuth } from "../../auth/authContext";
import Api from "../../../api";

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const { logout, authToken, data } = useAuth();
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; path: string }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Set breadcrumbs based on the current path
    const pathSegments = location.pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbItems = pathSegments.map((segment, index) => {
      const capitalizedLabel =
        segment.charAt(0).toUpperCase() + segment.slice(1);
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      return { label: capitalizedLabel, path };
    });
    setBreadcrumbs(breadcrumbItems);
  }, [location.pathname]);

  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${Api}/api/logout`, null, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      logout(); // Call the logout function from AuthContext
      navigate("/"); // Redirect to /login on successful logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <div
        className={clsx([
          "h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700",
          props.layout == "top-menu" && "dark:md:from-darkmode-800",
          "before:content-[''] before:absolute before:h-[65px] before:inset-0 before:top-0 before:mx-7 before:bg-primary/30 before:mt-3 before:rounded-xl before:hidden before:md:block before:dark:bg-darkmode-600/30",
          "after:content-[''] after:absolute after:inset-0 after:h-[65px] after:mx-3 after:bg-primary after:mt-5 after:rounded-xl after:shadow-md after:hidden after:md:block after:dark:bg-darkmode-600",
        ])}
      >
        <div className="flex items-center h-full">
          {/* BEGIN: Logo */}
          <Link
            to="/"
            className={clsx([
              "-intro-x hidden md:flex",
              "bg-white rounded-md p-1.5 shadow-md dark:bg-darkmode-600/30",
              props.layout == "side-menu" && "xl:w-[180px]",
              props.layout == "simple-menu" && "xl:w-auto",
              props.layout == "top-menu" && "w-auto",
            ])}
          >
            <img className="w-10" src={`${Api}/gambar/RAFA_ELEKTRONIC.png`} />
            <span
              className={clsx([
                "ml-3 text- max-w-2 text-primary font-medium dark:text-primary/80",
                props.layout == "side-menu" && "hidden xl:block",
                props.layout == "simple-menu" && "hidden",
              ])}
            >
              {" "}
              RAFA ELECTRONICS{" "}
            </span>
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Breadcrumb */}
          <Breadcrumb
            light
            className={clsx([
              "h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
              props.layout != "top-menu" && "md:pl-6",
              props.layout == "top-menu" && "md:pl-10",
            ])}
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <Breadcrumb.Link
                key={index}
                to={breadcrumb.path}
                active={index === breadcrumbs.length - 1}
              >
                {breadcrumb.label}
              </Breadcrumb.Link>
            ))}
          </Breadcrumb>
          {/* END: Breadcrumb */}
          {/* BEGIN: Search */}
          <Menu>
            <Menu.Button className="block w-10 h-10 overflow-hidden rounded-full shadow-lg image-fit bg-white zoom-in intro-x">
              <img alt="Login" src={`${Api}/gambar/RAFA_ELEKTRONIC.png`} />
            </Menu.Button>
            <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <Menu.Header className="font-normal">
                <div className="font-medium">{data.name}</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  Role : Admin
                </div>
              </Menu.Header>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item className="hover:bg-white/5" onClick={handleLogout}>
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" />
                Logout
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  );
}

export default Main;
