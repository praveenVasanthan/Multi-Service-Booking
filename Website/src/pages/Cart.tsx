import { useState, useMemo } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useQuery, useMutation } from "@tanstack/react-query";
import makeRequest from "../api/makeRequest";
import apiUrls from "../api/apiUrls";
import { type Cart } from "../types/common";
import { queryClient } from "../App";
import Loader from "../components/Loader";
import BookSlotModal from "../components/BookSlotModel";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleBookSlot = (serviceId: string, cartId: string) => {
    setSelectedService(serviceId);
    setCartId(cartId);
    setOpenModal(true);
  };

  const { data: cartItems = [], isLoading } = useQuery<Cart[]>({
    queryKey: ["carts"],
    queryFn: () => makeRequest(apiUrls.cart.list),
  });

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const updateQuantity = useMutation({
    mutationFn: (payload: { id: string; quantity: number }) =>
      makeRequest(apiUrls.cart.edit(payload.id), "PUT", {
        quantity: payload.quantity,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  });

  const removeItem = useMutation({
    mutationFn: (id: string) => makeRequest(apiUrls.cart.delete(id), "DELETE"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  });

  const handleIncrease = (id: string, currentQty: number) => {
    updateQuantity.mutate({ id, quantity: currentQty + 1 });
  };

  const handleDecrease = (id: string, currentQty: number) => {
    if (currentQty > 1) updateQuantity.mutate({ id, quantity: currentQty - 1 });
  };

  const handleRemove = (id: string) => {
    removeItem.mutate(id);
  };

  return (
    <>
      <Box position="fixed" bottom={16} right={16} zIndex={1000}>
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <Badge badgeContent={cartItems.length} color="error">
            <ShoppingCartIcon sx={{ fontSize: 30 }} />
          </Badge>
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 380 },
              p: 2,
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {isLoading ? (
          <Loader />
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {cartItems.length === 0 ? (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ mt: 4 }}
              >
                No matching services found.
              </Typography>
            ) : (
              <List>
                {cartItems.map((item) => (
                  <ListItem
                    key={item._id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderBottom: "1px solid #eee",
                      pb: 2,
                      mb: 1,
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      width="100%"
                      gap={2}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={item.service.imageUrl}
                          alt={item.service.name}
                          sx={{ width: 48, height: 48 }}
                        />
                      </ListItemAvatar>

                      <ListItemText
                        primary={item.service.name}
                        secondary={`₹${item.service.price} × ${
                          item.quantity
                        } = ₹${item.service.price * item.quantity}`}
                      />

                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleDecrease(item._id, item.quantity)
                          }
                          disabled={item.quantity === 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleIncrease(item._id, item.quantity)
                          }
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      mt={1}
                      width="100%"
                      display="flex"
                      justifyContent="flex-end"
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ mr: 2 }}
                        onClick={() => handleRemove(item._id)}
                      >
                        Remove
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          handleBookSlot(item.service._id, item._id)
                        }
                      >
                        Book Slot
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {cartItems.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" textAlign="right" mb={2}>
              Total: Rs.{totalPrice}
            </Typography>
          </>
        )}
      </Drawer>
      <BookSlotModal
        serviceId={selectedService as string}
        open={openModal}
        onClose={() => setOpenModal(false)}
        cartId={cartId as string}
      />
    </>
  );
};

export default CartDrawer;
