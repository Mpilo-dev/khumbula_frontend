import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../redux/features/authSlice";
import { CustomText, PrimaryButton, TextInputField } from "../elements";
import { BUTTON_TYPES } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPasswordValidation } from "../helpers/types";
import { AppDispatch } from "../redux/store";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

const ResetPasswordPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { phoneNumber, otp } = location.state || {};

  const methods = useForm<ResetPasswordFormData>({
    resolver: yupResolver(ResetPasswordValidation),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!phoneNumber || !otp) {
      setErrorMessage("Phone number or OTP is missing. Please try again.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await dispatch(
        resetPassword({
          phoneNumber,
          otp,
          newPassword: data.newPassword,
        })
      ).unwrap();

      navigate("/login", {
        state: {
          message:
            "Password reset successfully. Please login with your new password.",
        },
      });
    } catch (error: any) {
      setErrorMessage(
        error.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#DEDEDE] flex flex-row justify-center items-center">
      <div className="w-[445px] h-[90%] tSM2:h-[100%] flex flex-col bg-white rounded-[14px] shadow shadow-[#E7F0EF]">
        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
          <div
            className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
            onClick={() => navigate(-1)}
          >
            <CustomText
              textLabel="Back"
              fontWeight="font-semibold"
              fontSize="text-[18px]"
              fontColor="text-black"
            />
          </div>
          <img
            src="/logo.png"
            className="w-[180px] h-auto tSM:w-[160px]"
            alt="Khumbula logo"
          />
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="w-full grow flex flex-row justify-center items-center"
          >
            <div className="w-full h-fit flex flex-col justify-between items-center gap-y-[20px] px-[28px]">
              <div className="w-[100%] h-auto">
                <div className="w-full h-auto flex flex-col items-center gap-y-6 mLG:gap-y-3">
                  <div className="w-full h-auto flex flex-col items-center gap-y-[0]">
                    <CustomText
                      textLabel="Set your new password"
                      fontWeight="font-regular"
                      fontSize="text-[22px]"
                      fontColor="text-black"
                    />
                  </div>

                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="newPassword"
                      label="New Password"
                      type="password"
                      hideLabel={false}
                    />
                  </div>

                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      hideLabel={false}
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="text-red-500 text-center">{errorMessage}</div>
              )}

              <div className="w-full h-auto pt-[30px]">
                <PrimaryButton
                  label={isLoading ? "Resetting..." : "Reset Password"}
                  type={BUTTON_TYPES.submit}
                  buttonType={PRIMARY_BUTTON_TYPE.primary}
                  loading={isLoading}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
