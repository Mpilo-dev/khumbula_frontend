import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchAlerts, deleteAlert } from "../redux/features/alertsSlice";
import AlertModal from "../elements/Modals/AlertModal";
import { Alert } from "../redux/features/alertsSlice";
import Logo from "/logo.png";
import { TfiMenu } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import {
  CustomText,
  CustomToggle,
  PrimaryButton,
  SidebarModal,
  ConfirmModal,
} from "../elements";
import { BUTTON_TYPES } from "../helpers/types";
import { PRIMARY_BUTTON_TYPE } from "../elements/Buttons/PrimaryButton";
import { MainAlertCard } from "../components";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { alerts, loading, error } = useSelector(
    (state: RootState) => state.alerts
  );

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [activeDashboard, setActiveDashboard] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [alertToDelete, setAlertToDelete] = useState<Alert | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAlerts());
  }, [dispatch]);

  const handleDeleteAlert = async (alertId: string) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAlert(alertId)).unwrap();
      setShowConfirmModal(false);
      setAlertToDelete(null);
    } catch (error) {
      console.error("Failed to delete alert:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#DEDEDE] flex flex-row justify-center items-center relative">
      {selectedAlert && (
        <AlertModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => {
            setShowConfirmModal(false);
            setAlertToDelete(null);
          }}
          onConfirm={() =>
            alertToDelete && handleDeleteAlert(alertToDelete._id)
          }
          title="Delete Alert"
          message={`Are you sure you want to delete this alert? This action cannot be undone.`}
          confirmText="Delete"
          isLoading={isDeleting}
        />
      )}

      <div className="w-[220px] h-auto absolute top-3 right-3">
        <div className="w-full h-auto p-[1px] bg-[#d5d5d5] rounded-full flex flex-row justify-center items-center">
          <CustomToggle
            titleLeft="Active"
            titleRight="Inactive"
            isSmart={!activeDashboard}
            handleManualClick={() => setActiveDashboard(true)}
            handleSmartClick={() => setActiveDashboard(false)}
            isPrimary={true}
          />
        </div>
      </div>

      <div className="w-[445px] h-[90%] tSM2:h-[100%] flex flex-col bg-white rounded-[14px] tSM2:rounded-none shadow shadow-[#E7F0EF] relative z-0">
        {showSidebar && (
          <SidebarModal handleClose={() => setShowSidebar(false)} />
        )}

        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center border-b-[1px] border-solid border-b-[#E0E0E0]">
          <div
            className="w-auto h-auto cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={Logo}
              className="w-[180px] h-auto tSM:w-[160px]"
              alt="Khumbula logo"
            />
          </div>
          <div
            className="w-auto h-auto cursor-pointer"
            onClick={() => setShowSidebar(true)}
          >
            <TfiMenu
              className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]"
              fill="#1D6A63"
            />
          </div>
        </div>

        {/* Show loading state */}
        {loading && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <CustomText
              textLabel="Loading alerts..."
              fontSize="text-[22px]"
              fontColor="text-black"
              fontWeight="font-regular"
            />
          </div>
        )}

        {/* Show error state */}
        {error && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <CustomText
              textLabel={error}
              fontSize="text-[22px]"
              fontColor="text-red-500"
              fontWeight="font-regular"
            />
          </div>
        )}

        {/* Show alerts */}
        {!loading && !error && (
          <div className="w-full grow flex flex-col gap-y-[16px]">
            {alerts.length > 0 ? (
              <>
                <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
                  <CustomText
                    textLabel={`${alerts.length} total alerts`}
                    fontWeight="font-medium"
                    fontSize="text-[18px]"
                    fontColor="text-black"
                  />

                  <div className="w-fit h-auto">
                    <PrimaryButton
                      label="Create alert"
                      type={BUTTON_TYPES.button}
                      buttonType={PRIMARY_BUTTON_TYPE.secondary}
                      handleClick={() => navigate("/create-alert")}
                      loading={false}
                    />
                  </div>
                </div>

                <div className="w-full h-[calc(100vh-300px)] overflow-y-auto px-[20px]">
                  {alerts.map((alert: Alert, idx: number) => (
                    <MainAlertCard
                      key={alert._id}
                      textLabel={`Alert for ${alert.pills.length} pill(s)`}
                      pillTypes={
                        alert.pills.length === 1
                          ? "1 pill"
                          : `${alert.pills.length} pills`
                      }
                      servingPerDay={`${alert.timesPerDay} times per day`}
                      servingTotal={
                        alert.alertTimes.length * alert.pills.length
                      }
                      alertActive={alert.isActive}
                      handleClick={() => setSelectedAlert(alert)}
                      handleDelete={() => {
                        setAlertToDelete(alert);
                        setShowConfirmModal(true);
                      }}
                      showLine={idx + 1 < alerts.length}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <CustomText
                  textLabel="No alerts created yet..."
                  fontSize="text-[22px]"
                  fontColor="text-black"
                  fontWeight="font-regular"
                />
                <div className="w-fit h-auto pt-[16px]">
                  <PrimaryButton
                    label="Create alert"
                    type={BUTTON_TYPES.button}
                    buttonType={PRIMARY_BUTTON_TYPE.secondary}
                    handleClick={() => navigate("/create-alert")}
                    loading={false}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
