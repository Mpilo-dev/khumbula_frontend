import React from "react";
import { CustomText, PrimaryButton } from "../index";
import { BUTTON_TYPES } from "../../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../Buttons/PrimaryButton";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  pillName?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  pillName,
}) => {
  if (!isOpen) return null;

  const getMessage = () => {
    if (pillName) {
      return `Are you sure you want to delete "${pillName}"? This action cannot be undone.`;
    }
    return message;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-[14px] w-[320px] tSM:w-[280px] p-6">
        <div className="flex flex-col gap-y-4">
          <CustomText
            textLabel={title}
            fontWeight="font-medium"
            fontSize="text-[22px]"
            fontColor="text-black"
          />
          <CustomText
            textLabel={getMessage()}
            fontWeight="font-regular"
            fontSize="text-[16px]"
            fontColor="text-black"
          />
          <div className="flex flex-row justify-end gap-x-4 pt-4">
            <PrimaryButton
              label={cancelText}
              type={BUTTON_TYPES.button}
              buttonType={PRIMARY_BUTTON_TYPE.secondary}
              handleClick={onClose}
              loading={false}
            />
            <PrimaryButton
              label={confirmText}
              type={BUTTON_TYPES.button}
              buttonType={PRIMARY_BUTTON_TYPE.primary}
              handleClick={onConfirm}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
