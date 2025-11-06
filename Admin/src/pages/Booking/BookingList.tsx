import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import makeRequest from "../../api/makeRequest";
import type { Booking } from "../../types/common";
import apiUrls from "../../api/apiUrls";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import Box from "@mui/material/Box";

const columns = {
  customerName: "Customer",
  customerPhone: "Phone",
  serviceName: "Service",
  date: "Date",
  time: "Time",
  quantity: "Quantity",
  price: "Price",
};

export default function BookingList() {
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => makeRequest<Booking[]>(apiUrls.bookings.list),
  });

  return (
    <>
      <Box>
        <Typography variant="h6" my={2}>
          Booking
        </Typography>
      </Box>
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={data || []}
          redirectPath="booking/detail"
        />
      )}
    </>
  );
}
