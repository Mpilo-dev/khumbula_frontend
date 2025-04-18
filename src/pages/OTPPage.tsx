import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../redux/features/authSlice";
import { CustomText, PrimaryButton, TextInputField } from "../elements";
import { BUTTON_TYPES } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VerifyOtpValidation } from "../helpers/types";
import { AppDispatch } from "../redux/store";

type OTPPurpose = "phoneVerification" | "resetPassword";

const OTPPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { phoneNumber, purpose } =
    (location.state as { phoneNumber: string; purpose: OTPPurpose }) || {};

  console.log("OTP Page - Location state:", { phoneNumber, purpose });

  const methods = useForm({
    resolver: yupResolver(VerifyOtpValidation),
    defaultValues: {
      phoneNumber: phoneNumber || "",
      otp: "",
    },
  });

  const onSubmit = async (data: { phoneNumber: string; otp: string }) => {
    console.log("Submitting OTP verification:", {
      phoneNumber: data.phoneNumber,
      purpose,
      otp: data.otp,
    });

    if (!data.phoneNumber || !purpose) {
      console.error("Missing required data:", {
        phoneNumber: data.phoneNumber,
        purpose,
      });
      setErrorMessage("Phone number or purpose is missing. Please try again.");
      return;
    }

    if (!data.otp) {
      console.error("OTP is missing");
      setErrorMessage("Please enter the OTP code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Dispatching verifyOtp action with:", {
        phoneNumber: data.phoneNumber,
        otp: data.otp,
        purpose,
      });

      const result = await dispatch(
        verifyOtp({
          phoneNumber: data.phoneNumber,
          otp: data.otp,
          purpose,
        })
      ).unwrap();

      console.log("OTP verification result:", result);

      if (result.data?.status === "success") {
        if (purpose === "resetPassword") {
          navigate("/reset-password", {
            state: { phoneNumber: data.phoneNumber, otp: data.otp },
          });
        } else if (purpose === "phoneVerification") {
          navigate("/dashboard");
        }
      } else {
        console.error("OTP verification failed:", result.data);
        setErrorMessage(result.data?.message || "OTP verification failed");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrorMessage(error.message || "Invalid OTP. Please try again.");
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
                      textLabel="Enter the OTP sent to"
                      fontWeight="font-regular"
                      fontSize="text-[22px]"
                      fontColor="text-black"
                    />
                    <CustomText
                      textLabel={
                        phoneNumber
                          ? `******${phoneNumber.slice(-4)}`
                          : "your phone number"
                      }
                      fontWeight="font-regular"
                      fontSize="text-[22px]"
                      fontColor="text-black"
                    />
                  </div>

                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="otp"
                      label="OTP"
                      type="text"
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
                  label={isLoading ? "Verifying..." : "Verify"}
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

export default OTPPage;
