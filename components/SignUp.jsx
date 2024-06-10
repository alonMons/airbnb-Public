import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { auth, db } from "../services/firebase";
import Joi from "joi-browser";

function SignUp({ handleClose, setType }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailLabelTop, setEmailLabelTop] = useState(false);
  const [passwordLabelTop, setPasswordLabelTop] = useState(false);
  const [nameLabelTop, setNameLabelTop] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  const schema = {
    email: Joi.string().email().required().max(50).label("Email"),
    password: Joi.string().required().min(6).max(50).label("Password"),
    name: Joi.string().required().max(25).label("Name"),
  };

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate({ email, password, name }, schema, options);
    if (!error) return null;
    const errors1 = {};
    for (let item of error.details) {
      errors1[item.path[0]] = item.message;
    }
    return errors1;
  };

  const validateProperty = (value, type) => {
    const obj = { [type]: value };
    const schema1 = { [type]: schema[type] };
    const { error } = Joi.validate(obj, schema1);
    return error ? error.details[0].message : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors1 = validate();
    setErrors(errors1 || {});
    if (errors1) return;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        db.collection("users")
          .doc(user.uid)
          .set({
            name,
            listings: [],
            wishlist: [],
            myBookings: [],
            type: "user",
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/airbnb-clone-alon.appspot.com/o/placeholder.jpg?alt=media&token=e007530f-1b35-4605-9312-db3af5ee536b",
            joiningDate: new Date().toISOString(),
            id: user.uid,
          })
          .catch((ex) => alert(ex));
        handleClose();
      })
      .catch((ex) => {
        alert(ex);
      });
  };

  const handleChange = (value, type) => {
    const errors1 = { ...errors };
    const errorMessage = validateProperty(value, type);
    if (errorMessage) errors1[type] = errorMessage;
    else delete errors1[type];

    if (type === "email") setEmail(value);
    if (type === "password") setPassword(value);
    if (type === "name") setName(value);
    setErrors(errors1);
  };

  return (
    <main className="py-7 px-6">
      <h1 className="text-[#222222] font-semibold text-2xl">
        Welcome to Airbnb
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
              if (e.key === "Enter") handleSubmit();
            }}
            value={email}
            onChange={(e) => handleChange(e.target.value, "email")}
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
          className={`input-container  ${
            errors.password ? "border-[#cc5c42]" : "border-b-0"
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
              if (e.key === "Enter") handleSubmit();
            }}
            value={password}
            onChange={(e) => handleChange(e.target.value, "password")}
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
          <span className="flex items-center space-x-1 my-2">
            <ExclamationCircleIcon className="h-6 relative text-[#c03515]" />{" "}
            <span className="text-[#c13515]">{errors.password}</span>
          </span>
        )}
        <div
          className={`input-container ${
            errors.name ? "border-[#cc5c42]" : ""
          } ${errors.name ? (nameLabelTop ? "border-2" : "bg-[#fef7f5]") : ""}`}
        >
          <label
            htmlFor="name"
            className={`absolute text-[#757575] transition-all duration-150 left-3 top-1/2 translate-y-[-50%] ${
              (nameLabelTop || name || errors.name) &&
              "text-xs top-1 translate-y-0"
            } ${errors.name ? "text-[#c44224] font-bold" : ""}
          `}
          >
            Name
          </label>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            value={name}
            onChange={(e) => handleChange(e.target.value, "name")}
            onFocus={() => setNameLabelTop(true)}
            onBlur={() => setNameLabelTop(false)}
            id="name"
            type="text"
            className={`input-log ${
              errors.name ? (nameLabelTop ? "" : "bg-[#fef7f5]") : ""
            }`}
          />
        </div>
        {errors.name && (
          <span className="flex items-center space-x-1 mt-2">
            <ExclamationCircleIcon className="h-6 relative text-[#c03515]" />{" "}
            <span className="text-[#c13515]">{errors.name}</span>
          </span>
        )}
        <button
          onClick={handleSubmit}
          className="text-white mt-5 bg-[#dc1063] rounded-lg px-4 py-3.5 w-full font-semibold text-[17px] continue-btn active:scale-95 transition-all duration-100"
        >
          Continue
        </button>
        <span className="text-center text-gray-500 font-semibold my-2 ">
          Already a user?{"  "}
          <span
            onClick={() => setType("login")}
            className="underline text-slate-900 cursor-pointer"
          >
            Login
          </span>
        </span>
        <span className="text-xs text-gray-500">
          by clicking Continue, you agree to our our{" "}
          <span className="text-blue-600 cursor-pointer underline">
            Data use Policy
          </span>
          , and to our{" "}
          <span className="text-blue-600 cursor-pointer underline">
            Cokie Use
          </span>
          .
        </span>
      </div>
    </main>
  );
}

export default SignUp;
