import * as Yup from "yup";

export enum BUTTON_TYPES {
  button = "button",
  reset = "reset",
  submit = "submit",
}

export type SelectChild = {
  id?: string;
  value: string;
  label: string;
};

// export const WelcomePageValidation = Yup.object().shape({
//   usernamePhone: Yup.string().required("Username or phone number is required"),
//   password: Yup.string()
//     .matches(
//       /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
//       "Min. 8 characters: uppercase, numbers, special character"
//     )
//     .required("Password is required"),
// });

export const WelcomePageValidation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const ForgotPasswordValidation = Yup.object().shape({
  phoneNumber: Yup.string().required("Username or phone number is required"),
});

export const RegisterValidation = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection")
    .required("Gender is required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

export const PillCreationValidation = Yup.object().shape({
  pillName: Yup.string().required("Pill name is required"),
  totalCapsules: Yup.number()
    .typeError("Total number of capsules is required")
    .required("Total number of capsules is required")
    .min(1, "Total capsules must be at least 1"),
});

export const AlertValidationSchema = Yup.object().shape({
  daysOfWeek: Yup.array()
    .of(
      Yup.string().oneOf([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ])
    )
    .min(1, "Please select at least one day")
    .required("Days of the week are required"),

  timesPerDay: Yup.number()
    .integer("Times per day must be an integer")
    .min(1, "You must have at least one alert per day")
    .required("Times per day is required"),

  alertTimes: Yup.array()
    .of(
      Yup.object().shape({
        hours: Yup.number()
          .min(0, "Hours must be between 0 and 23")
          .max(23, "Hours must be between 0 and 23")
          .required("Hours are required"),
        minutes: Yup.number()
          .min(0, "Minutes must be between 0 and 59")
          .max(59, "Minutes must be between 0 and 59")
          .required("Minutes are required"),
      })
    )
    .min(1, "You must add at least one alert time"),

  isActive: Yup.boolean().required(),

  pills: Yup.array()
    .of(Yup.string().required("Pill ID is required"))
    .min(1, "Please select at least one pill"),
});

export const ResetPasswordValidation = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export const VerifyOtpValidation = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Invalid phone number format") // Supports E.164 format
    .required("Phone number is required"),

  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits") // Assuming OTP is numeric and between 4-6 digits
    .required("OTP is required"),
});

export const UpdateMeValidation = Yup.object().shape({
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
  userName: Yup.string().optional(),
  gender: Yup.string()
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection")
    .optional(),
  dateOfBirth: Yup.string().optional(),
  phoneNumber: Yup.string().optional(),
});
