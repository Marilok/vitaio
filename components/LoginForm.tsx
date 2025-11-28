'use client';

import { useForm } from 'react-hook-form';
import { Button, TextInput, PasswordInput, Paper, Title, Stack, Anchor, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        notifications.show({
          title: 'Login Failed',
          message: error.message,
          color: 'red',
        });
        return;
      }

      notifications.show({
        title: 'Success',
        message: 'Logged in successfully!',
        color: 'green',
      });

      // Redirect or update UI as needed
      // router.push('/dashboard');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper shadow="md" p="xl" radius="md" withBorder maw={400} mx="auto">
      <Title order={2} mb="md" ta="center">
        Login
      </Title>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...register('password', {
              required: 'Password is required',
            })}
            error={errors.password?.message}
          />

          <Button type="submit" loading={isLoading} fullWidth>
            Sign In
          </Button>

          <Text size="sm" ta="center">
            Don't have an account?{' '}
            <Anchor href="#" size="sm">
              Sign up
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}

