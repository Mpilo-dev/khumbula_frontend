import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface Props {
  message: string;
}

const ToolTipField: React.FC<Props> = ({ message }: Props) => {
  const [showTool, setShowTool] = useState<boolean>(false);
  return (
    <div>
      <TooltipProvider>
        <Tooltip open={showTool}>
          <TooltipTrigger
            type="button"
            className="w-[24px] h-[24px] font-regular rounded-full bg-[#e5e5e5]"
            onClick={() => setShowTool(!showTool)}
          >
            i
          </TooltipTrigger>
          <TooltipContent className="max-w-[200px] h-auto bg-[#e5e5e5]">
            <p>{message}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ToolTipField;
