"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { createClient } from "@/lib/supabase/client";

interface FormValues {
  email: string;
  password: string;
  name: string;
}

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const supabase = createClient();

      // Example: Sign up a new user
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
        return;
      }

      notifications.show({
        title: "Success",
        message:
          "Account created successfully! Check your email for verification.",
        color: "green",
      });

      reset();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred",
        color: "red",
      });
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" withBorder>
      <Title order={2} mb="lg">
        Sign Up Example
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Your name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
          />

          <TextInput
            label="Email"
            placeholder="your@email.com"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          <Button type="submit" loading={isSubmitting} fullWidth>
            Sign Up
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
