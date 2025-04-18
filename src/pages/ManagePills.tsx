import { useState, useEffect } from "react";
import Logo from "/logo.png";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BackButton,
  CustomText,
  PillModal,
  PrimaryButton,
  ConfirmModal,
} from "../elements";
import { BUTTON_TYPES } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { PillCard } from "../components";
import { RootState, AppDispatch } from "../redux/store";
import { fetchPills, deletePill, Pill } from "../redux/features/pillsSlice";

const ManagePillsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedPill, setSelectedPill] = useState<Pill | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { pills, loading } = useSelector((state: RootState) => state.pills);

  useEffect(() => {
    dispatch(fetchPills());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!selectedPill) return;

    setIsDeleting(true);
    try {
      await dispatch(deletePill(selectedPill._id)).unwrap();
      dispatch(fetchPills()); // Refresh the list
      setShowConfirmModal(false);
      setSelectedPill(null);
    } catch (error) {
      console.error("Failed to delete pill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#DEDEDE] flex flex-row justify-center items-center">
      <div className="w-[445px] h-[90%] tSM2:h-[100%] flex flex-col bg-white rounded-[14px] shadow shadow-[#E7F0EF] relative z-0">
        {showModal && (
          <PillModal
            handleClose={() => {
              setShowModal(false);
              setSelectedPill(null);
            }}
            pill={selectedPill || undefined}
          />
        )}

        {showConfirmModal && (
          <ConfirmModal
            isOpen={showConfirmModal}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedPill(null);
            }}
            onConfirm={handleDelete}
            title="Delete Pill"
            message="Are you sure you want to delete this pill? This action cannot be undone."
            confirmText="Delete"
            isLoading={isDeleting}
          />
        )}

        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center border-b-[1px] border-solid border-b-[#E0E0E0]">
          <div
            className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
            onClick={() => {
              navigate(-1);
            }}
          >
            <BackButton
              textLabel={"My pills"}
              fontWeight="font-semibold"
              fontSize="text-[18px]"
              fontColor={`text-black`}
              hideText={false}
            />
          </div>
          <img
            src={Logo}
            className="w-[180px] h-auto tSM:w-[160px]"
            alt="Khumbula logo"
          />
        </div>

        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
          {pills.length > 0 ? (
            <>
              <CustomText
                textLabel={`${pills.length} total items`}
                fontWeight="font-medium"
                fontSize="text-[18px]"
                fontColor={`text-black`}
              />
              <div className="w-fit h-auto">
                <PrimaryButton
                  label={"Add pill"}
                  type={BUTTON_TYPES.submit}
                  buttonType={PRIMARY_BUTTON_TYPE.secondary}
                  handleClick={() => {
                    setShowModal(true);
                    setSelectedPill(null);
                  }}
                  loading={false}
                />
              </div>
            </>
          ) : (
            <div className="w-full h-[calc(100vh-200px)] flex flex-col justify-center items-center">
              <CustomText
                textLabel="No pills added yet."
                fontWeight="font-medium"
                fontSize="text-[22px]"
                fontColor="text-black"
              />
              <div className="w-fit h-auto pt-[16px]">
                <PrimaryButton
                  label="Add pill"
                  type={BUTTON_TYPES.button}
                  buttonType={PRIMARY_BUTTON_TYPE.secondary}
                  handleClick={() => {
                    setShowModal(true);
                    setSelectedPill(null);
                  }}
                  loading={false}
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-[calc(100vh-300px)] overflow-y-auto px-[20px]">
          {loading ? (
            <CustomText
              textLabel="Loading pills..."
              fontWeight="font-medium"
              fontSize="text-[16px]"
              fontColor="text-gray-500"
            />
          ) : pills.length > 0 ? (
            pills.map((pill, idx) => (
              <PillCard
                key={pill._id}
                textLabel={pill.name}
                servingText={`${pill.capsulesPerServing} per serving`}
                hasAlert={pill.totalCapsules <= 5} // Example alert condition
                handleClick={() => {
                  setSelectedPill(pill);
                  setShowModal(true);
                }}
                handleDelete={() => {
                  setSelectedPill(pill);
                  setShowConfirmModal(true);
                }}
                showLine={idx + 1 < pills.length}
              />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ManagePillsPage;
