import React from "react";

type TextProps = {
  textLabel: string;
  fontWeight: string;
  fontSize: string;
  customClass?: string;
  fontColor?: string;
};

export const CustomText: React.FC<TextProps> = ({
  textLabel,
  fontWeight,
  fontSize,
  fontColor,
  customClass,
}) => {
  return (
    <p
      className={`font-poppins ${
        fontColor ? fontColor : "text-black"
      }  ${fontWeight} ${fontSize} ${customClass}`}
    >
      {textLabel}
    </p>
  );
};

export default CustomText;
