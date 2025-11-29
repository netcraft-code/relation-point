import React, { useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Text,
  Select,
  Stack,
  Center,
} from "@mantine/core";
import {
  signInWithPhoneNumber
} from "firebase/auth";
import { auth, createRecaptcha } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, setUser, setUserId, signInSuccess } from "@/store";

const countryCodes = [
  { value: "+91", label: "🇮🇳 India (+91)" },
  { value: "+1", label: "🇺🇸 USA (+1)" },
  { value: "+44", label: "🇬🇧 UK (+44)" },
  { value: "+971", label: "🇦🇪 UAE (+971)" },
  { value: "+61", label: "🇦🇺 Australia (+61)" },
];

export default function PhoneLogin() {
  const [country, setCountry] = useState("+91");
  const [number, setNumber] = useState("");

  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const finalPhone = `${country}${number}`;

  const sendUserToBackend = async (uid: string) => {
    const token = await auth.currentUser?.getIdToken();
    console.log("Returned Firebase Token:", token);
  };

  const handleLoginSuccess = async (user: any) => {
    dispatch(setUserId(user.uid));
    dispatch(
      signInSuccess({
        token: user.stsTokenManager.accessToken,
        refreshToken: "",
        expireTime: 0,
      })
    );
    dispatch(
      setUser({
        fullName: user.displayName || "",
        email: user.email || "",
        role: [],
        phoneNumber: user.phoneNumber || "",
      })
    );

    await sendUserToBackend(user.uid);
    navigate("/dashboard");
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);

    try {
      const recaptcha = createRecaptcha();
      const result = await signInWithPhoneNumber(auth, finalPhone, recaptcha);
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      await handleLoginSuccess(result.user);
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Paper p={30} radius="md" style={{ width: 380 }}>
        <Title order={3} align="center" mb="lg">
          Phone Login
        </Title>

        {error && (
          <Text align="center" color="red" mb="sm">
            {error}
          </Text>
        )}

        {!confirmationResult && (
          <Stack>
            <Select
              label="Country"
              data={countryCodes}
              value={country}
              onChange={(v) => setCountry(v || "+91")}
            />

            <TextInput
              label="Phone Number"
              placeholder="9876543210"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <div id="recaptcha-container"></div>

            <Button
              fullWidth
              loading={loading}
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          </Stack>
        )}

        {confirmationResult && (
          <Stack>
            <TextInput
              label="Enter OTP"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button fullWidth loading={loading} onClick={handleVerifyOtp}>
              Verify OTP
            </Button>
          </Stack>
        )}
      </Paper>
    </Center>
  );
}
