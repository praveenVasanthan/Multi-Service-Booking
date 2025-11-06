import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useQuery } from "@tanstack/react-query";
import makeRequest from "../../api/makeRequest";
import apiUrls from "../../api/apiUrls";
import Loader from "../../components/Loader";

type Booking = {
  _id: string;
  service: {
    name: string;
    description?: string;
    price: number;
    durationMinutes?: number;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  quantity: number;
  price: number;
};

function formatTime(timeStr: string) {
  let [hours, minutes] = timeStr.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${suffix}`;
}

export default function BookingView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery<Booking>({
    queryKey: ["booking", id],
    queryFn: () => makeRequest(apiUrls.bookings.detail(id as string)),
    enabled: !!id,
  });

  if (isLoading) return <Loader />;

  if (!booking)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Booking not found
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Booking Details
          </Typography>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Service Name
            </Typography>
            <Typography variant="body1">{booking.service.name}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Service Price
            </Typography>
            <Typography variant="body1">₹{booking.service.price}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer Name
            </Typography>
            <Typography variant="body1">{booking.customer.name}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer Email
            </Typography>
            <Typography variant="body1">{booking.customer.email}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Customer Phone
            </Typography>
            <Typography variant="body1">{booking.customer.phone}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Duration
            </Typography>
            <Typography variant="body1">
              {booking.service.durationMinutes} minutes
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1">{booking.date}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Time
            </Typography>
            <Typography variant="body1">{formatTime(booking.time)}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Quantity
            </Typography>
            <Typography variant="body1">{booking.quantity}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Total Price
            </Typography>
            <Typography variant="body1">₹{booking.price}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
