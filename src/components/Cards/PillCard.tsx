import { GoChevronRight } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";

import PIllImage from "/pill.png";
import { CustomText } from "../../elements";

type TextProps = {
  textLabel: string;
  servingText: string;
  hasAlert: boolean;
  handleClick: () => void;
  handleDelete: () => void;
  showLine?: boolean;
};

export const PillCard: React.FC<TextProps> = ({
  textLabel,
  servingText,
  hasAlert,
  handleClick,
  handleDelete,
  showLine,
}) => {
  return (
    <div
      className={`w-full h-auto flex flex-row px-[20px] py-[16px] items-center justify-between border-b-[1px] border-solid ${
        showLine ? "border-b-[#E0E0E0]" : "border-b-transparent"
      } cursor-pointer active:scale-[1.02] hover:scale-[1.04]`}
      onClick={handleClick}
    >
      <div className="w-auto h-auto flex flex-row gap-x-[20px] items-center">
        <img
          src={PIllImage}
          className="w-auto h-[20px] tSM:h-[18px]"
          alt="Khumbula pill logo"
        />
        <div className="w-fit h-auto flex flex-col gap-y-[1px]">
          <CustomText
            textLabel={textLabel}
            fontWeight="font-medium"
            fontSize="text-[18px]"
            fontColor={`text-black`}
          />
          <CustomText
            textLabel={servingText}
            fontWeight="font-light"
            fontSize="text-[16px]"
            fontColor={`text-black`}
          />
        </div>
      </div>
      {hasAlert && (
        <FaBell
          className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]"
          fill="#F8D448"
        />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering `handleClick`
          handleDelete();
        }}
        className="text-red-500 hover:text-red-700 active:scale-[1.02]"
      >
        <FiTrash className="w-[20px] h-[20px]" />
      </button>
      <GoChevronRight className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]" />
    </div>
  );
};

export default PillCard;
