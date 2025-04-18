import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SelectChild } from "../../helpers/types";
import { useFormContext } from "react-hook-form";
import ToolTipField from "../ToolTipField";

const DEFAUL_VALUES: SelectChild[] = [
  { value: "est", label: "Eastern Standard Time (EST)" },
  { value: "cst", label: "Central Standard Time (CST)" },
  { value: "mst", label: "Mountain Standard Time (MST)" },
  { value: "pst", label: "Pacific Standard Time (PST" },
  { value: "akst", label: "Alaska Standard Time (AKST)" },
  { value: "hst", label: "Hawaii Standard Time (HST)" },
];

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  hideLabel?: boolean;
  listItem?: SelectChild[];
  handleValueChange?: (e: string) => void;
  handleEffects?: () => void;
  value?: string;
  toolTipMessage?: string;
}

const SelectField: React.FC<Props> = ({
  name,
  label,
  hideLabel = false,
  placeholder = "",
  listItem = DEFAUL_VALUES,
  handleValueChange,
  handleEffects,
  value,
  toolTipMessage,
}: Props) => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full h-auto flex flex-col gap-y-2">
      {!hideLabel && (
        <div className="w-full h-auto flex flex-row gap-x-2 items-center">
          <label
            htmlFor={`input-${name}`}
            className="text-sm font-medium text-black text-[20px] mSM:text-[12px] font-poppins leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ps-6 tMD:ps-3"
          >
            {label}
          </label>
          {toolTipMessage && <ToolTipField message={toolTipMessage} />}
        </div>
      )}
      <Select
        onValueChange={(e: string) => {
          handleEffects && handleEffects();
          handleValueChange && handleValueChange(e);
        }}
      >
        <SelectTrigger
          className={`w-full h-auto border-solid ${
            errors[name] ? "border-[#e22b2b]" : "border-black"
          } border-[1.25px] 
         rounded-full p-2 px-6 tMD:p-1 tMD:px-3 outline-none ring-0 focus:ring-0 text-[16px] tMD:text-[14px] tMD:placeholder:text-[14px]  mSM:placeholder:text-[12px]`}
        >
          <SelectValue placeholder={value ? value : placeholder || label} />
        </SelectTrigger>
        <SelectContent
          className="focus:outline-none"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {listItem.map((myItem, idx) => (
              <SelectItem
                key={`select-item-${idx} + 1`}
                value={myItem.value}
              >{`${myItem.label}`}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
