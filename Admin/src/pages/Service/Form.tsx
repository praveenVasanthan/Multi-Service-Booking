import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import makeRequest from "../../api/makeRequest";
import apiUrls from "../../api/apiUrls";
import type { Service } from "../../types/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DeleteConfirmModal from "../../components/DeleteModel";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const serviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(5, "Description is too short"),
  price: z.number().positive("Invalid price"),
  durationMinutes: z.number().min(10, "Duration must be at least 10 minutes"),
  imageUrl: z.string().optional(),
  workingHours: z.object({
    start: z
      .string()
      .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid start time"),
    end: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid end time"),
  }),
  workingDays: z
    .array(z.enum(weekdays))
    .min(1, "Select at least one working day"),
});

type ServiceFormData = z.output<typeof serviceSchema>;

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [openDelete, setOpenDelete] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      workingHours: { start: "09:00", end: "18:00" },
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });

  const { data } = useQuery({
    queryKey: ["service", id],
    queryFn: () => makeRequest<Service>(apiUrls.service.detail(id || "")),
    enabled: isEdit,
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("description", data.description);
      setValue("price", data.price);
      setValue("durationMinutes", data.durationMinutes);
      setValue("imageUrl", data.imageUrl);
      setValue(
        "workingHours",
        data.workingHours || { start: "09:00", end: "18:00" }
      );
      setValue(
        "workingDays",
        data.workingDays || [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ]
      );
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationKey: [isEdit ? "editService" : "addService"],
    mutationFn: (data: ServiceFormData) => {
      const url = isEdit
        ? apiUrls.service.edit(id as string)
        : apiUrls.service.add;
      const method = isEdit ? "PUT" : "POST";
      return makeRequest(url, method, data);
    },
    onSuccess: () => navigate("/"),
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteService"],
    mutationFn: () =>
      makeRequest(apiUrls.service.delete(id as string), "DELETE"),
    onSuccess: () => navigate("/"),
  });

  const onSubmit = (data: ServiceFormData) => {
    mutation.mutate(data);
  };

  return (
    <Box
      component={Paper}
      sx={{ p: 4, maxWidth: 700, mx: "auto", borderRadius: 3, boxShadow: 3 }}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"start"}
        mb={1}
      >
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {isEdit ? "Edit Service" : "Add New Service"}
        </Typography>
        {isEdit && (
          <Button
            color="error"
            variant="contained"
            onClick={() => setOpenDelete(true)}
          >
            Delete
          </Button>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Service Name
            </Typography>
            <TextField
              placeholder="Enter service name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Description
            </Typography>
            <TextField
              placeholder="Enter service description"
              fullWidth
              multiline
              rows={3}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Price (₹)
            </Typography>
            <TextField
              placeholder="Enter price"
              type="number"
              fullWidth
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Duration (minutes)
            </Typography>
            <TextField
              placeholder="Enter duration in minutes"
              type="number"
              fullWidth
              {...register("durationMinutes", { valueAsNumber: true })}
              error={!!errors.durationMinutes}
              helperText={errors.durationMinutes?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Image URL
            </Typography>
            <TextField
              placeholder="Enter image URL"
              fullWidth
              {...register("imageUrl")}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
            />
          </Grid>

          {/* Working Hours */}
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Start Time
            </Typography>
            <TextField
              type="time"
              fullWidth
              {...register("workingHours.start")}
              error={!!errors.workingHours?.start}
              helperText={errors.workingHours?.start?.message}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              End Time
            </Typography>
            <TextField
              type="time"
              fullWidth
              {...register("workingHours.end")}
              error={!!errors.workingHours?.end}
              helperText={errors.workingHours?.end?.message}
            />
          </Grid>

          {/* Working Days */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Working Days
            </Typography>
            <Controller
              name="workingDays"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  SelectProps={{ multiple: true }}
                  fullWidth
                  {...field}
                >
                  {weekdays.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit">
            {isEdit ? "Update Service" : "Create Service"}
          </Button>
        </Box>
      </form>

      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
    </Box>
  );
}
