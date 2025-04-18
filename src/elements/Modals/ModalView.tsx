import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import React, { ReactElement } from "react";
import { useParams } from "react-router-dom";

type ModalViewProps = {
  show: boolean;
  children: ReactElement;
  handleClose: () => void;
};

const ModalView: React.FC<ModalViewProps> = ({
  show,
  children,
  handleClose,
}) => {
  const { stage } = useParams();

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      className="w-full h-auto relative z-50 flex justify-center"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 tSM:p-0">
        <DialogPanel>
          <div className={`w-full h-auto flex justify-center`}>{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ModalView;
