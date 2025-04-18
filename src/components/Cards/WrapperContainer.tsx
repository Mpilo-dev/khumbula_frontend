import React, { ReactElement } from "react";

type WrapperContainerProps = {
  children: ReactElement;
};

const WrapperContainer: React.FC<WrapperContainerProps> = ({ children }) => {
  return (
    <div className="w-[445px] h-[90%] tSM2:h-[100%] flex flex-col bg-white rounded-[14px] tSM2:rounded-none shadow shadow-[#E7F0EF] relative z-0">
      {children}
    </div>
  );
};

export default WrapperContainer;
