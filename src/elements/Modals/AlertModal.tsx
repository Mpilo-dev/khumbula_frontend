import React, { useState, useEffect } from "react";
import { Alert, AlertTime } from "../../redux/features/alertsSlice";
import { Pill } from "../../redux/features/pillsSlice";
import { CustomText, PrimaryButton, CustomToggle } from "../../elements";
import { BUTTON_TYPES } from "../../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../../elements/Buttons/PrimaryButton";
import { AlertPillCard, AlertTimerCard } from "../../components";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { updateAlert } from "../../redux/features/alertsSlice";
import { fetchPills } from "../../redux/features/pillsSlice";
import PillListModal from "./PillListModal";

interface AlertDetailsModalProps {
  alert: Alert | null;
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
  alert,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pills, loading: pillsLoading } = useSelector(
    (state: RootState) => state.pills
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedAlert, setEditedAlert] = useState<Partial<Alert> | null>(null);
  const [showPillListModal, setShowPillListModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // const [timesPerDay, setTimesPerDay] = useState(1);
  // const [alertTimes, setAlertTimes] = useState<AlertTime[]>([]);

  useEffect(() => {
    dispatch(fetchPills());
  }, [dispatch]);

  useEffect(() => {
    if (alert) {
      setEditedAlert({
        ...alert,
        alertTimes: alert.alertTimes.map((time) => ({
          hours: time.hours,
          minutes: time.minutes,
        })),
      });
      // setTimesPerDay(alert.timesPerDay);
      // setAlertTimes(alert.alertTimes);
    }
  }, [alert]);

  const handleTimeChange = (index: number, timeString: string) => {
    if (!editedAlert) return;

    const [hoursStr, minutesStr] = timeString.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid time format:", timeString);
      return;
    }

    // setAlertTimes((prev) => {
    //   const newAlertTimes = [...prev];
    //   newAlertTimes[index] = {
    //     hours: Math.max(0, Math.min(23, hours)),
    //     minutes: Math.max(0, Math.min(59, minutes)),
    //   };
    //   return newAlertTimes;
    // });

    setEditedAlert((prev) => {
      if (!prev) return null;
      const newAlertTimes = [...(prev.alertTimes || [])];
      newAlertTimes[index] = {
        hours: Math.max(0, Math.min(23, hours)),
        minutes: Math.max(0, Math.min(59, minutes)),
      };
      return { ...prev, alertTimes: newAlertTimes };
    });
  };

  // const handleTimesPerDayChange = (newTimesPerDay: number) => {
  //   console.log("Changing times per day to:", newTimesPerDay);

  //   // First update the local state
  //   setTimesPerDay(newTimesPerDay);

  //   // Update alertTimes array to match new timesPerDay
  //   const newAlertTimes = [...alertTimes];
  //   if (newTimesPerDay < newAlertTimes.length) {
  //     // If reducing times, remove extra times
  //     newAlertTimes.splice(newTimesPerDay);
  //   } else {
  //     // If increasing times, add default times
  //     while (newAlertTimes.length < newTimesPerDay) {
  //       newAlertTimes.push({ hours: 12, minutes: 0 });
  //     }
  //   }
  //   setAlertTimes(newAlertTimes);

  //   // Update editedAlert state with both new values
  //   setEditedAlert((prev) => {
  //     if (!prev) return null;
  //     const updatedAlert = {
  //       ...prev,
  //       timesPerDay: newTimesPerDay,
  //       alertTimes: newAlertTimes,
  //     };
  //     console.log("Updated editedAlert with new times:", updatedAlert);
  //     return updatedAlert;
  //   });
  // };

  const handleTimesPerDayChange = (newTimesPerDay: number) => {
    if (!editedAlert) return;

    setEditedAlert((prev) => {
      if (!prev) return null;

      const currentAlertTimes = prev.alertTimes || [];
      const newAlertTimes = [...currentAlertTimes];

      // Adjust the alertTimes array length based on newTimesPerDay
      if (newTimesPerDay < currentAlertTimes.length) {
        // If reducing times, remove extra times
        newAlertTimes.splice(newTimesPerDay);
      } else {
        // If increasing times, add default times
        while (newAlertTimes.length < newTimesPerDay) {
          newAlertTimes.push({ hours: 12, minutes: 0 });
        }
      }

      console.log("Updating times per day:", {
        newTimesPerDay,
        newAlertTimes,
        currentLength: currentAlertTimes.length,
      });

      return {
        ...prev,
        timesPerDay: newTimesPerDay,
        alertTimes: newAlertTimes,
      };
    });
  };

  const handlePillSelection = (selectedPillIds: string[]) => {
    if (!editedAlert) return;
    const selectedPills = pills.filter((p) => selectedPillIds.includes(p._id));
    setEditedAlert((prev) => ({
      ...prev!,
      pills: selectedPills,
    }));
    setShowPillListModal(false);
  };

  // const handleUpdate = async () => {
  //   if (!alert || !editedAlert) return;

  //   try {
  //     // Create a new update data object with the most current state values
  //     const updateData = {
  //       ...editedAlert,
  //       pills: editedAlert.pills || [],
  //       timesPerDay: timesPerDay,
  //       alertTimes: alertTimes,
  //       daysOfWeek: editedAlert.daysOfWeek || [],
  //       isActive: editedAlert.isActive,
  //     };

  //     console.log("Sending update with data:", updateData);

  //     const result = await dispatch(
  //       updateAlert({ id: alert._id, data: updateData })
  //     ).unwrap();

  //     console.log("Update successful, received result:", result);

  //     // Update local state with the result from the backend
  //     setTimesPerDay(result.timesPerDay);
  //     setAlertTimes(result.alertTimes);
  //     setEditedAlert(result);

  //     setIsEditing(false);
  //     onClose();
  //   } catch (error) {
  //     console.error("Error updating alert:", error);
  //     setErrorMessage(error as string);
  //   }
  // };

  // Add effect to log state changes

  // useEffect(() => {
  //   console.log("Current state:", {
  //     timesPerDay,
  //     alertTimes,
  //     editedAlert,
  //   });
  // }, [timesPerDay, alertTimes, editedAlert]);

  // Add cleanup effect when modal closes

  const handleUpdate = async () => {
    if (!alert || !editedAlert) return;

    try {
      // Ensure timesPerDay matches the length of alertTimes
      const currentAlertTimes = editedAlert.alertTimes || [];
      const timesPerDay = currentAlertTimes.length;

      // Create a new update data object with the most current state values
      const updateData = {
        ...editedAlert,
        pills: editedAlert.pills || [],
        timesPerDay: timesPerDay, // Use the length of alertTimes
        alertTimes: currentAlertTimes,
        daysOfWeek: editedAlert.daysOfWeek || [],
        isActive: editedAlert.isActive,
      };

      console.log("Sending update with data:", updateData);

      const result = await dispatch(
        updateAlert({ id: alert._id, data: updateData })
      ).unwrap();

      console.log("Update successful, received result:", result);

      // Update local state with the result from the backend
      setEditedAlert(result);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error updating alert:", error);
      setErrorMessage(error as string);
    }
  };

  useEffect(() => {
    return () => {
      // Reset state when modal closes
      setIsEditing(false);
      setEditedAlert(null);
      setErrorMessage("");
    };
  }, []);

  const renderPills = () => {
    if (!editedAlert?.pills || !Array.isArray(editedAlert.pills)) {
      return null;
    }

    const validPills = editedAlert.pills.filter((pill) => pill && pill._id);
    if (validPills.length === 0) {
      return null;
    }

    return validPills.map((pill, idx) => (
      <AlertPillCard
        key={pill._id}
        textLabel={pill.name}
        servingNumber={pill.capsulesPerServing}
        showLine={idx + 1 < validPills.length}
        handleClick={() => {}}
        handleDelete={
          isEditing
            ? () => {
                setEditedAlert((prev) => ({
                  ...prev!,
                  pills: prev?.pills?.filter((p) => p._id !== pill._id) || [],
                }));
              }
            : () => {}
        }
      />
    ));
  };

  const renderTimesPerDaySelector = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
      <div
        key={`time-${num}`}
        className={`w-[40px] h-[40px] tSM2:w-[32px] tSM2:h-[32px] flex flex-row justify-center items-center border-solid border-[1px] border-khumbula_primary rounded-lg cursor-pointer active:scale-[1.02] hover:scale-[1.04] ${
          editedAlert?.timesPerDay === num ? "bg-khumbula_accent" : "bg-white"
        }`}
        onClick={() => isEditing && handleTimesPerDayChange(num)}
      >
        <CustomText
          textLabel={num.toString()}
          fontWeight={
            editedAlert?.timesPerDay === num ? "font-medium" : "font-regular"
          }
          fontSize="text-[16px]"
          fontColor={
            editedAlert?.timesPerDay === num ? "text-white" : "text-black"
          }
        />
      </div>
    ));
  };

  const renderTimerItems = () => {
    const timesPerDay = editedAlert?.timesPerDay || 0;
    const alertTimes = editedAlert?.alertTimes || [];

    return Array.from({ length: timesPerDay }, (_, index) => {
      const currentTime = alertTimes[index] || { hours: 12, minutes: 0 };
      const initialTime = `${currentTime.hours
        .toString()
        .padStart(2, "0")}:${currentTime.minutes.toString().padStart(2, "0")}`;

      return (
        <AlertTimerCard
          key={`timer-${index}`}
          textLabel={`Time ${index + 1}`}
          servingNumber={index + 1}
          showLine={index < timesPerDay - 1}
          handleClick={() => {}}
          handleDelete={
            isEditing
              ? () => {
                  setEditedAlert((prev) => {
                    if (!prev) return null;
                    const newAlertTimes = [...(prev.alertTimes || [])];
                    newAlertTimes.splice(index, 1);
                    return {
                      ...prev,
                      timesPerDay: (prev.timesPerDay || 1) - 1,
                      alertTimes: newAlertTimes,
                    };
                  });
                }
              : () => {}
          }
          onTimeChange={
            isEditing ? (time) => handleTimeChange(index, time) : () => {}
          }
          initialTime={initialTime}
        />
      );
    });
  };

  const renderRepeatDays = () => {
    return (
      <div className="w-full h-auto flex flex-col justify-center gap-y-[20px]">
        <div className="w-full h-auto flex flex-row justify-between items-center">
          <CustomText
            textLabel="Repeat days"
            fontWeight="font-medium"
            fontSize="text-[20px]"
            fontColor="text-black"
          />
          {isEditing && (
            <div className="w-fit h-auto">
              <PrimaryButton
                label={
                  editedAlert?.daysOfWeek?.length === 7
                    ? "Remove all"
                    : "All week"
                }
                type={BUTTON_TYPES.button}
                buttonType={
                  editedAlert?.daysOfWeek?.length === 7
                    ? PRIMARY_BUTTON_TYPE.black
                    : PRIMARY_BUTTON_TYPE.primary
                }
                handleClick={() => {
                  if (!isEditing) return;
                  setEditedAlert((prev) => ({
                    ...prev!,
                    daysOfWeek:
                      prev?.daysOfWeek?.length === 7 ? [] : [...DAYS_OF_WEEK],
                  }));
                }}
                loading={false}
              />
            </div>
          )}
        </div>
        <div className="w-full h-[40px] flex flex-row justify-between">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = editedAlert?.daysOfWeek?.includes(day);
            return (
              <div
                key={day}
                className={`w-[40px] h-[40px] tSM2:w-[32px] tSM2:h-[32px] flex flex-row justify-center items-center border-solid border-[1px] border-khumbula_primary rounded-lg cursor-pointer active:scale-[1.02] hover:scale-[1.04] ${
                  isSelected ? "bg-khumbula_accent" : "bg-white"
                }`}
                onClick={() => {
                  if (!isEditing) return;
                  setEditedAlert((prev) => ({
                    ...prev!,
                    daysOfWeek: isSelected
                      ? prev?.daysOfWeek?.filter((d) => d !== day) || []
                      : [...(prev?.daysOfWeek || []), day],
                  }));
                }}
              >
                <CustomText
                  textLabel={day.charAt(0)}
                  fontWeight={isSelected ? "font-medium" : "font-regular"}
                  fontSize="text-[16px]"
                  fontColor={isSelected ? "text-white" : "text-black"}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!alert || !editedAlert) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
      <div className="w-[90%] max-w-[400px] h-auto max-h-[80vh] bg-white flex flex-col rounded-md shadow-lg">
        {/* Modal Header */}
        <div className="w-full px-[20px] py-[16px] flex flex-row justify-between items-center border-b-[1px] border-solid border-[#E0E0E0]">
          <CustomText
            textLabel="Alert"
            fontWeight="font-semibold"
            fontSize="text-[18px]"
            fontColor="text-black"
          />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="w-full px-[20px] py-[16px] overflow-y-auto">
          {/* Pills Section */}
          <div className="mb-4">
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
              <CustomText
                textLabel="Alert Pills"
                fontWeight="font-medium"
                fontSize="text-[18px]"
                fontColor="text-black"
              />
              {isEditing && (
                <div className="w-fit h-auto">
                  <PrimaryButton
                    label="Change Pills"
                    type={BUTTON_TYPES.button}
                    buttonType={PRIMARY_BUTTON_TYPE.secondary}
                    handleClick={() => setShowPillListModal(true)}
                    loading={pillsLoading}
                  />
                </div>
              )}
            </div>
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-start items-center bg-[#F7F7F7]">
              {renderPills()}
            </div>
          </div>

          {/* Times Per Day Section */}
          <div className="mb-4">
            <CustomText
              textLabel="Times Per Day"
              fontSize="text-[20px]"
              fontColor="text-black"
              fontWeight="font-medium"
            />
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center bg-[#F7F7F7]">
              {renderTimesPerDaySelector()}
            </div>
          </div>

          {/* Alert Times Section */}
          <div className="mb-4">
            <CustomText
              textLabel="Alert Times"
              fontSize="text-[20px]"
              fontColor="text-black"
              fontWeight="font-medium"
            />
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-between items-center bg-[#F7F7F7]">
              {renderTimerItems()}
            </div>
          </div>

          {/* Days of Week Section */}
          <div className="mb-4">
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-center gap-y-[20px] bg-[#F7F7F7]">
              {renderRepeatDays()}
            </div>
          </div>

          {/* Active Toggle */}
          <div className="w-full p-[1px] bg-[#d5d5d5] rounded-full flex flex-row justify-center items-center mb-4">
            <CustomToggle
              titleLeft="Active"
              titleRight="Inactive"
              isSmart={!editedAlert.isActive}
              handleManualClick={() => {
                if (!isEditing) return;
                setEditedAlert((prev) => ({ ...prev!, isActive: true }));
              }}
              handleSmartClick={() => {
                if (!isEditing) return;
                setEditedAlert((prev) => ({ ...prev!, isActive: false }));
              }}
              isPrimary={true}
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}
        </div>

        {/* Modal Footer with Buttons */}
        <div className="flex justify-end gap-2 px-[20px] py-[16px] border-t-[1px] border-solid border-[#E0E0E0]">
          {!isEditing ? (
            <PrimaryButton
              label="Edit"
              type={BUTTON_TYPES.button}
              buttonType={PRIMARY_BUTTON_TYPE.primary}
              handleClick={() => setIsEditing(true)}
            />
          ) : (
            <PrimaryButton
              label="Update"
              type={BUTTON_TYPES.button}
              buttonType={PRIMARY_BUTTON_TYPE.primary}
              handleClick={handleUpdate}
            />
          )}
        </div>
      </div>

      {showPillListModal && (
        <PillListModal
          open={true}
          onClose={(selectedPillIds) => {
            const selectedPills = pills.filter((p) =>
              selectedPillIds.includes(p._id)
            );
            setEditedAlert((prev) => ({
              ...prev!,
              pills: selectedPills,
            }));
            setShowPillListModal(false);
          }}
          pills={pills}
          selectedPills={editedAlert?.pills?.map((p) => p._id) || []}
        />
      )}
    </div>
  );
};

export default AlertDetailsModal;
