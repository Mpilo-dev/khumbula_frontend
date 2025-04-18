import React, { useState, useEffect } from "react";
import Logo from "/logo.png";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/features/authSlice";
import { BackButton, PrimaryButton, TextInputField } from "../elements";
import { BUTTON_TYPES, RegisterValidation } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppDispatch } from "../redux/store";

type RegisterItem = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: Date;
  phoneNumber: string;
};

type RegisterApiData = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
};

const RegisterDefaultValues: RegisterItem = {
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  gender: "Other",
  dateOfBirth: new Date(),
  phoneNumber: "",
};

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Load saved form data from localStorage
  const loadSavedFormData = (): RegisterItem => {
    const savedData = localStorage.getItem("registerFormData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return {
          ...RegisterDefaultValues,
          ...parsedData,
          dateOfBirth: new Date(parsedData.dateOfBirth),
        };
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        return RegisterDefaultValues;
      }
    }
    return RegisterDefaultValues;
  };

  const methods = useForm<RegisterItem>({
    resolver: yupResolver(RegisterValidation),
    defaultValues: loadSavedFormData(),
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem("registerFormData", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  const customHandleSubmit = async (dataResults: RegisterItem, e?: any) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Convert RegisterItem to RegisterApiData
      const apiData: RegisterApiData = {
        firstName: dataResults.firstName,
        lastName: dataResults.lastName,
        userName: dataResults.userName,
        password: dataResults.password,
        gender: dataResults.gender,
        dateOfBirth: dataResults.dateOfBirth.toISOString(),
        phoneNumber: dataResults.phoneNumber,
      };

      const resultAction = await dispatch(registerUser(apiData));

      if (registerUser.fulfilled.match(resultAction)) {
        // Clear saved form data on successful submission
        localStorage.removeItem("registerFormData");
        console.log("Registration successful, navigating to OTP page");
        navigate("/phone-otp", {
          state: {
            phoneNumber: dataResults.phoneNumber,
            purpose: "phoneVerification",
          },
        });
      } else {
        console.error("Registration failed:", resultAction.payload);
        setErrorMessage(resultAction.payload as string);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Something went wrong. Please try again.");
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
              textLabel="Back"
              fontWeight="font-semibold"
              fontSize="text-[18px]"
              fontColor="text-black"
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
            onSubmit={methods.handleSubmit(customHandleSubmit)}
            className="w-full grow flex flex-col justify-start items-center overflow-y-auto"
          >
            <div className="w-full h-fit flex flex-col justify-start items-center gap-y-[20px] px-[28px] py-[20px]">
              <div className="w-[100%] h-auto">
                <div className="w-full h-auto flex flex-col items-center gap-y-4">
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="firstName"
                      label="First Name"
                      type="text"
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="lastName"
                      label="Last Name"
                      type="text"
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="userName"
                      label="Username"
                      type="text"
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="password"
                      label="Password"
                      type="password"
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="gender"
                      label="Gender"
                      type="text"
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="dateOfBirth"
                      label="Date of Birth"
                      type="date"
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name="phoneNumber"
                      label="Phone Number"
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
                  label={isLoading ? "Registering..." : "Register"}
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

export default RegisterPage;
