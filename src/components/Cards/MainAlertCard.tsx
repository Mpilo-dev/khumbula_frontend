import React from "react";
import { GoChevronRight } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";

import PIllImage from "/pill.png";
import { CustomText } from "../../elements";

type TextProps = {
  textLabel: string;
  pillTypes: string;
  servingPerDay: string;
  servingTotal: number;
  alertActive: boolean;
  handleClick: () => void;
  handleDelete: () => void;
  showLine?: boolean;
};

export const MainAlertCard: React.FC<TextProps> = ({
  textLabel,
  pillTypes,
  servingPerDay,
  servingTotal,
  alertActive,
  handleClick,
  handleDelete,
  showLine,
}) => {
  return (
    <div
      className={`w-full h-auto flex flex-row py-[16px] items-center justify-between border-b-[1px] border-solid ${
        showLine ? "border-b-[#E0E0E0]" : "border-b-transparent"
      } cursor-pointer active:scale-[1.02] hover:scale-[1.04]`}
      onClick={handleClick}
    >
      <div className="w-[65%] h-auto flex flex-row gap-x-[20px] items-center">
        <FaBell
          className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]"
          fill={alertActive ? "#F8D448" : "grey"}
        />

        <div className="w-fit h-auto flex flex-col gap-y-[1px]">
          <CustomText
            textLabel={textLabel}
            fontWeight="font-medium"
            fontSize="text-[18px]"
            fontColor={`text-black`}
          />
          <CustomText
            textLabel={pillTypes}
            fontWeight="font-light"
            fontSize="text-[16px]"
            fontColor={`text-black`}
          />
          <CustomText
            textLabel={servingPerDay}
            fontWeight="font-light"
            fontSize="text-[16px]"
            fontColor={`text-black`}
          />
        </div>
      </div>
      <div className="w-auto h-auto flex flex-row items-center justify-center gap-x-2">
        <img
          src={PIllImage}
          className="w-auto h-[20px] tSM:h-[18px]"
          alt="Khumbula pill logo"
        />
        <CustomText
          textLabel={servingTotal.toString()}
          fontWeight="font-semibold"
          fontSize="text-[20px]"
          fontColor={`text-black`}
        />
        <FiTrash
          className="w-[20px] h-[20px] text-red-500 cursor-pointer hover:scale-110"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering handleClick
            handleDelete();
          }}
        />
      </div>
      <GoChevronRight className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]" />
    </div>
  );
};

export default MainAlertCard;
