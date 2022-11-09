import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/shared/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { validateRegisterForm } from "../../utils/Validators";
import { useRegisterMutation } from "../../features/Auth/authApiSlice";
import { setCredentials } from "../../features/Auth/authSlice";

const Register = () => {
  const [isFormValid, setIsFormValid] = useState(false);

  const [register] = useRegisterMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Must be 3 characters or more")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Must be 8 characters or more")
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const userData = await register(values).unwrap();

        dispatch(setCredentials({ ...userData, user: values.username }));

        if (userData) {
          toast.success(
            "Email verification link sent to your email, please verify your email to complete registration"
          );
        }

        values.username = "";
        values.email = "";
        values.password = "";
      } catch (err) {
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  useEffect(() => {
    if (validateRegisterForm(formik.values)) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [formik.values]);

  return (
    <>
      <section className="my-24">
        <div className="px-4 mx-auto">
          <div className="relative max-w-lg px-6 py-16 mx-auto bg-gray-500 md:px-10 lg:px-16 rounded-xl">
            <div className="relative max-w-md mx-auto">
              <div className="mb-10 text-center">
                <h2 className="mb-2 text-2xl font-semibold text-gray-100">
                  Sign up with new account
                </h2>
                <p className="font-medium text-gray-300">
                  Start your journey with us
                </p>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <FormInput
                  labelName={"Username"}
                  name="Username"
                  type="text"
                  required
                  value={formik.values.username}
                  setValue={formik.handleChange}
                  formik={formik}
                  error={formik.errors.username}
                  handleBlur={formik.handleBlur}
                  touched={formik.touched.username}
                />
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

                <FormInput
                  labelName="Password"
                  name="Password"
                  required={true}
                  type="password"
                  value={formik.values.password}
                  setValue={formik.handleChange}
                  formik={formik}
                  error={formik.errors.password}
                  handleBlur={formik.handleBlur}
                  touched={formik.touched.password}
                />
                {/* <span className="block mb-6 text-xs font-semibold text-gray-300">
                Must be at least 12 characters.
              </span> */}
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
                  Create account
                </button>
                <div
                  className="flex items-center justify-center w-full py-4 mb-6 font-semibold leading-6 text-white transition duration-200 bg-gray-600 rounded-lg hover:bg-gray-700"
                  href="#"
                >
                  <div className="w-4 rounded-sm">
                    <FcGoogle className="w-6 h-6" />
                  </div>
                  <span className="ml-4">Sign In with Google</span>
                </div>
                <p className="font-medium text-center">
                  <span className="text-gray-300">
                    Already have an acoount?
                  </span>{" "}
                  <Link
                    className="inline-block text-blue-500 hover:underline"
                    to="/login"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
