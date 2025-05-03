import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import PIllImage from "/pill.png";
import { useNavigate } from "react-router-dom";
import CustomText from "../Text/CustomText";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BUTTON_TYPES, PillCreationValidation } from "../../helpers/types";
import TextInputField from "../Input/TextInputField";
import PrimaryButton, { PRIMARY_BUTTON_TYPE } from "../Buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import {
  createPill,
  updatePill,
  Pill,
  fetchPills,
} from "../../redux/features/pillsSlice";

const MAX_PER_SERVING: number = 3;

type PillFormData = {
  pillName: string;
  totalCapsules: number;
};

type PillModalProps = {
  handleClose: () => void;
  pill?: Pill;
};

const PillModal: React.FC<PillModalProps> = ({ handleClose, pill }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [serving, setServing] = useState<number>(pill?.capsulesPerServing || 1);

  const PillFormDefaultValues: PillFormData = {
    pillName: pill?.name || "",
    totalCapsules: pill?.totalCapsules || 1,
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState,
    formState: { defaultValues, isValid },
    ...rest
  } = useForm<PillFormData>({
    resolver: yupResolver(PillCreationValidation),
    defaultValues: PillFormDefaultValues,
  });

  useEffect(() => {
    if (pill) {
      reset({
        pillName: pill.name,
        totalCapsules: pill.totalCapsules,
      });
      setServing(pill.capsulesPerServing);
    } else {
      reset(PillFormDefaultValues);
    }
  }, [pill, reset]);

  const customHandleSubmit = async (dataResults: PillFormData, e?: any) => {
    e?.preventDefault();

    const pillData = {
      _id: pill?._id,
      name: dataResults.pillName,
      totalCapsules: dataResults.totalCapsules,
      capsulesPerServing: serving,
    };

    try {
      let updatedPill;
      if (pill) {
        updatedPill = await dispatch(updatePill(pillData)).unwrap();
      } else {
        await dispatch(createPill(pillData)).unwrap();
      }
      await dispatch(fetchPills()).unwrap();

      handleClose();
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
    }
  };

  const onError = (errors: any) => {
    setErrorMessage("Please fix the errors before submitting.");
  };

  const renderPills = () => {
    const finalArray: string[] = [];
    for (let i = 0; i < MAX_PER_SERVING; i++) {
      finalArray.push(`${i + 1}`);
    }
    return (
      finalArray &&
      finalArray.map((item, idx: number) => {
        const newLastList: string[] = [];
        for (let v = 0; v < parseInt(item); v++) {
          console.log(`idv: `, v);

          newLastList.push(`${v + 1}`);
        }

        return (
          <div
            key={`item-${idx + 1}`}
            className={`w-auto h-auto rounded-full p-[16px] ${
              parseInt(item) === serving ? "bg-[#FAECB7]" : "bg-white"
            } flex flex-row gap-x-1 active:scale-[1.02] hover:scale-[1.04]`}
            onClick={() => {
              if (parseInt(item) === serving) {
                setServing(0);
              } else {
                setServing(parseInt(item));
              }
            }}
          >
            {newLastList &&
              newLastList.map((item, idv: number) => (
                <img
                  key={`item-${idv + 1}`}
                  src={PIllImage}
                  className="w-auto h-[20px] tSM:h-[18px]"
                  alt="Khumbula pill logo"
                />
              ))}
          </div>
        );
      })
    );
  };

  return (
    <div className="w-full h-[100%] bg-[#00000080] absolute z-10 flex flex-row justify-center items-center">
      <div className="w-[75%] tSM2:w-[85%] h-auto bg-white flex flex-col rounded-sm">
        <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center bg-khumbula_primary border-b-[1px] border-solid border-b-[#E0E0E0] overflow-clip">
          <CustomText
            textLabel={pill ? "Edit pill" : "Add pill"}
            fontWeight="font-medium"
            fontSize="text-[20px]"
            fontColor={`text-white`}
          />
          <div
            className="w-auto h-auto cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
            onClick={handleClose}
          >
            <MdOutlineClose
              className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px] cursor-pointer active:scale-[1.02] hover:scale-[1.04]"
              fill="white"
            />
          </div>
        </div>
        <FormProvider
          control={control}
          handleSubmit={handleSubmit}
          reset={reset}
          setValue={setValue}
          formState={formState}
          {...rest}
        >
          <form
            onSubmit={handleSubmit(customHandleSubmit, onError)}
            className="grow flex flex-col gap-y-4"
          >
            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-center items-center">
              <div className="w-full h-auto self-start">
                <TextInputField
                  name={"pillName"}
                  label={"Pill name"}
                  type={"string"}
                  hideLabel={false}
                />
              </div>
            </div>

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-center items-center bg-[#F7F7F7]">
              <div className="w-full h-auto flex flex-row justify-center items-center">
                <CustomText
                  textLabel={"Total capsules"}
                  fontWeight="font-medium"
                  fontSize="text-[16px]"
                  fontColor={`text-black`}
                />
                <div className="w-auto h-auto self-start">
                  <TextInputField
                    name={"totalCapsules"}
                    label={"Total capsules"}
                    type={"number"}
                    hideLabel={true}
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-auto px-[20px] py-[16px] flex flex-col justify-center bg-[#F7F7F7]">
              <CustomText
                textLabel={"Per serving"}
                fontWeight="font-medium"
                fontSize="text-[16px]"
                fontColor={`text-black`}
              />

              <div className="w-full h-auto px-[20px] py-[16px] flex flex-row justify-between items-center bg-[#F7F7F7]">
                {renderPills()}
              </div>
            </div>

            <div className="w-full h-auto pt-[30px] px-[20px] py-[16px] self-end">
              <PrimaryButton
                label={pill ? "Update pill" : "Create pill"}
                type={BUTTON_TYPES.submit}
                buttonType={PRIMARY_BUTTON_TYPE.primary}
                loading={false}
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default PillModal;
