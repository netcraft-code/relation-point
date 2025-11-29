import React, { useState } from "react";
import {
    Paper,
    TextInput,
    PasswordInput,
    Button,
    Title,
    Text,
    Divider,
    Group,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
    auth,
    googleProvider,
    facebookProvider,
} from "@/services/firebase";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signInWithPopup,
} from "firebase/auth";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";

import {
    setUser,
    setUserId,
    signInSuccess,
    useAppDispatch,
} from "@/store";

import {
    IconBrandGoogle,
    IconBrandFacebook,
    IconPhone
} from "@tabler/icons-react";

export default function SignUp() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Validation rules
    const schema = yup.object().shape({
        fullName: yup.string().required("Enter full name"),
        email: yup.string().email("Invalid email").required("Enter email"),
        password: yup.string().required("Enter password").min(6, "Minimum 6 characters"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords don't match"),
    });

    const form = useForm({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: yupResolver(schema),
    });

    // Send UID/token to backend later
    const sendUserToBackend = async (uid: string) => {
        const token = await auth.currentUser?.getIdToken();
        console.log("Sending signup data to backend:", { uid, token });
    };

    const handleRegistrationSuccess = async (user: any) => {
        dispatch(setUserId(user.uid));
        dispatch(signInSuccess({
            token: user.stsTokenManager.accessToken,
            refreshToken: "",
            expireTime: 0,
        }));

        dispatch(setUser({
            fullName: user.displayName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            role: [],
        }));

        await sendUserToBackend(user.uid);

        navigate("/dashboard");
    };

    // Email + Password Signup
    const handleEmailSignup = async (values: any) => {
        setLoading(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            const user = userCredential.user;

            // Save user full name
            await updateProfile(user, {
                displayName: values.fullName,
            });

            // Send email verification
            await sendEmailVerification(user);

            // ⚠ Do NOT login the user
            auth.signOut();

         setError("Verification link sent to your email. Please verify before login.");

setTimeout(() => {
    navigate("/sign-in");      // your login route
}, 3000); // 3 seconds


        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Google Signup
    const handleGoogleSignup = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(auth, googleProvider);
            await handleRegistrationSuccess(result.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Facebook Signup
    const handleFacebookSignup = async () => {
        setLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(auth, facebookProvider);
            await handleRegistrationSuccess(result.user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleEmailSignup)}>
            <div style={{ maxWidth: 480, margin: "auto", marginTop: 60 }}>
                <Paper p={30}>
                    <Title order={2} ta="center" mb="lg">
                        Create Account
                    </Title>

                    {error && <Text color="red">{error}</Text>}

                    <TextInput
                        label="Full Name"
                        withAsterisk
                        {...form.getInputProps("fullName")}
                    />
                    <TextInput
                        label="Email"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label="Password"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        withAsterisk
                        mt="md"
                        {...form.getInputProps("confirmPassword")}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        mt="xl"
                        loading={loading}
                    >
                        Sign Up
                    </Button>

                    {/* <Divider my="md" label="Or continue with" /> */}

                    {/* <Group grow>
            <Button
              color="red"
              onClick={handleGoogleSignup}
              leftSection={<IconBrandGoogle size={18} />}
            >
              Google
            </Button>

            <Button
              color="blue"
              onClick={handleFacebookSignup}
              leftSection={<IconBrandFacebook size={18} />}
            >
              Facebook
            </Button>
          </Group> */}

                    {/* <Button
            color="green"
            fullWidth
            mt="sm"
            leftSection={<IconPhone size={18} />}
            onClick={() => navigate("/phone-signup")}
          >
            Sign up with Phone
          </Button> */}

                    <Text ta="center" mt="md">
                        Already have an account?{" "}
                        <Text
                            span
                            c="blue"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/sign-in")}
                        >
                            Login
                        </Text>
                    </Text>


                </Paper>
            </div>
        </form>
    );
}
