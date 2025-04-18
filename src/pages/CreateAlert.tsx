import React, { useCallback, useState, useEffect } from "react";
import Logo from "/logo.png"; //
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import {
  BackButton,
  CustomText,
  CustomToggle,
  PillModal,
  PillListModal,
  PrimaryButton,
  TextInputField,
} from "../elements";
import {
  BUTTON_TYPES,
  AlertValidationSchema,
  SelectChild, //
} from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AlertPillCard, AlertTimerCard } from "../components";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { createAlert, setSelectedPills } from "../redux/features/alertsSlice";
import { fetchPills } from "../redux/features/pillsSlice";

const MAX_TIME_PER_DAY: number = 5;

type AlertCreationForm = {
  pills: string[];
  timesPerDay: number;
  alertTimes: { hours: number; minutes: number }[];
  daysOfWeek: string[];
  isActive: boolean;
};

export const defaultAlertValues: AlertCreationForm = {
  pills: [],
  timesPerDay: 1,
  daysOfWeek: [],
  alertTimes: [],
  isActive: true,
};

const DAYS_OF_WEEK: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const CreateAlertPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [alertControl, setAlertControl] = useState<boolean>(true);
  const [daysActive, setDaysActive] = useState<string[]>([]);
  const [timesPerDay, setTimePerDay] = useState<number>(0);
  const [alertTimes, setAlertTimes] = useState<
    { hours: number; minutes: number }[]
  >([]);
  const [showPillListModal, setShowPillListModal] = useState(false);
  const [showPillModal, setShowPillModal] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState,
    formState: { defaultValues, isValid }, //
    ...rest
  } = useForm<AlertCreationForm>({
    resolver: yupResolver(AlertValidationSchema), //
    defaultValues: defaultAlertValues,
  });

  const { pills, loading: pillsLoading } = useSelector(
    (state: RootState) => state.pills
  );

  const { selectedPills, loading, error } = useSelector(
    (state: RootState) => state.alerts
  ); //

  useEffect(() => {
    dispatch(fetchPills());
  }, [dispatch]);

  const handleAddPillClick = () => {
    if (pills.length > 0) {
      setShowPillListModal(true);
    } else {
      setShowPillModal(true);
    }
  };

  const handlePillSelection = (selectedPillIds: string[]) => {
    const selectedPillsData = pills.filter((pill) =>
      selectedPillIds.includes(pill._id)
    );
    dispatch(setSelectedPills(selectedPillsData.map((pill) => pill._id)));
    setShowPillListModal(false);
  };

  // Handle time input changes
  const handleTimeChange = useCallback((index: number, timeString: string) => {
    const [hoursStr, minutesStr] = timeString.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    // Validate the parsed numbers
    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid time format:", timeString);
      return;
    }

    // Ensure the array is long enough
    setAlertTimes((prev) => {
      const newAlertTimes = [...prev];
      while (newAlertTimes.length <= index) {
        newAlertTimes.push({ hours: 12, minutes: 0 });
      }

      // Update the specific time
      newAlertTimes[index] = {
        hours: Math.max(0, Math.min(23, hours)),
        minutes: Math.max(0, Math.min(59, minutes)),
      };
      return newAlertTimes;
    });
  }, []);

  const handleCreateAlert = async () => {
    if (daysActive.length === 0) {
      setErrorMessage("Please select at least one day");
      return;
    }

    if (timesPerDay === 0) {
      setErrorMessage("Please select times per day");
      return;
    }

    if (selectedPills.length === 0) {
      setErrorMessage("Please select at least one pill");
      return;
    }

    // Check if all alert times are properly set
    const allTimesSet = alertTimes.every(
      (time) =>
        time &&
        typeof time.hours === "number" &&
        typeof time.minutes === "number"
    );

    if (!allTimesSet || alertTimes.length !== timesPerDay) {
      setErrorMessage("Please set all alert times");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await dispatch(
        createAlert({
          daysOfWeek: daysActive,
          timesPerDay,
          alertTimes,
          isActive: alertControl,
          pills: selectedPills,
        })
      ).unwrap();

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating alert:", error);
      setErrorMessage(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  // ?
  const customHandleSubmit = async (dataResults: any, e?: any) => {
    e?.preventDefault();
  };

  // eslint-disable-next-line ?
  const onError = (errors: any) => {
    setErrorMessage(errors);
  };

  const renderRepeatDays = useCallback(() => {
    return DAYS_OF_WEEK.map((item: string, idx: number) => {
      const found = _.find(daysActive, function (chr) {
        return chr.toLocaleLowerCase() === item.toLocaleLowerCase();
      });
      return (
        <div
          key={`item-${idx + 1}`}
          className={`w-[40px] h-[40px] tSM2:w-[32px] tSM2:h-[32px] flex flex-row justify-center items-center border-solid border-[1px] border-khumbula_primary rounded-lg cursor-pointer active:scale-[1.02] hover:scale-[1.04] ${
            found ? "bg-khumbula_accent" : "bg-white"
          } }`}
          onClick={() => {
            if (found) {
              setDaysActive((prev) =>
                prev.filter(
                  (day) => day.toLocaleLowerCase() !== item.toLocaleLowerCase()
                )
              );
            } else {
              setDaysActive((prev) => [...prev, item]);
            }
          }}
        >
          <CustomText
            textLabel={item.charAt(0)}
            fontWeight={found ? `font-medium` : "font-regular"}
            fontSize="text-[16px]"
            fontColor={found ? `text-white` : `black`}
          />
        </div>
      );
    });
  }, [daysActive]);

  const renderChosenPills = useCallback(() => {
    return selectedPills.map((pillId: string, idx: number) => {
      const pill = pills.find((p) => p._id === pillId);

      if (!pill) return null;

      return (
        <AlertPillCard
          key={`pill-${idx}`}
          textLabel={pill.name}
          servingNumber={pill.capsulesPerServing}
          handleClick={() => {}}
          handleDelete={() => {
            dispatch(
              setSelectedPills(selectedPills.filter((id) => id !== pillId))
            );
          }}
          showLine={idx + 1 < selectedPills.length}
        />
      );
    });
  }, [selectedPills]);

  const renderPills = useCallback(() => {
    const finalArray: string[] = [];
    for (let i = 0; i < MAX_TIME_PER_DAY; i++) {
      finalArray.push(`${i + 1}`);
    }

    return finalArray.map((item: string, idx: number) => (
      <div
        key={`item-${idx + 1}`}
        className={`w-[40px] h-[40px] tSM2:w-[32px] tSM2:h-[32px] flex flex-row justify-center items-center border-solid border-[1px] border-khumbula_primary rounded-lg cursor-pointer active:scale-[1.02] hover:scale-[1.04] ${
          timesPerDay === parseInt(item) ? "bg-khumbula_accent" : "bg-white"
        }`}
        onClick={() => {
          const newValue = parseInt(item);
          setTimePerDay((prev) => (prev === newValue ? 0 : newValue));
        }}
      >
        <CustomText
          textLabel={item.charAt(0)}
          fontWeight={
            timesPerDay === parseInt(item) ? `font-medium` : "font-regular"
          }
          fontSize="text-[16px]"
          fontColor={timesPerDay === parseInt(item) ? `text-white` : `black`}
        />
      </div>
    ));
  }, [timesPerDay]);

  const renderTimerItems = useCallback(() => {
    return Array.from({ length: timesPerDay }, (_, index) => {
      const currentTime = alertTimes[index] || { hours: 12, minutes: 0 };
      const initialTime = `${currentTime.hours
        .toString()
        .padStart(2, "0")}:${currentTime.minutes.toString().padStart(2, "0")}`;

      return (
        <AlertTimerCard
          key={`timer-${index}`}
          servingNumber={index + 1}
          handleDelete={() => {
            const newAlertTimes = [...alertTimes];
            newAlertTimes.splice(index, 1);
            setAlertTimes(newAlertTimes);
            setTimePerDay((prev) => prev - 1);
          }}
          onTimeChange={(time) => handleTimeChange(index, time)}
          initialTime={initialTime}
          showLine={index < timesPerDay - 1}
          handleClick={() => {}}
          textLabel={`Time ${index + 1}`}
        />
      );
    });
  }, [timesPerDay, alertTimes, handleTimeChange]);

  return (
    <div className="w-full h-screen bg-[#DEDEDE] flex flex-row justify-center items-center">
      <div className="w-[445px] h-[90%] tSM2:h-[100%] flex flex-col bg-white rounded-[14px] shadow shadow-[#E7F0EF] relative z-0">
        {showPillModal && (
          <PillModal handleClose={() => setShowPillModal(false)} />
        )}
        {showPillListModal && (
          <PillListModal
            onClose={handlePillSelection}
            open={showPillListModal}
            pills={pills}
            selectedPills={selectedPills}
          />
        )}
        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center border-b-[1px] border-solid border-b-[#E0E0E0]">
          <div
            className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
            onClick={() => {
              navigate(-1);
            }}
          >
            <BackButton
              textLabel={"Create alert"}
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
            className="w-full h-auto overflow-y-scroll"
          >
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
              <CustomText
                textLabel={"Select pill(s)"}
                fontWeight="font-medium"
                fontSize="text-[20px]"
                fontColor={`text-black`}
              />
            </div>
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center bg-[#F7F7F7]">
              <CustomText
                textLabel={"No pills added yet."}
                fontWeight="font-regular"
                fontSize="text-[16px]"
                fontColor={`text-black`}
              />
              <div className="w-fit h-auto">
                <PrimaryButton
                  label={"Add pill"}
                  type={BUTTON_TYPES.button}
                  buttonType={PRIMARY_BUTTON_TYPE.secondary}
                  handleClick={handleAddPillClick}
                  loading={pillsLoading}
                />
              </div>
            </div>

            <div className="w-full max-h-[200px] overflow-y-auto px-[20px] py-[16px] flex flex-col justify-start items-center bg-[#F7F7F7]">
              {renderChosenPills()}
            </div>

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
              <CustomText
                textLabel={"How many times per day?"}
                fontWeight="font-medium"
                fontSize="text-[20px]"
                fontColor={`text-black`}
              />
            </div>
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center bg-[#F7F7F7]">
              {renderPills()}
            </div>

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
              <CustomText
                textLabel={"Alert list"}
                fontWeight="font-medium"
                fontSize="text-[20px]"
                fontColor={`text-black`}
              />
            </div>
            {timesPerDay === 0 && (
              <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-center items-center bg-[#F7F7F7]">
                <CustomText
                  textLabel={"Select times per day first."}
                  fontWeight="font-regular"
                  fontSize="text-[16px]"
                  fontColor={`text-black`}
                />
              </div>
            )}
            {timesPerDay > 0 && (
              <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-between items-center bg-[#F7F7F7]">
                {renderTimerItems()}
              </div>
            )}

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-center gap-y-[20px]">
              <div className="w-full h-auto flex flex-row justify-between items-center">
                <CustomText
                  textLabel={"Repeat days"}
                  fontWeight="font-medium"
                  fontSize="text-[20px]"
                  fontColor={`text-black`}
                />

                <div className="w-fit h-auto">
                  <PrimaryButton
                    label={daysActive?.length === 7 ? "Remove all" : "All week"}
                    type={BUTTON_TYPES.button}
                    buttonType={
                      daysActive?.length === 7
                        ? PRIMARY_BUTTON_TYPE.black
                        : PRIMARY_BUTTON_TYPE.primary
                    }
                    handleClick={() => {
                      if (daysActive?.length === 7) {
                        setDaysActive([]);
                      } else {
                        setDaysActive([...DAYS_OF_WEEK]);
                      }
                    }}
                    loading={false}
                  />
                </div>
              </div>
              <div className="w-full h-[40px] flex flex-row justify-between">
                {renderRepeatDays()}
              </div>
            </div>

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-center items-center">
              <div className="w-full h-auto self-start">
                <TextInputField
                  name={"usernamePhone"}
                  label={"Enter any short info here ..."}
                  type={"string"}
                  hideLabel={false}
                />
              </div>
            </div>

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-center gap-y-[16px]">
              <CustomText
                textLabel={"Set alert"}
                fontWeight="font-medium"
                fontSize="text-[20px]"
                fontColor={`text-black`}
              />

              <div className="w-full h-auto p-[1px] bg-[#d5d5d5] rounded-full flex flex-row justify-center items-center">
                <CustomToggle
                  titleLeft="Active"
                  titleRight="Inactive"
                  isSmart={!alertControl}
                  handleManualClick={() => {
                    setAlertControl(true);
                  }}
                  handleSmartClick={() => {
                    setAlertControl(false);
                  }}
                  isPrimary={true}
                />
              </div>
            </div>

            <div className="w-full h-auto pt-[48px] px-[20px] pb-[20px]">
              <PrimaryButton
                label={isLoading ? "CREATING..." : "CREATE"}
                type={BUTTON_TYPES.button}
                buttonType={PRIMARY_BUTTON_TYPE.primary}
                handleClick={handleCreateAlert}
                loading={isLoading}
              />
              {errorMessage && (
                <div className="mt-2 text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default CreateAlertPage;
