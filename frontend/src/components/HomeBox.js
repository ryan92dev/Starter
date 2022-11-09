import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, themeSelect } from "../features/Theme/themeSlice";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "../features/Auth/authSlice";
import { HiLightBulb, HiOutlineLightBulb } from "react-icons/hi";
import { Link } from "react-router-dom";

const HomeBox = ({ pageName }) => {
  const { theme } = useSelector(themeSelect);
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);

  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="flex flex-col w-1/2 h-auto rounded-lg bg-secondary">
      <div className="p-4">
        <div className="relative flex justify-between ">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-bold text-primary">{pageName}</h1>
            <p className="text-sm text-tertiary">
              {pageName === "Home Page" ? "(Public)" : "(Protected)"}
            </p>
          </div>
          <div>
            <button onClick={toggle}>
              {theme === "dark" ? (
                <HiOutlineLightBulb className="text-2xl text-primary" />
              ) : (
                <HiLightBulb className="text-2xl text-primary" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-4 mx-4 mt-4 border-t">
          <p className="text-xl font-semibold text-primary">
            Hi {currentUser ? currentUser.user.username : "Guest"}!
          </p>
          <p className="pt-2 text-sm text-tertiary">
            This is a simple boilerplate for a MERN stack application. It uses
            Redux Toolkit for state management and Tailwind CSS for styling.
          </p>
        </div>

        <div className="pt-4 mx-4 mt-4 ">
          <p className="text-xl font-semibold text-primary">Features</p>
          <ul className="grid grid-cols-3 p-2 pt-2 border text-secondary">
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              Redux Toolkit
            </li>
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              Tailwind CSS
            </li>
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              React Router
            </li>
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              React Icons
            </li>
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              React Toastify
            </li>
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              Formik
            </li>
            <li className="p-1 mx-2 my-1 text-sm rounded-lg al bg-tertiary text-primary">
              Yup
            </li>
          </ul>
        </div>

        <div className="flex flex-col pt-4 mx-4 mt-4">
          <p className="mb-2 text-xs tracking-wider text-primary">
            Log In to get a token
          </p>

          <p className="text-xl font-semibold text-primary">
            Token:{" "}
            <span className="text-xs font-semibold leading-tight tracking-wide text-blue-600 break-words ">
              {" "}
              {currentToken ? currentToken : "No token"}
            </span>
          </p>
        </div>

        <div className="flex justify-between pt-4 mt-4 ">
          <div>
            <Link
              to={pageName === "Home Page" ? "/protected" : "/"}
              className="flex items-center gap-2"
            >
              <p>Back To : </p>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg text-button-text bg-button-primary">
                {pageName === "Home Page" ? "Protected Page" : "Home Page"}
              </button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Link
              to="/login"
              className="flex items-center justify-center w-32 px-4 py-2 rounded-full bg-button-primary text-button-text hover:bg-button-hover hover:text-white"
            >
              <p>Login</p>
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center w-32 px-4 py-2 border rounded-full border-slate-900 text-primary"
            >
              <p>Register</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBox;
