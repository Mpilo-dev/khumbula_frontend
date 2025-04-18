import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";

type TextProps = {
  textLabel: string;
  fontWeight: string;
  fontSize: string;
  customClass?: string;
  fontColor?: string;
  hideText: boolean;
};

export const BackButton: React.FC<TextProps> = ({
  textLabel,
  fontWeight,
  fontSize,
  fontColor,
  customClass,
  hideText = false,
}) => {
  return (
    <div className="w-fit h-auto flex flex-row gap-x-[8px] items-center">
      <IoArrowBackSharp className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]" />

      {!hideText && (
        <p
          className={`font-poppins ${
            fontColor ? fontColor : "text-black"
          }  ${fontWeight} ${fontSize} ${customClass}`}
        >
          {textLabel}
        </p>
      )}
    </div>
  );
};

export default BackButton;
