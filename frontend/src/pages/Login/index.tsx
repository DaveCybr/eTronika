import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import Api from "../../../api";
import Alert from "../../base-components/Alert";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";

export const Main = () => {
  const navigate = useNavigate();

  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { login, authToken } = useAuth();

  useEffect(() => {
    if (authToken) {
      navigate("/dashboard");
    }
  }, [authToken, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMutating(true);

    try {
      const response = await axios.post(`${Api}/api/login`, {
        username,
        password,
      });

      login(response.data);
      navigate("/dashboard");
    } catch (error) {
      setIsMutating(false);
      setError("Invalid username or password");
    }
  };
  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <DarkModeSwitcher />
        <MainColorSwitcher />
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <Link
                to="/"
                className={clsx([
                  "-intro-x hidden md:flex",
                  "bg-white rounded-md p-1.5 xl:max-w-44 shadow-md dark:bg-darkmode-600/30",
                ])}
              >
                <img
                  className="w-10"
                  src={`${Api}/gambar/RAFA_ELEKTRONIC.png`}
                />
                <span
                  className={clsx([
                    "ml-3 text- max-w-2 text-primary font-medium dark:text-primary/80",
                  ])}
                >
                  {" "}
                  RAFA ELECTRONICS{" "}
                </span>
              </Link>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                  Selamat Datang <br />
                  di ElectroCare Logbook
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Aplikasi POS dan Pencatat Servis Elektronik
                </div>
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <form className="user" onSubmit={handleLogin}>
                  <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                    Sign In
                  </h2>
                  {error && (
                    <Alert
                      variant="soft-danger"
                      className="flex items-center mt-2"
                    >
                      {({ dismiss }) => (
                        <>
                          <Lucide
                            icon="AlertOctagon"
                            className="w-6 h-6 mr-2"
                          />{" "}
                          <span>{error}</span>
                          <Alert.DismissButton
                            type="button"
                            className="btn-close"
                            onClick={dismiss}
                            aria-label="Close"
                          >
                            <Lucide icon="X" className="w-4 h-4" />
                          </Alert.DismissButton>
                        </>
                      )}
                    </Alert>
                  )}
                  <div className="mt-6 intro-x">
                    <FormInput
                      type="text"
                      className="block px-4 py-3 intro-x min-w-full xl:min-w-[350px]"
                      placeholder="Username"
                      value={username}
                      name="username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormInput
                      type="password"
                      className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                      placeholder="Password"
                      value={password}
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mt-5 text-center intro-x xl:mt-5 xl:text-left">
                    {isMutating ? (
                      <Button
                        variant="primary"
                        type="button"
                        className="w-30"
                        disabled
                      >
                        Login
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
                        onClick={handleLogin}
                        className="w-20"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </form>
                <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                  By signin up, you agree to our{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Terms and Conditions
                  </a>{" "}
                  &{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
