import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { auth } from "../services/firebase";

function Login({ handleClose, setType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailLabelTop, setEmailLabelTop] = useState(false);
  const [passwordLabelTop, setPasswordLabelTop] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    if (e) e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => handleClose())
      .catch((ex) => {
        alert(ex);
      });
  };

  return (
    <main className="py-7 px-6">
      <h1 className="text-[#222222] font-semibold text-2xl">
        Log in to Airbnb
      </h1>
      <div className="mt-7 flex flex-col">
        <div
          className={`input-container ${!errors.email && "border-b-0"} ${
            errors.email ? "border-[#cc5c42]" : ""
          } ${
            errors.email ? (emailLabelTop ? "border-2" : "bg-[#fef7f5]") : ""
          }`}
        >
          <label
            htmlFor="email"
            className={`absolute text-[#757575] transition-all duration-150 left-3 top-1/2 translate-y-[-50%] ${
              (emailLabelTop || email || errors.email) &&
              "text-xs top-1 translate-y-0"
            } ${errors.email ? "text-[#c44224] font-bold" : ""}
          `}
          >
            Email
          </label>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailLabelTop(true)}
            onBlur={() => setEmailLabelTop(false)}
            id="email"
            type="text"
            className={`input-log ${
              errors.email ? (emailLabelTop ? "" : "bg-[#fef7f5]") : ""
            }`}
          />
        </div>
        {errors.email && (
          <span className="flex items-center space-x-1 my-2">
            <ExclamationCircleIcon className="h-6 relative text-[#c03515]" />{" "}
            <span className="text-[#c13515]">{errors.email}</span>
          </span>
        )}
        <div
          className={`input-container ${
            errors.password ? "border-[#cc5c42]" : ""
          } ${
            errors.password
              ? passwordLabelTop
                ? "border-2"
                : "bg-[#fef7f5]"
              : ""
          }`}
        >
          <label
            htmlFor="password"
            className={`absolute text-[#757575] transition-all duration-150 left-3 top-1/2 translate-y-[-50%] ${
              (passwordLabelTop || password || errors.password) &&
              "text-xs top-1 translate-y-0"
            } ${errors.password ? "text-[#c44224] font-bold" : ""}
          `}
          >
            Password
          </label>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogin();
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordLabelTop(true)}
            onBlur={() => setPasswordLabelTop(false)}
            id="password"
            type={showPassword ? "text" : "password"}
            className={`input-log ${
              errors.password ? (passwordLabelTop ? "" : "bg-[#fef7f5]") : ""
            }`}
          />
          {showPassword ? (
            <EyeOffIcon
              className={`h-5 cursor-pointer ${
                errors.password ? "text-[#c13515]" : ""
              }`}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeIcon
              className={`h-5 cursor-pointer ${
                errors.password ? "text-[#c13515]" : ""
              }`}
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
        {errors.password && (
          <span className="flex items-center space-x-1 mt-2">
            <ExclamationCircleIcon className="h-6 relative text-[#c03515]" />{" "}
            <span className="text-[#c13515]">{errors.password}</span>
          </span>
        )}
        <button
          onClick={handleLogin}
          className="text-white mt-5 bg-[#dc1063] rounded-lg px-4 py-3.5 w-full font-semibold text-[17px] continue-btn active:scale-95 transition-all duration-100"
        >
          Continue
        </button>
        <span className="text-center text-gray-500 font-semibold my-3 ">
          Not a user?{"  "}
          <span
            onClick={() => setType("signup")}
            className="underline text-slate-900 cursor-pointer"
          >
            Sign up
          </span>
        </span>
      </div>
    </main>
  );
}

export default Login;
