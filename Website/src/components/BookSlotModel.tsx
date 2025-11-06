import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import makeRequest from "../api/makeRequest";
import apiUrls from "../api/apiUrls";
import { queryClient } from "../App";

interface BookSlotModalProps {
  open: boolean;
  onClose: () => void;
  serviceId: string;
  cartId: string;
}

type Response = {
  bookedTimes: string[];
};

type FormData = {
  name: string;
  email: string;
  phone: string;
};

export default function BookSlotModal({
  open,
  onClose,
  serviceId,
  cartId,
}: BookSlotModalProps) {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [time, setTime] = useState<Dayjs | null>(null);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["slots", date, serviceId],
    queryFn: async () =>
      makeRequest<Response>(apiUrls.availability.list, "GET", {
        serviceId,
        date: date?.format("YYYY-MM-DD"),
      }),
    enabled: !!date && !!serviceId,
  });

  // Booking mutation
  const bookingMutation = useMutation({
    mutationFn: (payload: {
      serviceId: string;
      cartId: string;
      date: string;
      time: string;
      name: string;
      email: string;
      phone: string;
    }) => makeRequest(apiUrls.booking.add, "POST", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      reset();
      setDate(null);
      setTime(null);
      onClose();
    },
    onError: (error: any) => {
      console.error("Booking failed", error);
    },
  });

  const shouldDisableTime = (value: Dayjs): boolean => {
    if (!value || !data?.bookedTimes) return false;

    const formatted = value.format("HH:mm");

    if (data.bookedTimes.includes(formatted)) return true;

    if (date && date.isSame(dayjs(), "day")) {
      const now = dayjs();
      if (value.isBefore(now, "minute")) return true;
    }

    return false;
  };

  const onSubmit = (formData: FormData) => {
    if (!date || !time) return;

    bookingMutation.mutate({
      serviceId,
      cartId,
      date: date.format("YYYY-MM-DD"),
      time: time.format("HH:mm"),
      ...formData,
    });
  };

  const isTimeUnavailable =
    time && data?.bookedTimes?.includes(time.format("HH:mm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={600}>
          Book a Time Slot
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Select a date, time, and enter your details. Unavailable times will be
          disabled.
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DatePicker
            label="Select Date"
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
              setTime(null);
            }}
            shouldDisableDate={(d) => d.isBefore(dayjs(), "day")}
            slotProps={{
              textField: { fullWidth: true, size: "small" },
            }}
          />

          <Box>
            <TimePicker
              label={isLoading ? "Checking availability..." : "Select Time"}
              value={time}
              onChange={(newValue) => setTime(newValue)}
              shouldDisableTime={shouldDisableTime}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!isTimeUnavailable,
                  helperText: isTimeUnavailable
                    ? "This time slot is unavailable."
                    : undefined,
                },
              }}
              disabled={!date || isLoading}
            />
          </Box>

          {/* Customer Info */}
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                fullWidth
                size="small"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                fullWidth
                size="small"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid phone number",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Phone"
                fullWidth
                size="small"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={!date || !time || bookingMutation.isPending}
              startIcon={
                bookingMutation.isPending ? (
                  <CircularProgress color="inherit" size={18} />
                ) : undefined
              }
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Slot"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
