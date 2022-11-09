import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../features/Auth/authApiSlice";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const EmailVerificationConfirmation = () => {
  const { id, token } = useParams();
  console.log(id, token);

  const navigate = useNavigate();

  const [verifyEmail, { isLoading, isError, isSuccess }] =
    useVerifyEmailMutation();

  useEffect(() => {
    verifyEmail({ userId: id, token });
  }, [id, token, verifyEmail]);

  useEffect(() => {
    if (isSuccess) {
      console.log("Email verified successfully");
      toast.success("Email verified successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [isSuccess, navigate]);

  return (
    <section className="flex items-center justify-center my-24">
      <div className="container px-4 mx-auto">
        <div className="relative max-w-lg px-6 pt-16 pb-16 mx-auto bg-gray-500 md:px-10 lg:px-16 rounded-xl">
          <div className="relative max-w-md mx-auto text-center">
            {isLoading && (
              <div>
                <h1 className="mb-2 text-2xl font-semibold text-gray-100">
                  Verifying Email
                </h1>
                <p className="mb-10 font-medium text-gray-300">
                  Please wait while we verify your email
                </p>
                <ClipLoader
                  color={"#123abc"}
                  loading={isLoading}
                  css={override}
                  size={50}
                />
              </div>
            )}

            {isError && (
              <div>
                <h1 className="mb-2 text-2xl font-semibold text-gray-100">
                  Verification Failed
                </h1>
                <p className="mb-10 font-medium text-gray-300">
                  Sorry, we were unable to verify your email. Please try again
                  later.
                </p>
              </div>
            )}

            {isSuccess && (
              <div>
                <h1 className="mb-2 text-2xl font-semibold text-gray-100">
                  Verification Successful
                </h1>
                <p className="mb-10 font-medium text-gray-300">
                  Your email has been verified. You will be redirected to the
                  login page shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailVerificationConfirmation;
