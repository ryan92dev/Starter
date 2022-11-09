import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import FormInput from "../../components/shared/FormInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validatePassword } from "../../utils/Validators";
import { useResetPasswordMutation } from "../../features/Auth/authApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PasswordReset = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { token, id } = useParams();

  const [resetPassword] = useResetPasswordMutation();

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },

    validationSchema: Yup.object({
      new_password: Yup.string()
        .min(6, "Password Must be at lease 6 characters")
        .max(20)
        .required("Required"),
      // confirm_password: Yup.string().min(6).max(20).required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await resetPassword({
          newPassword: values.new_password,
          token,
          userId: id,
        }).unwrap();
        console.log("response", response);

        if (response.success) {
          toast.success("Password reset successful, redirecting to login...");
        }
        values.email = "";
        values.password = "";
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        console.log("err", err);
        toast.error(err.data.error);
      }
    },
  });

  useEffect(() => {
    if (formik.values.new_password !== formik.values.confirm_password) {
      setIsFormValid(false);
      setMatchError(true);
      setErrorMessage("Passwords do not match");
    } else {
      setMatchError(false);
      setErrorMessage("");
      if (
        validatePassword(formik.values.new_password) &&
        validatePassword(formik.values.confirm_password)
      ) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    }
  }, [formik.values]);
  return (
    <section className="my-24">
      <div className="px-4 mx-auto">
        <div className="relative max-w-lg px-6 py-16 mx-auto bg-gray-500 md:px-10 lg:px-16 rounded-xl">
          <div className="relative max-w-md mx-auto">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-semibold text-gray-100">
                Reset Password
              </h2>
              <p className="font-medium text-gray-300">
                Please enter a new password
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <FormInput
                labelName="New Password"
                name="new_password"
                required={true}
                type="password"
                value={formik.values.new_password}
                setValue={formik.handleChange}
                formik={formik}
                error={formik.errors.new_password}
                handleBlur={formik.handleBlur}
                touched={formik.touched.new_password}
              />
              <FormInput
                labelName="Confirm Password"
                name="confirm_password"
                required={true}
                type="password"
                value={formik.values.confirm_password}
                setValue={formik.handleChange}
                formik={formik}
                error={formik.errors.confirm_password}
                handleBlur={formik.handleBlur}
                touched={formik.touched.confirm_password}
              />
              {matchError ? (
                <span className="text-xs font-semibold text-red-500 ">
                  {errorMessage}
                </span>
              ) : (
                ""
              )}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`mt-6 block w-full py-4 mb-4 leading-6 text-white font-semibold
              ${
                isFormValid
                  ? " bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-200"
                  : "bg-blue-500 opacity-50 cursor-not-allowed"
              }`}
              >
                Submit
              </button>
            </form>

            {/* <ClipLoader
            color={"#123abc"}
            // loading={isLoading}
            css={override}
            size={50}
          /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordReset;
