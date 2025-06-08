import React, { useState, useEffect } from "react";
import Logo from "/logo.png";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { BackButton, TextInputField } from "../elements";
import { BUTTON_TYPES, UpdateMeValidation } from "../helpers/types";
import PrimaryButton, {
  PRIMARY_BUTTON_TYPE,
} from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUserProfile } from "../redux/features/authSlice";
// import { AppDispatch } from "../redux/store";

type UpdateMeItem = {
  firstName?: string;
  lastName?: string;
  userName?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  phoneNumber?: string;
};

const ManageProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const methods = useForm<UpdateMeItem>({
    resolver: yupResolver(UpdateMeValidation),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      userName: user?.userName || "",
      gender: user?.gender || "Male",
      dateOfBirth: user?.dateOfBirth?.split("T")[0] || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      methods.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth?.split("T")[0],
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user, methods]);

  // eslint-disable-next-line
  const onError = (errors: any) => {
    console.log("Form errors:", errors);
    // setErrorMessage(errors);
    setErrorMessage("Please fix the errors in the form");
  };

  // const handleSubmitProfile = async (data: UpdateMeItem) => {
  //   setIsLoading(true);
  //   setErrorMessage("");
  //   setSuccessMessage("");

  //   try {
  //     // Check if phone number is being changed
  //     if (data.phoneNumber && data.phoneNumber !== user?.phoneNumber) {
  //       // Format phone number to match backend expectations
  //       let formattedPhoneNumber = data.phoneNumber.trim();
  //       if (formattedPhoneNumber.startsWith("0")) {
  //         formattedPhoneNumber = "+27" + formattedPhoneNumber.slice(1);
  //       }

  //       // Navigate to OTP page with the new phone number
  //       navigate("/phone-otp", {
  //         state: {
  //           phoneNumber: formattedPhoneNumber,
  //           purpose: "phoneVerification",
  //           otherFields: {
  //             firstName: data.firstName,
  //             lastName: data.lastName,
  //             userName: data.userName,
  //             gender: data.gender,
  //             dateOfBirth: data.dateOfBirth,
  //           },
  //         },
  //       });
  //       return;
  //     }

  //     // Regular update if phone isn't changing
  //     const updateData = {
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       userName: data.userName,
  //       gender: data.gender,
  //       dateOfBirth: data.dateOfBirth,
  //     };

  //     // Dispatch the update action with proper typing
  //     await dispatch(updateUserProfile(updateData) as any).unwrap();

  //     setSuccessMessage("Profile updated successfully!");
  //   } catch (error: any) {
  //     console.error("Update error:", error);
  //     setErrorMessage(error?.message || "Update failed");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmitProfile = async (data: UpdateMeItem) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Format phone number consistently
      let formattedPhoneNumber = data.phoneNumber?.trim() || "";
      if (formattedPhoneNumber.startsWith("0")) {
        formattedPhoneNumber = "+27" + formattedPhoneNumber.slice(1);
      }

      // Prepare the update data
      const updateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
      };

      // Only include phoneNumber if it's different from current
      if (formattedPhoneNumber && formattedPhoneNumber !== user?.phoneNumber) {
        updateData.phoneNumber = formattedPhoneNumber;
      }

      // Dispatch the update action
      const result = await dispatch(
        updateUserProfile(updateData) as any
      ).unwrap();

      // Check the response from the backend
      if (result?.status === "pending") {
        // Phone number change detected, navigate to OTP page
        navigate("/phone-otp", {
          state: {
            phoneNumber: formattedPhoneNumber,
            purpose: "phoneVerification",
            source: "profileUpdate",
          },
        });
      } else if (result?.status === "success") {
        // Regular update successful
        setSuccessMessage("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      setErrorMessage(error?.message || "Update failed");
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
            onClick={() => {
              navigate(-1);
            }}
          >
            <BackButton
              textLabel={"My profile"}
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
            onSubmit={methods.handleSubmit(handleSubmitProfile, onError)}
            className="w-full grow flex flex-col justify-start items-center overflow-y-auto"
          >
            <div className="w-full h-fit flex flex-col justify-start items-center gap-y-[20px] px-[28px] py-[20px]">
              <div className="w-[100%] h-auto">
                <div className="w-full h-auto flex flex-col items-center gap-y-4">
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"firstName"}
                      label={"First Name"}
                      type={"string"}
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"lastName"}
                      label={"Last name"}
                      type={"text"}
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"userName"}
                      label={"Username"}
                      type={"text"}
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"gender"}
                      label={"Gender/sex"}
                      type={"text"}
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"dateOfBirth"}
                      label={"Date of birth"}
                      type={"date"}
                      hideLabel={false}
                    />
                  </div>

                  <div className="w-full h-[1px] bg-[#E0E0E0]"></div>

                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"phoneNumber"}
                      label={"Phone number"}
                      type={"tel"}
                      hideLabel={false}
                    />
                  </div>
                </div>
              </div>

              {successMessage && (
                <div className="text-green-500 text-center">
                  {successMessage.toString()}
                </div>
              )}

              {errorMessage && (
                <div className="text-red-500 text-center">
                  {typeof errorMessage === "string"
                    ? errorMessage
                    : JSON.stringify(errorMessage)}
                </div>
              )}

              <div className="w-full h-auto pt-[30px]">
                <PrimaryButton
                  label={isLoading ? "Saving..." : "Save changes"}
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

export default ManageProfilePage;
