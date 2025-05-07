import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { loginUser, setAuthToken } from "../../services/authService";

export default function LoginPage() {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        setLoading(true);
        try {
            const { token, uid, userData } = await loginUser({ email, password });
            setAuthToken(token);
            console.log("Login successful:", userData);

            router.push("/action");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Login error:", (error as any)?.response?.data || error.message);
            } else {
                console.error("Login error:", error);
            }
            Alert.alert("Login failed", "Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-transparent justify-end">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="bg-white rounded-t-3xl px-6 pt-6 pb-12"
            >
                <Text className="text-center text-green-700 font-semibold text-2xl mb-6">
                    {showForm ? "Log in with Email" : "Log in"}
                </Text>

                {!showForm && (
                    <>
                        <TouchableOpacity
                            className="bg-green-600 py-3 rounded-lg mb-4"
                            onPress={() => setShowForm(true)}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                Log in with Username or Email
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="bg-white border border-green-600 py-3 rounded-lg mb-4">
                            <Text className="text-green-600 text-center font-semibold text-lg">
                                Log in with Google
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/auth/registerPage")}>
                            <Text className="text-center text-gray-600">
                                New user?{" "}
                                <Text className="text-green-700 font-semibold">Create an account</Text>
                            </Text>
                        </TouchableOpacity>
                    </>
                )}

                {showForm && (
                    <>
                        <TextInput
                            placeholder="Email or username"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-black"
                        />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            className="border border-gray-300 rounded-lg px-4 py-3 mb-2 text-black"
                        />

                        <TouchableOpacity className="mb-4">
                            <Text className="text-right text-sm text-gray-500">Forgot password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-green-600 py-3 rounded-lg mb-4"
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                {loading ? "Logging in..." : "Log in"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowForm(false)}>
                            <Text className="text-center text-gray-500 underline">Back</Text>
                        </TouchableOpacity>
                    </>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
