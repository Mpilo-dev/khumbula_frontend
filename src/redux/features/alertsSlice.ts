import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../helpers/axiosInstance";
import { Pill } from "./pillsSlice";

export interface AlertTime {
  hours: number;
  minutes: number;
}

export interface Alert {
  _id: string;
  daysOfWeek: string[];
  timesPerDay: number;
  alertTimes: AlertTime[];
  isActive: boolean;
  user: string;
  pills: Pill[];
}

export interface AlertsState {
  alerts: Alert[];
  selectedPills: string[];
  timesPerDay: number;
  alertTimes: AlertTime[];
  daysOfWeek: string[];
  isActive: boolean;
  loading: boolean;
  error: string | null;
}

const initialAlertsState: AlertsState = {
  alerts: [],
  selectedPills: [],
  timesPerDay: 1,
  alertTimes: [],
  daysOfWeek: [],
  isActive: true,
  loading: false,
  error: null,
};

export const createAlert = createAsyncThunk<
  Alert,
  Partial<Alert>,
  { rejectValue: string; state: { alerts: AlertsState } }
>("alerts/createAlert", async (alertData, { rejectWithValue }) => {
  try {
    // Format the alert times as strings in HH:mm format
    const formattedAlertTimes = (alertData.alertTimes || []).map((time) => {
      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    // Ensure all required fields are present and properly formatted
    const formattedData = {
      ...alertData,
      daysOfWeek: alertData.daysOfWeek || [],
      timesPerDay: Number(alertData.timesPerDay) || 1,
      alertTimes: formattedAlertTimes,
      pills: alertData.pills || [],
      isActive: Boolean(alertData.isActive),
    };

    console.log("Sending formatted data to backend:", formattedData);

    const response = await api.post("/api/v1/alerts", formattedData);
    return response.data.data.alert;
  } catch (error: any) {
    console.error("Error creating alert:", error.response?.data);
    return rejectWithValue(
      error.response?.data?.message || "Failed to create alert"
    );
  }
});

export const fetchAlerts = createAsyncThunk<
  Alert[],
  void,
  { rejectValue: string }
>("alerts/fetchAlerts", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/v1/alerts");

    return response.data.data.alerts;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch alerts"
    );
  }
});

export const deleteAlert = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("alerts/deleteAlert", async (alertId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/v1/alerts/${alertId}`);

    return alertId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete alert"
    );
  }
});

export const updateAlert = createAsyncThunk<
  Alert,
  { id: string; data: Partial<Alert> },
  { rejectValue: string }
>("alerts/updateAlert", async ({ id, data }, { rejectWithValue }) => {
  try {
    // Format the alert times as strings in HH:mm format
    const formattedAlertTimes = (data.alertTimes || []).map((time) => {
      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");
      return `${hours}:${minutes}`;
    });

    const formattedData = {
      ...data,
      alertTimes: formattedAlertTimes,
    };

    const response = await api.patch(`/api/v1/alerts/${id}`, formattedData);
    return response.data.data.alert;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update alert"
    );
  }
});

const alertsSlice = createSlice({
  name: "alerts",
  initialState: initialAlertsState,
  reducers: {
    setSelectedPills: (state, action: PayloadAction<string[]>) => {
      state.selectedPills = action.payload;
    },
    clearSelectedPills: (state) => {
      state.selectedPills = [];
    },
    setTimesPerDay: (state, action: PayloadAction<number>) => {
      state.timesPerDay = action.payload;
    },
    clearTimesPerDay: (state) => {
      state.timesPerDay = 1;
    },
    setAlertTimes: (
      state,
      action: PayloadAction<{ hours: number; minutes: number }[]>
    ) => {
      state.alertTimes = action.payload;
    },
    clearAlertTimes: (state) => {
      state.alertTimes = [];
    },
    setIsActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    clearIsActive: (state) => {
      state.isActive = true;
    },
    setDaysOfWeek: (state, action: PayloadAction<string[]>) => {
      state.daysOfWeek = action.payload;
    },
    clearDaysOfWeek: (state) => {
      state.daysOfWeek = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })
      .addCase(createAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts.push(action.payload);
        state.selectedPills = [];
        state.alertTimes = [];
      })
      .addCase(createAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create alert";
      })

      .addCase(deleteAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = state.alerts.filter(
          (alert) => alert._id !== action.payload
        );
      })
      .addCase(deleteAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete alert";
      })

      .addCase(updateAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = state.alerts.map((alert) =>
          alert._id === action.payload._id ? action.payload : alert
        );
      })
      .addCase(updateAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update alert";
      });
  },
});

export const {
  setSelectedPills,
  clearSelectedPills,
  setAlertTimes,
  clearAlertTimes,
  setTimesPerDay,
  clearTimesPerDay,
  setIsActive,
  clearIsActive,
  setDaysOfWeek,
  clearDaysOfWeek,
} = alertsSlice.actions;

export default alertsSlice.reducer;
