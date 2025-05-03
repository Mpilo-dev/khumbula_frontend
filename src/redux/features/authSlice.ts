import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../helpers/axiosInstance";

export interface AuthState {
  user: {
    username?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    otp?: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: {
      firstName: string;
      lastName: string;
      username: string;
      password: string;
      gender: string;
      dateOfBirth: string;
      phoneNumber: string;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("Registering user with data:", userData);

      const response = await api.post("api/v1/auth/signup", userData);
      console.log("Register API Response:", response.data);

      // Return the phone number for OTP verification
      return {
        phoneNumber: userData.phoneNumber,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Register API Error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { userName: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("api/v1/auth/login", credentials);
      console.log(response);
      const { token, data } = response.data;
      const { user } = data;

      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (
    updatedProfile: Partial<AuthState["user"]>,
    { rejectWithValue, getState }
  ) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const token = auth.token;

      if (!token) throw new Error("Unauthorized");
      if (!updatedProfile) throw new Error("No profile data provided");

      const response = await api.patch(
        "api/v1/users/updateMe",
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Handle 202 status (OTP sent case)
      if (response.status === 202) {
        return {
          status: "pending",
          message: response.data.message,
          phoneNumber: updatedProfile.phoneNumber || "",
          user: response.data.data?.user || auth.user,
        };
      }

      if (response.data?.status !== "success") {
        throw new Error(response.data?.message || "Update rejected by server");
      }
      return response.data.data.user;
    } catch (error: any) {
      console.error("API Error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Profile update failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔥 Forgot Password Thunk (Request OTP)
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      console.log("Forgot Password Request:", {
        phoneNumber,
        // purpose: "resetPassword",
      }); // ✅ Debug log

      const response = await api.post("api/v1/auth/forgotPassword", {
        phoneNumber,
        // purpose: "resetPassword", // ✅ Specify OTP purpose
      });

      localStorage.setItem("forgotPasswordPhone", phoneNumber);

      return {
        message: response.data.message,
        phoneNumber,
        // otpPurpose: "resetPassword",
      }; // ✅ Return phone number
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP request failed"
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const phoneNumber = auth.user?.phoneNumber;

      if (!phoneNumber) {
        throw new Error("Phone number is missing. Please request OTP again.");
      }

      const response = await api.post("api/v1/auth/resend-otp", {
        phoneNumber,
      });
      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP resend failed"
      );
    }
  }
);

// 🔥 Reset Password Thunk
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    {
      phoneNumber,
      otp,
      newPassword,
    }: { phoneNumber: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      console.log("Reset Password API Call:", {
        phoneNumber,
        otp,
        newPassword,
      });

      const response = await api.post("api/v1/auth/resetPassword", {
        phoneNumber,
        otp,
        newPassword,
      });
      return response.data.message; // ✅ Return success message
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (
    {
      phoneNumber,
      otp,
      purpose,
    }: {
      phoneNumber: string;
      otp: string;
      purpose: "phoneVerification" | "resetPassword";
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("Verifying OTP with data:", {
        phoneNumber,
        otp,
        otpPurpose: purpose,
      });

      const response = await api.post("api/v1/auth/verify-otp", {
        phoneNumber,
        otp,
        otpPurpose: purpose,
      });

      console.log("OTP verification response:", response.data);

      if (response.data.status !== "success") {
        throw new Error(response.data.message || "OTP verification failed");
      }

      return {
        data: response.data,
        purpose,
      };
    } catch (error: any) {
      console.error("OTP verification error:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Invalid or expired OTP."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔥 Handle Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 🔥 Handle Profile Update
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Merge updated data
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 🔥 Handle Forgot Password OTP Request
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      // .addCase(forgotPassword.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.message = action.payload.message;
      //   state.user = {
      //     ...state.user,
      //     phoneNumber: action.payload.phoneNumber,
      //     // otpPurpose: "resetPassword", // ✅ Store OTP purpose
      //   };
      // })
      // In your forgotPassword.fulfilled case, update it to:
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Create user object if it doesn't exist
        if (!state.user) {
          state.user = {
            phoneNumber: action.payload.phoneNumber,
          };
        } else {
          // Update existing user
          state.user.phoneNumber = action.payload.phoneNumber;
        }
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // resend otp
      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload; // ✅ Show success message
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 🔥 Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload; // ✅ Show success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // verify OTP
      .addCase(verifyOtp.pending, (state) => {
        console.log("OTP verification pending...");
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        console.log("OTP verification successful:", action.payload);
        state.loading = false;
        state.message = "OTP verified successfully!";

        // Store token if present in response
        if (action.payload.data.token) {
          state.token = action.payload.data.token;
        }

        // Store complete user data from response
        if (action.payload.data.data?.user) {
          state.user = action.payload.data.data.user;
        }

        localStorage.removeItem("forgotPasswordPhone");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        console.log("OTP verification failed:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Store phone number in state for OTP verification
        if (!state.user) {
          state.user = {
            phoneNumber: action.payload.phoneNumber,
          };
        } else {
          state.user.phoneNumber = action.payload.phoneNumber;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
