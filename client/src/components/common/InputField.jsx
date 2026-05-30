import React, { useState } from "react";

const InputField = ({ label, name, placeholder, value, onChange, type, required }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex flex-col gap-2 ">
      <label htmlFor={name} className="font-medium">
        {label}
      </label>
      <div className="relative rounded-md border-2 border-gray-300 p-2 transition-all focus-within:border-black focus-within:ring-4 focus-within:ring-blue-200">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : (type || "text")
          }
          name={name}
          className="outline-none w-full"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {type === "password" ? (
          <button
            className="absolute right-2 top-2 "
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            type="button"
          >
            {/* {showPassword ? (
              <Icons.EyeOn size={22} />
            ) : (
              <Icons.Eyeoff size={22} /> */}
            {/* )} */}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default InputField;
