import { FC, useState } from "react";
import CustomText from "../Text/CustomText";

export enum USAGE_CARD_STATES {
  active = "active",
  inactive = "inactive",
}

type SubProps = {
  label: string;
  subType: USAGE_CARD_STATES;
  isPrimary?: boolean;
  handleClick: () => void;
  customClass?: string;
};

export const SubButton: FC<SubProps> = ({
  label,
  subType,
  handleClick,
  isPrimary = false,
  customClass,
}: SubProps) => {
  const bg = (subType: USAGE_CARD_STATES) => {
    if (subType === USAGE_CARD_STATES.inactive) {
      return "bg-[#d5d5d5]";
    } else {
      return isPrimary ? "bg-[#F8D448]" : "bg-white";
    }
  };

  return (
    <div
      className={`grow h-auto flex flex-row justify-center rounded-full ${bg(
        subType
      )} active:scale-[1.02] hover:scale-[1.04] px-2 py-1 cursor-pointer ${customClass}`}
      onClick={handleClick}
    >
      <CustomText
        textLabel={label}
        fontWeight={
          subType === USAGE_CARD_STATES.active ? `font-medium` : "font-regular"
        }
        fontSize="text-[16px]"
        fontColor={`text-[#1D6A63]`}
      />
    </div>
  );
};

export type SecondaryProp = {
  titleLeft?: string;
  titleRight?: string;
  isSmart: boolean;
  handleManualClick: () => void;
  handleSmartClick: () => void;
  isPrimary?: boolean;
};

const CustomToggle: FC<SecondaryProp> = ({
  titleLeft = "Manual",
  titleRight = "Smart",
  isSmart,
  handleManualClick,
  handleSmartClick,
  isPrimary,
}: SecondaryProp) => {
  const [manualControl, setManualControl] = useState<boolean>(isSmart);
  return (
    <div className="grow h-auto flex flex-row bg-[#d5d5d5] rounded-full">
      <SubButton
        isPrimary={isPrimary}
        label={titleLeft}
        subType={
          !manualControl ? USAGE_CARD_STATES.active : USAGE_CARD_STATES.inactive
        }
        handleClick={() => {
          setManualControl(!manualControl);
          handleManualClick && handleManualClick();
        }}
      />
      <SubButton
        isPrimary={isPrimary}
        label={titleRight}
        subType={
          manualControl ? USAGE_CARD_STATES.active : USAGE_CARD_STATES.inactive
        }
        handleClick={() => {
          setManualControl(!manualControl);
          handleSmartClick && handleSmartClick();
        }}
      />
    </div>
  );
};

export default CustomToggle;
