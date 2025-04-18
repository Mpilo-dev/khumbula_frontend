import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../helpers/axiosInstance";

export interface Pill {
  _id: string;
  name: string;
  totalCapsules: number;
  capsulesPerServing: number;
}

export interface PillsState {
  pills: Pill[];
  loading: boolean;
  error: string | null;
  message: string | null;
}

// Initial state
const initialState: PillsState = {
  pills: [],
  loading: false,
  error: null,
  message: null,
};

// Async thunk to create pills
export const createPill = createAsyncThunk(
  "pills/createPill",
  async (
    { name, totalCapsules, capsulesPerServing }: Omit<Pill, "_id">,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("api/v1/pills", {
        name,
        totalCapsules,
        capsulesPerServing,
      });
      return response.data.data.pill;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create pill"
      );
    }
  }
);

// Async thunk to fetch pills
export const fetchPills = createAsyncThunk(
  "pills/fetchPills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("api/v1/pills");
      return response.data.data.pills;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pills"
      );
    }
  }
);

// Async thunk to update pills
export const updatePill = createAsyncThunk(
  "pills/updatePill",
  async (
    { _id, name, totalCapsules, capsulesPerServing }: Pill,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`api/v1/pills/${_id}`, {
        name,
        totalCapsules,
        capsulesPerServing,
      });
      return response.data.data.pill;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update pill"
      );
    }
  }
);

// Async thunk to delete pills
export const deletePill = createAsyncThunk(
  "pills/deletePill",
  async (_id: string, { rejectWithValue }) => {
    try {
      await api.delete(`api/v1/pills/${_id}`);
      return _id; // Return the deleted pill's ID
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete pill"
      );
    }
  }
);

const pillsSlice = createSlice({
  name: "pills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPills.fulfilled, (state, action) => {
        state.loading = false;
        state.pills = action.payload;
      })
      .addCase(fetchPills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // create pills
      .addCase(createPill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPill.fulfilled, (state, action) => {
        state.loading = false;
        state.pills.push(action.payload);
      })
      .addCase(createPill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //   Updating
      .addCase(updatePill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePill.fulfilled, (state, action) => {
        if (!action.payload || !action.payload._id) {
          console.error(
            "Redux: Received undefined pill update",
            action.payload
          );
          return;
        }

        state.loading = false;
        state.pills = state.pills.map((pill) =>
          pill._id === action.payload._id ? action.payload : pill
        );
      })
      .addCase(updatePill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleting
      .addCase(deletePill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePill.fulfilled, (state, action) => {
        state.loading = false;
        state.pills = state.pills.filter((pill) => pill._id !== action.payload);
      })
      .addCase(deletePill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const pillsReducer = pillsSlice.reducer;
