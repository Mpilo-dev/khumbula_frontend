import React, { useState } from "react";
import { Pill } from "../../redux/features/pillsSlice";
import { CustomText, PrimaryButton } from "../index";
import { BUTTON_TYPES } from "../../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../Buttons/PrimaryButton";
import { MdOutlineClose } from "react-icons/md";

interface PillListModalProps {
  open: boolean;
  onClose: (selectedPillIds: string[]) => void;
  pills: Pill[];
  selectedPills: string[];
}

const PillListModal: React.FC<PillListModalProps> = ({
  open,
  onClose,
  pills,
  selectedPills,
}) => {
  const [selectedPillIds, setSelectedPillIds] =
    useState<string[]>(selectedPills);

  const handlePillClick = (pillId: string) => {
    setSelectedPillIds((prev) =>
      prev.includes(pillId)
        ? prev.filter((id) => id !== pillId)
        : [...prev, pillId]
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#00000080] flex justify-center items-center z-50">
      <div className="w-[90%] max-w-[400px] h-auto max-h-[80vh] bg-white flex flex-col rounded-md shadow-lg">
        {/* Modal Header */}
        <div className="w-full px-[20px] py-[16px] flex flex-row justify-between items-center border-b-[1px] border-solid border-[#E0E0E0]">
          <CustomText
            textLabel="Select Pills"
            fontWeight="font-semibold"
            fontSize="text-[18px]"
            fontColor="text-black"
          />
          <button
            onClick={() => onClose(selectedPillIds)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <div className="w-full px-[20px] py-[16px] overflow-y-auto">
          <div className="flex flex-col space-y-2">
            {pills.map((pill) => (
              <div
                key={pill._id}
                className={`w-full h-auto p-[12px] rounded-lg cursor-pointer ${
                  selectedPillIds.includes(pill._id)
                    ? "bg-[#E7F0EF]"
                    : "bg-white"
                } border border-[#E0E0E0]`}
                onClick={() => handlePillClick(pill._id)}
              >
                <div className="flex flex-row justify-between items-center">
                  <CustomText
                    textLabel={pill.name}
                    fontWeight="font-medium"
                    fontSize="text-[16px]"
                    fontColor={
                      selectedPillIds.includes(pill._id)
                        ? "text-[#1D6A63]"
                        : "text-black"
                    }
                  />
                  <CustomText
                    textLabel={`${pill.capsulesPerServing} per serving`}
                    fontWeight="font-regular"
                    fontSize="text-[14px]"
                    fontColor="text-gray-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="w-full px-[20px] py-[16px] border-t-[1px] border-solid border-[#E0E0E0]">
          <PrimaryButton
            label="Confirm Selection"
            type={BUTTON_TYPES.button}
            buttonType={PRIMARY_BUTTON_TYPE.primary}
            handleClick={() => onClose(selectedPillIds)}
          />
        </div>
      </div>
    </div>
  );
};

export default PillListModal;
