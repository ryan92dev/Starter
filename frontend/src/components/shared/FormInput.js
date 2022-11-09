import React from "react";

const FormInput = ({
  labelName,
  name,
  type,
  required,
  value,
  setValue,
  formik,
  error,
  handleBlur,
  touched,
}) => {
  return (
    <div>
      <div className="relative w-full px-3 py-4 mt-6 border border-gray-400 rounded-lg h-14 hover:border-white focus-within:border-green-500">
        <span className="absolute bottom-full left-0 ml-3 -mb-1 transform translate-y-0.5 text-xs font-semibold text-gray-300 px-1 bg-gray-500">
          {labelName + (required ? " *" : "")}
        </span>
        <input
          id={name.toLowerCase()}
          type={type}
          value={value}
          onChange={setValue}
          required={required}
          onBlur={handleBlur}
          className="block w-full text-sm font-medium text-gray-100 placeholder-gray-300 bg-transparent outline-none focus:outline-none focus:bg-transparent focus:ring-0 webkit-appearance-none "
        />
      </div>
      {touched && error ? (
        <span className="text-xs font-semibold text-red-500 ">{error}</span>
      ) : null}
    </div>
  );
};

export default FormInput;
