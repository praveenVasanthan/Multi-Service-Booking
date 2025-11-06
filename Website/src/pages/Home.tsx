import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ServiceCard from "../components/ServiceCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import makeRequest from "../api/makeRequest";
import type { Service } from "../types/common";
import apiUrls from "../api/apiUrls";
import Loader from "../components/Loader";
import Cart from "./Cart";
import { useDataContext } from "../context/DataContext";

const Home = () => {
  const [search, setSearch] = useState<string>("");
  const { isAuthenticated } = useDataContext();

  const { data, isLoading } = useQuery({
    queryKey: ["services", search],
    queryFn: () =>
      makeRequest<Service[]>(apiUrls.service.list, "GET", {
        ...(search ? { search } : {}),
      }),
  });

  return (
    <Box
      sx={{
        maxWidth: "1300px",
        mx: "auto",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600}>
          Available Services
        </Typography>

        <TextField
          placeholder="Search services..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "300px" },
            backgroundColor: "background.paper",
          }}
        />
        {isAuthenticated && <Cart />}
      </Box>

      {isLoading ? (
        <Loader />
      ) : (
        <Grid container spacing={3}>
          {data?.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" textAlign="center" mt={4}>
                No matching services found.
              </Typography>
            </Grid>
          ) : (
            data?.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item._id}>
                <ServiceCard data={item} />
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Home;
