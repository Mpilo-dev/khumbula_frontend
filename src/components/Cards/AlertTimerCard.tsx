import React, { useEffect, useState } from "react";
import { TfiTrash } from "react-icons/tfi";
import { IoMdTime } from "react-icons/io";
import TimePicker from "react-time-picker";

import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

type TextProps = {
  textLabel: string;
  servingNumber: number;
  handleClick: () => void;
  handleDelete: () => void;
  showLine?: boolean;
  onTimeChange: (time: string) => void;
  initialTime?: string;
};

export const AlertTimerCard: React.FC<TextProps> = ({
  textLabel,
  servingNumber,
  handleClick,
  handleDelete,
  showLine,
  onTimeChange,
  initialTime = "12:00",
}) => {
  const [internalTime, setInternalTime] = useState(initialTime);

  // Only update internal time when initialTime prop changes
  useEffect(() => {
    setInternalTime(initialTime);
  }, [initialTime]);

  const handleTimeChange = (time: string | null) => {
    setInternalTime(time);
    // Only call onTimeChange if time is not null
    if (time) {
      onTimeChange(time);
    }
  };

  return (
    <div
      className={`w-full h-auto flex flex-row py-[16px] items-center justify-between border-b-[1px] border-solid ${
        showLine ? "border-b-[#E0E0E0]" : "border-b-transparent"
      }`}
      onClick={handleClick}
    >
      <div className="w-[65%] h-auto flex flex-row gap-x-[20px] items-center">
        <div className="grow h-auto flex flex-row items-center justify-center gap-x-2 cursor-pointer active:scale-[1.02] hover:scale-[1.04] rounded-full border-solid border-[1px] border-khumbula_primary">
          <IoMdTime
            className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px] cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
            fill="#1D6A63"
            onClick={handleClick}
          />
          <TimePicker
            onChange={handleTimeChange}
            value={internalTime}
            disableClock={true}
            format="HH:mm"
            clearIcon={null}
            className="border-none text-black text-[18px] font-medium"
          />
        </div>
      </div>

      <TfiTrash
        className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px] cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
        fill="#1D6A63"
        onClick={handleDelete}
      />
    </div>
  );
};

export default AlertTimerCard;
