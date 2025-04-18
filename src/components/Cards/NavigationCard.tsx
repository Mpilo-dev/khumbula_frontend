import React from "react";
import { GoChevronRight } from "react-icons/go";
import PIllImage from "/pill.png";
import { CustomText } from "../../elements";

type TextProps = {
  textLabel: string;
  handleClick: () => void;
};

export const NavigationCard: React.FC<TextProps> = ({
  textLabel,
  handleClick,
}) => {
  return (
    <div
      className={`w-full h-auto flex flex-row px-[20px] py-[16px] items-center justify-between border-b-[1px] border-solid border-b-[#E0E0E0]`}
      onClick={handleClick}
    >
      <div className="w-auto h-auto flex flex-row gap-x-4 items-center">
        <img
          src={PIllImage}
          className="w-auto h-[20px] tSM:h-[18px]"
          alt="Khumbula pill logo"
        />
        <CustomText
          textLabel={textLabel}
          fontWeight="font-medium"
          fontSize="text-[18px]"
          fontColor={`text-black`}
        />
      </div>
      <GoChevronRight className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]" />
    </div>
  );
};

export default NavigationCard;
