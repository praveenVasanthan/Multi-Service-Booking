import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import makeRequest from "../api/makeRequest";
import apiUrls from "../api/apiUrls";
import { AUTH_TOKEN_KEY } from "../config/AppConstants";
import { useDataContext } from "../context/DataContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 300, sm: 400 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: { xs: 3, sm: 4 },
};

type ApiResponse = {
  message: string;
  token: string;
};

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);
  const { setIsAuthenticated } = useDataContext();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: loginReset,
    formState: { errors: loginErrors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    reset: registerReset,
    formState: { errors: registerErrors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginFormInputs) =>
      makeRequest<ApiResponse>(apiUrls.login, "POST", data),
    onSuccess: (res) => {
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      onClose();
      setIsAuthenticated(true);
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterFormInputs) =>
      makeRequest<ApiResponse>(apiUrls.register, "POST", data),
    onSuccess: (res) => {
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
      onClose();
      setIsAuthenticated(true);
    },
  });

  const onLoginSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    registerMutation.mutate(data);
  };

  useEffect(() => {
    loginReset();
    registerReset();
    loginMutation.reset();
    registerMutation.reset();
  }, [tab]);

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box sx={style}>
        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          mb={2}
          color="primary.main"
        >
          {tab === 0 ? "Login to Your Account" : "Create an Account"}
        </Typography>

        <Tabs
          value={tab}
          onChange={(_e, val) => setTab(val)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        {tab === 0 && (
          <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                {...loginRegister("email")}
                error={!!loginErrors.email}
                helperText={loginErrors.email?.message}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Password"
                type="password"
                {...loginRegister("password")}
                error={!!loginErrors.password}
                helperText={loginErrors.password?.message}
                fullWidth
                size="small"
                variant="outlined"
              />

              {/* Feedback Message */}
              {loginMutation.isError && (
                <Typography variant="body2" color="error">
                  {loginMutation.error.message || "Login failed"}
                </Typography>
              )}
              {loginMutation.isSuccess && (
                <Typography variant="body2" color="success.main">
                  Login successful!
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.2 }}
                disabled={loginMutation.isPending}
              >
                Login
              </Button>
            </Stack>
          </form>
        )}

        {tab === 1 && (
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                {...registerRegister("name")}
                error={!!registerErrors.name}
                helperText={registerErrors.name?.message}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Email"
                type="email"
                {...registerRegister("email")}
                error={!!registerErrors.email}
                helperText={registerErrors.email?.message}
                fullWidth
                size="small"
                variant="outlined"
              />
              <TextField
                label="Password"
                type="password"
                {...registerRegister("password")}
                error={!!registerErrors.password}
                helperText={registerErrors.password?.message}
                fullWidth
                size="small"
                variant="outlined"
              />

              {/* Feedback Message */}
              {registerMutation.isError && (
                <Typography variant="body2" color="error">
                  {registerMutation.error.message || "Registration failed"}
                </Typography>
              )}
              {registerMutation.isSuccess && (
                <Typography variant="body2" color="success.main">
                  Registration successful!
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ py: 1.2 }}
                disabled={registerMutation.isPending}
              >
                Register
              </Button>
            </Stack>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default AuthModal;
