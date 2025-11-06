import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import makeRequest from "../../api/makeRequest";
import type { Service } from "../../types/common";
import apiUrls from "../../api/apiUrls";
import Loader from "../../components/Loader";
import DataTable from "../../components/DataTable";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const columns = {
  image: "Image",
  name: "Name",
  price: "Price",
  duration: "Duration",
};

export default function ServiceList() {
  const { data, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => makeRequest<Service[]>(apiUrls.service.list),
  });

  const navigate = useNavigate();
  const mappedData = data?.map((item) => ({
    _id: item._id,
    name: item.name,
    price: item.price,
    duration: item.durationMinutes,
    image: item.imageUrl,
  }));
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h6" my={2}>
          Services
        </Typography>
        <Button variant="contained" onClick={() => navigate("/form")}>
          Add service
        </Button>
      </Box>
      {isLoading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={mappedData || []}
          redirectPath="form"
        />
      )}
    </>
  );
}
