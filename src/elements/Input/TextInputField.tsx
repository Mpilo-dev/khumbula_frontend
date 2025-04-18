import React, { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FaRegEyeSlash as EyeClosed } from "react-icons/fa";
import { IoEyeOutline as EyeOpened } from "react-icons/io5";

interface Props {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  hideLabel: boolean;
  type: string;
  className?: string;
  charCount?: number;
  disable?: boolean;
}

const TextInputField: React.FC<Props> = ({
  name,
  label,
  value,
  placeholder,
  hideLabel = false,
  className,
  type,
  charCount,
  disable = false,
  ...props
}: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [showPass, setShowPass] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [inFocus, setInFocus] = useState(false);
  const [characterCount, setCharacterCount] = useState<number>(0);

  useEffect(() => {
    if (!inFocus && inputValue) {
      setInFocus(true);
    }

    if (parseInt(inputValue || "") === 0) {
      setInFocus(false);
    }
  }, [inputValue, inFocus]);

  const handleChange = (event: any): void => {
    const val = event.target.value;
    //console.log(`handleChange: `, val);

    if (type === "text" && charCount) {
      const onlyText = val.replace(/\s/g, "");
      setCharacterCount(onlyText.length);
      if (characterCount < charCount) {
        setInputValue(val);
        setValue(name, val, { shouldValidate: true }); //updates the value on the Mother Context
      }
    } else {
      setInputValue(val);
      setValue(name, val, { shouldValidate: true }); //updates the value on the Mother Context
    }
  };

  const handleBlur = (): void => {
    if (inputValue?.length === 0) {
      setInFocus(false);
    }
  };

  const handleFocus = (): void => {
    setInFocus(true);
  };

  const handleCharacterLimit = useCallback(
    (e: any) => {
      if (charCount) {
        if (characterCount == charCount && e.key !== "Backspace") {
          e.preventDefault();
        }
        if (characterCount != 0 && e.key == "Backspace")
          setCharacterCount(characterCount - 1);
      }
    },
    [characterCount]
  );

  return (
    <div className="w-full h-auto flex flex-col gap-y-2 relative">
      {!hideLabel && (
        <label
          htmlFor={`input-${name}`}
          className="text-sm font-medium text-black text-[20px] tMD:text-[16px] mMD:text-[14px] mSM:text-[12px]  font-poppins leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ps-6 tMD:px-3"
        >
          {label}
        </label>
      )}
      <input
        {...register(name)}
        id={`input-${name}`}
        disabled={disable}
        name={name}
        type={showPass ? "text" : type}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleCharacterLimit}
        placeholder={placeholder ? placeholder : label}
        {...props}
        className={`w-full h-auto border-solid border-[1.25px] ${
          errors[name]
            ? "border-[#e22b2b]"
            : inFocus
            ? "border-gosolr_primary"
            : "border-black"
        } rounded-full p-[7.5px] px-6 outline-none tMD:p-1 tMD:px-3 text-[16px] tMD:text-[14px] tMD:placeholder:text-[14px]  mSM:placeholder:text-[12px]`}
      />

      <div className="w-auto h-auto absolute top-8 right-3 tMD:top-[30px] mMD:top-[26px] cursor-pointer active:scale-[1.02] hover:scale-[1.06]">
        {type === "password" && !showPass && (
          <EyeOpened
            className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]"
            onClick={() => setShowPass(true)}
          />
        )}

        {showPass && (
          <EyeClosed
            className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]"
            onClick={() => setShowPass(false)}
          />
        )}
      </div>

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <div className="w-full h-auto flex justify-end pl-4 mMD:pl-2">
            <span className="text-sm font-medium text-[#e22b2b] text-[12px] mMD:text-[10px] font-poppins">
              {message}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default TextInputField;
