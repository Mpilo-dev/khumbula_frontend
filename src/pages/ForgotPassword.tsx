import React, { useState } from "react";
import Logo from "/logo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../redux/features/authSlice";
import {
  BackButton,
  CustomText,
  PrimaryButton,
  TextInputField,
} from "../elements";
import { BUTTON_TYPES } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ForgotPasswordValidation } from "../helpers/types";

const ForgotPasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordValidation),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: { phoneNumber: string }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await dispatch(forgotPassword(data.phoneNumber)).unwrap();
      navigate("/phone-otp", {
        state: {
          phoneNumber: data.phoneNumber,
          purpose: "resetPassword",
        },
      });
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send OTP. Please try again.");
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
            <BackButton
              textLabel={"Back"}
              fontWeight="font-semibold"
              fontSize="text-[18px]"
              fontColor={`text-black`}
              hideText={false}
            />
          </div>
          <img
            src={Logo}
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
                      textLabel={"Enter your phone number to receive"}
                      fontWeight="font-regular"
                      fontSize="text-[22px]"
                      fontColor={`text-black`}
                    />
                    <CustomText
                      textLabel={"Password reset OTP"}
                      fontWeight="font-regular"
                      fontSize="text-[22px]"
                      fontColor={`text-black`}
                    />
                  </div>

                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="phoneNumber"
                      label="Phone number"
                      type="tel"
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
                  label={isLoading ? "Sending..." : "Continue"}
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

export default ForgotPasswordPage;
