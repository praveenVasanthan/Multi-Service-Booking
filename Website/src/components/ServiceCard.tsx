import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import type { Service } from "../types/common";
import { useMutation } from "@tanstack/react-query";
import makeRequest from "../api/makeRequest";
import apiUrls from "../api/apiUrls";
import { queryClient } from "../App";
import defaultImage from "../assets/default_image.jpg";
import { useState } from "react";
import AuthModal from "./AuthModel";
import { useDataContext } from "../context/DataContext";

export default function ServiceCard({ data }: { data: Service }) {
  const [open, setOpen] = useState<boolean>(false);
  const { isAuthenticated } = useDataContext();
  const mutation = useMutation({
    mutationKey: ["addToCart"],
    mutationFn: () =>
      makeRequest(apiUrls.cart.add, "POST", { service: data._id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  });

  const handleAddToCart = () => {
    isAuthenticated ? mutation.mutate() : setOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        width: "100%",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 340,
          height: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
          },
          backgroundColor: "#fff",
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight={600}>
              {data.name}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              ₹{data.price} • {data.durationMinutes} min
            </Typography>
          }
          sx={{
            pb: 0,
          }}
        />

        <CardMedia
          component="img"
          height="180"
          image={data.imageUrl || defaultImage}
          alt={data.name}
          sx={{
            objectFit: "contain",
            p: 2,
            backgroundColor: "#fafafa",
            borderRadius: "12px",
          }}
        />

        <CardContent
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            px: 2,
            pt: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              minHeight: "3.8em",
            }}
          >
            {data.description}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "flex-end",
            px: 2,
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              py: 0.8,
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              },
            }}
            onClick={handleAddToCart}
            loading={mutation.isPending}
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
