import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../features/Auth/authApiSlice";
import { setCredentials } from "../../features/Auth/authSlice";
import { validateLoginForm } from "../../utils/Validators";
import * as Yup from "yup";
import FormInput from "../../components/shared/FormInput";
import { Link } from "react-router-dom";

const Login = () => {
  const [isFormValid, setIsFormValid] = useState(false);

  const [login] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      try {
        const userData = await login(values).unwrap();
        console.log("userData", userData);

        dispatch(
          setCredentials({ accessToken: userData.token, user: userData.user })
        );

        if (userData) {
          toast.success("Login successful, redirecting to dashboard...");
        }

        values.email = "";
        values.password = "";

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } catch (err) {
        console.log("err", err);
        toast.error("Login failed. Invalid Credentials.");
      }
    },
  });

  useEffect(() => {
    if (validateLoginForm(formik.values)) {
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
                Log in to your account
              </h2>
              <p className="font-medium text-gray-300">
                Welcome back! Please enter your details.
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

              <div className="flex flex-wrap items-center justify-between mt-6 mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <input id="signInInput1-3" type="checkbox" />
                  <label
                    className="ml-2 text-xs font-semibold text-gray-300"
                    htmlFor="signInInput1-3"
                  >
                    Remember for 30 days
                  </label>
                </div>
                <div className="w-full sm:w-auto">
                  <Link
                    to="/forgot-password"
                    className="inline-block text-xs font-semibold text-blue-500 hover:text-blue-600"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
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
                Sign In
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
              <p className="font-medium">
                <span className="text-gray-300">Don’t have an account?</span>
                <a
                  className="inline-block text-blue-500 hover:underline"
                  href="#"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
