import React, { useState } from 'react';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Group,
  Divider,
} from '@mantine/core';
import classes from './SignIn.module.css';
import {
  IconBrandGoogle,
  IconBrandFacebook,
  IconPhone,
} from "@tabler/icons-react";

import * as yup from 'yup';
import { useForm, yupResolver } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, facebookProvider } from '@/services/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { setUser, setUserId, signInSuccess, useAppDispatch } from '@/store';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const schema = yup.object().shape({
    email: yup.string().required('Please enter an email').email('Invalid email'),
    password: yup.string().required('Please enter a password'),
  });


  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: yupResolver(schema),
  });

  // Send UID/token to backend
  const sendUserToBackend = async (uid: string) => {
    try {
      const userToken = await auth.currentUser?.getIdToken();
      console.log("usertoke", userToken)
      // await fetch('https://your-backend.com/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ uid, token: userToken }),
      // });
    } catch (err) {
      console.error('Backend API error:', err);
    }
  };


  const handleLoginSuccess = async (user: any) => {
    // Populate Redux with Firebase user info
    dispatch(setUserId(user.uid));
    dispatch(signInSuccess({ token: user.stsTokenManager.accessToken, refreshToken: '', expireTime: 0 }));
    dispatch(setUser({
      fullName: user.displayName || '',
      email: user.email || '',
      role: [],
      phoneNumber: user.phoneNumber || ''
    }));
    // Optional: send UID/token to backend
    await sendUserToBackend(user.uid);
    // Redirect to dashboard
    navigate('/dashboard');
  };



  // Email/password login
  const handleEmailLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        auth.signOut(); // logout user
        setError("Please verify your email before login.");
        return;
      }
      await handleLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.emailVerified) {
        auth.signOut();
        setError("Your Google email is not verified. Please verify first.");
        return;
      }
      await handleLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Facebook login
  const handleFacebookLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      if (!user.emailVerified) {
        auth.signOut();
        setError("Your Facebook email is not verified. Please verify before login.");
        return;
      }
      await handleLoginSuccess(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={form.onSubmit(handleEmailLogin)}>
        <div className={classes.wrapper}>
          <Paper className={classes.form} radius={0} p={30}>
            <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
              Login page
            </Title>

            {error && <Text color="red" size="sm" mb="sm">{error}</Text>}

            <TextInput
              {...form.getInputProps('email')}
              name="email"
              label="Email address"
              withAsterisk
              placeholder="hello@gmail.com"
              size="md"
            />
            <PasswordInput
              {...form.getInputProps('password')}
              name="password"
              label="Password"
              placeholder="Your password"
              mt="md"
              size="md"
            />

            <Button loading={loading} type="submit" fullWidth mt="xl" size="md">
              Login
            </Button>

            <Divider my="sm" label="Or login with" labelPosition="center" />

            <Group grow>
              <Button color="red" leftSection={<IconBrandGoogle size={18} />} onClick={handleGoogleLogin}>
                Google
              </Button>
              <Button color="blue" leftSection={<IconBrandFacebook size={18} />} onClick={handleFacebookLogin}>
                Facebook
              </Button>
            </Group>

            {/* Phone Login Button Here */}
            <Button
              color="green"
              fullWidth
              mt="sm"
              leftSection={<IconPhone size={18} />}
              onClick={() => navigate("/phone-login")}
            >
              Login with Phone
            </Button>

            <Text ta="center" mt="md">
              Don&apos;t have an account?{" "}
              <Text
                span
                c="blue"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Create one
              </Text>
            </Text>

            <Text ta="center" mt="sm">
              <Text
                span
                c="blue"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Text>
            </Text>

          </Paper>
        </div>
      </form>
    </div>
  );
}
