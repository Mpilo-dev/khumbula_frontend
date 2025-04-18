import React from "react";
import { TfiTrash } from "react-icons/tfi";
import PIllImage from "/pill.png";
import { CustomText } from "../../elements";

type TextProps = {
  textLabel: string;
  servingNumber: number;
  handleClick: () => void;
  handleDelete?: () => void;
  showLine?: boolean;
};

export const AlertPillCard: React.FC<TextProps> = ({
  textLabel,
  servingNumber,
  handleClick,
  handleDelete,
  showLine,
}) => {
  const renderPills = () => {
    const finalArray: string[] = [];
    for (let i = 0; i < servingNumber; i++) {
      console.log(`idx: `, i);

      finalArray.push(`${i + 1}`);
    }

    return (
      finalArray &&
      finalArray.map((item, idx: number) => (
        <img
          key={`item-${idx + 1}`}
          src={PIllImage}
          className="w-auto h-[20px] tSM:h-[18px]"
          alt="Khumbula pill logo"
        />
      ))
    );
  };

  return (
    <div
      className={`w-full h-auto flex flex-row px-[20px] ps-0 py-[16px] items-center justify-between border-b-[1px] border-solid ${
        showLine ? "border-b-[#E0E0E0]" : "border-b-transparent"
      }`}
      onClick={handleClick}
    >
      <div className="w-[65%] h-auto flex flex-row gap-x-[20px] items-center">
        <div className="w-fit h-auto flex flex-col gap-y-[1px]">
          <CustomText
            textLabel={textLabel}
            fontWeight="font-medium"
            fontSize="text-[18px]"
            fontColor={`text-black`}
          />
        </div>
      </div>

      <div className="w-auto h-auto flex flex-row gap-x-1">{renderPills()}</div>

      <TfiTrash
        className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px] cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
        fill="#1D6A63"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete?.();
        }}
      />
    </div>
  );
};

export default AlertPillCard;
