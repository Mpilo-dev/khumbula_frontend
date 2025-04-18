import React, { CSSProperties } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import { BUTTON_TYPES } from "../../helpers/types";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#FFBE00",
};

export enum PRIMARY_BUTTON_TYPE {
  black = "bg-[#C1C1C1]",
  primary = "bg-khumbula_primary",
  secondary = "bg-khumbula_accent",
  disable = "bg-gosolr_gray",
}

export enum PRIMARY_BUTTON_SIZE {
  small = "small",
  medium = "medium",
  large = "large",
}

type PrimaryButtonProps = {
  label: string;
  type?: BUTTON_TYPES;
  buttonType: PRIMARY_BUTTON_TYPE;
  buttonSize?: PRIMARY_BUTTON_SIZE;
  handleClick?: () => void;
  customClass?: string;
  loading?: boolean;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  type = BUTTON_TYPES.button,
  buttonType,
  buttonSize = PRIMARY_BUTTON_SIZE.medium,
  handleClick,
  loading = false,
  customClass,
}) => {
  return (
    <button
      type={type}
      onClick={loading ? undefined : handleClick ? handleClick : undefined}
      disabled={loading}
      className={`w-full h-fit ${buttonType} ${
        buttonType === PRIMARY_BUTTON_TYPE.primary
          ? "hover:bg-khumbula_primary hover:text-white"
          : "hover:bg-khumbula_primary"
      } active:scale-[1.02] flex flex-row justify-center  rounded-full  cursor-pointer ${
        buttonSize === PRIMARY_BUTTON_SIZE.small
          ? `px-2 py-1  tSM:py-[2px]`
          : label === "Sign up"
          ? `px-12 py-[6px] tSM:px-4 tSM:py-[4px]`
          : `px-6 py-[6px] tSM:px-4 tSM:py-[4px]`
      }`}
    >
      {!loading ? (
        <p
          className={`${
            buttonSize === PRIMARY_BUTTON_SIZE.small
              ? `text-[12px] mSM:text-[11px]`
              : `text-[16px] mSM:text-[14px]`
          } text-white font-medium  font-poppins ${customClass}`}
        >
          {label}
        </p>
      ) : (
        <BounceLoader
          color={"#FFBE00"}
          loading={loading}
          cssOverride={override}
          size={24}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </button>
  );
};

export default PrimaryButton;
