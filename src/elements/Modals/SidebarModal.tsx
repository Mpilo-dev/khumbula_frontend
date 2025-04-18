import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import Thumbnail from "/thumbnail.png";
import BackButton from "../Buttons/BackButton";
import { useNavigate } from "react-router-dom";
import CustomText from "../Text/CustomText";
import { NavigationCard } from "../../components";

type SidebarModalProps = {
  handleClose: () => void;
};

type OPTION_ITEM = {
  id: string;
  label: string;
  url: string;
};

const OPTIONS_LIST: OPTION_ITEM[] = [
  { id: "profile", label: "My profile", url: "profile" },
  { id: "pills", label: "My pills", url: "pills" },
];

const SidebarModal: React.FC<SidebarModalProps> = ({ handleClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.auth);
  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Loading...";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div
      className="w-full h-[100%] bg-[#00000080] absolute z-10 flex flex-row justify-end"
      onClick={handleClose}
    >
      <div className="w-[75%] h-[100%] bg-white flex flex-col">
        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center">
          <div
            className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
            onClick={handleClose}
          >
            <BackButton
              textLabel={"Back"}
              fontWeight="font-semibold"
              fontSize="text-[18px]"
              fontColor={`text-black`}
              hideText={true}
            />
          </div>
        </div>
        <div className="w-full h-auto border-b-[1px] border-solid border-b-[#E0E0E0] flex flex-col justify-center items-center pb-[16px]">
          <img
            src={Thumbnail}
            className="w-[100px] h-auto tSM:w-[80px]"
            alt="Khumbula thumbnail default logo"
          />

          <CustomText
            textLabel={fullName}
            fontWeight="font-medium"
            fontSize="text-[18px]"
            fontColor={`text-black`}
          />
        </div>
        <div className="w-full grow flex flex-col justify-between">
          <div className="w-full h-[180px]">
            {OPTIONS_LIST.map((item) => (
              <div key={item.id} className="cursor-pointer">
                <NavigationCard
                  textLabel={item.label}
                  handleClick={() => {
                    navigate(`/${item.url}`);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="w-full h-auto flex flex-row justify-end p-[16px]">
            <div
              className="w-fit h-auto px-[16px] py-[4px] bg-[#F8F8F8] rounded-full cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
              onClick={handleLogout}
            >
              <CustomText
                textLabel={"Logout"}
                fontWeight="font-medium"
                fontSize="text-[18px]"
                fontColor={`text-black`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarModal;
