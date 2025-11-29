import React, { useState } from "react";
import {
  Paper,
  TextInput,
  Button,
  Title,
  Text,
} from "@mantine/core";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email.");

      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        p={40}
        shadow="md"
        radius={10}
        style={{ width: 400, textAlign: "center" }}
      >
        <Title order={2} mb="lg">
          Forgot Password
        </Title>

        <TextInput
          placeholder="Enter your email"
          label="Email"
          withAsterisk
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          fullWidth
          mt="xl"
          loading={loading}
          onClick={handleForgotPassword}
        >
          Send Reset Link
        </Button>

        {message && (
          <Text color={message.includes("sent") ? "green" : "red"} mt="md">
            {message}
          </Text>
        )}

        <Text
          mt="md"
          c="blue"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/sign-in")}
        >
          Back to Login
        </Text>
      </Paper>
    </div>
  );
}
