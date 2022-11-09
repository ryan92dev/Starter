import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import FormInput from "../../components/shared/FormInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { validateMail } from "../../utils/Validators";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../../features/Auth/authApiSlice";
import { Link } from "react-router-dom";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const ForgotPassword = () => {
  const [isFormValid, setIsFormValid] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const response = await forgotPassword(values).unwrap();
        console.log("response", response);

        toast.success(
          "Password reset link sent to your email, please use it to reset your password"
        );

        // if (userData) {
        //   toast.success("Login successful, redirecting to dashboard...");
        // }
        // values.email = "";
        // values.password = "";
        // setTimeout(() => {
        //   navigate("/dashboard");
        // }, 3000);

        values.email = "";
        setIsFormValid(false);
      } catch (err) {
        console.log("err", err);
        toast.success("Reset password link sent to your email");

        values.email = "";
        setIsFormValid(false);
      }
    },
  });

  useEffect(() => {
    if (validateMail(formik.values.email)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [formik.values]);
  return (
    <section className="my-24">
      <div className="px-4 mx-auto">
        <div className="relative max-w-lg px-6 py-16 mx-auto bg-gray-500 md:px-10 lg:px-16 rounded-xl">
          <div className="relative max-w-md mx-auto">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-semibold text-gray-100">
                Forgot Password
              </h2>
              <p className="font-medium text-gray-300">
                Please enter your email address. You will receive a link to
                create a new password via email.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
              <FormInput
                labelName="Email"
                name="Email"
                required={true}
                type="email"
                value={formik.values.email}
                setValue={formik.handleChange}
                formik={formik}
                error={formik.errors.email}
                handleBlur={formik.handleBlur}
                touched={formik.touched.email}
              />
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
              <div className="flex justify-center w-full">
                <p className="font-medium">
                  <span className="text-gray-300">Click here to go to </span>{" "}
                  <Link
                    className="inline-block text-blue-500 hover:underline"
                    to="/login"
                  >
                    Login
                  </Link>
                  {"  "}
                  <span className="text-gray-300"> page</span>
                </p>
              </div>
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

export default ForgotPassword;
