import { useState, useEffect } from "react";
import Logo from "/logo.png";
import { useNavigate } from "react-router-dom";
import { CustomText, PrimaryButton, TextInputField } from "../elements";
import { BUTTON_TYPES, WelcomePageValidation } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/features/authSlice";

type WelcomePageItem = {
  userName: string;
  password: string;
};

const WelcomePageDefaultValues: WelcomePageItem = {
  userName: "",
  password: "",
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Updates
  const { token, user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (token && user) {
      navigate("/dashboard");
    } else if (!token || !user) {
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [token, user, navigate]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState,
    formState: { defaultValues, isValid },
    ...rest
  } = useForm<WelcomePageItem>({
    resolver: yupResolver(WelcomePageValidation),
    mode: "onChange",
    defaultValues: WelcomePageDefaultValues,
  });

  const customHandleSubmit = async (dataResults: any, e?: any) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await dispatch(loginUser(dataResults)).unwrap();

      if (response) {
        setIsLoading(false);
        navigate("/dashboard");
      }
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error.message || "Login failed");
    }
  };

  const onError = (errors: any) => {
    console.log(errors);
    // setErrorMessage("Please fill in all required fields.");
  };

  return (
    <div className="w-full h-screen bg-[#DEDEDE] flex flex-row justify-center items-center">
      <div className="w-[445px] h-[90%] tSM2:h-[100%] bg-white rounded-[14px] shadow shadow-[#E7F0EF]">
        <FormProvider
          control={control}
          handleSubmit={handleSubmit}
          reset={reset}
          setValue={setValue}
          formState={formState}
          {...rest}
        >
          <form
            onSubmit={handleSubmit(customHandleSubmit, onError)}
            className="w-full h-screen flex flex-row justify-center items-center"
          >
            <div className="w-full h-auto flex flex-col justify-center items-center gap-y-[20px] px-[28px]">
              <img
                src={Logo}
                className="w-[80%] h-auto tSM:w-[90%] pb-[16px]"
                alt="active address Khumbula logo"
              />

              <div className="w-[100%] h-auto">
                <div className="w-full h-auto flex flex-col gap-y-6 mLG:gap-y-3">
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"userName"}
                      label={"Username/Phone number"}
                      type={"string"}
                      hideLabel={false}
                    />
                  </div>
                  <div className="w-full h-auto self-start">
                    <TextInputField
                      name={"password"}
                      label={"Password"}
                      type={"password"}
                      hideLabel={false}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full h-auto pt-[16px]">
                <PrimaryButton
                  label={"Continue"}
                  type={BUTTON_TYPES.submit}
                  buttonType={PRIMARY_BUTTON_TYPE.primary}
                  loading={isLoading}
                />
              </div>

              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}

              <div className="w-full h-auto flex flex-row justify-center items-center gap-x-2">
                <CustomText
                  textLabel={"Don't have an account yet?"}
                  fontWeight="font-regular"
                  fontSize="text-[14px]"
                  fontColor={`text-black`}
                />
                <div
                  className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
                  onClick={() => navigate("/register")}
                >
                  <CustomText
                    textLabel={"Register"}
                    fontWeight="font-semibold"
                    fontSize="text-[18px]"
                    fontColor={`text-khumbula_accent`}
                  />
                </div>
              </div>

              <div
                className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
                onClick={() => {
                  navigate("/forgot-password");
                }}
              >
                <CustomText
                  textLabel={"Forgot password"}
                  fontWeight="font-semibold"
                  fontSize="text-[18px]"
                  fontColor={`text-khumbula_primary`}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Home;
