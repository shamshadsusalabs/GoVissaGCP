import "../global.css"
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:5000/api/User";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [focusedField, setFocusedField] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
          router.replace("/components/userlayout");
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [router]);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(cleaned);
  };

  const handleOtpChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 6);
    setOtp(cleaned);
  };

  const sendOTP = async (): Promise<void> => {
    if (phoneNumber.length < 10) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setCountdown(30);
        Alert.alert("OTP Sent", `OTP has been sent to your phone number`);
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (): Promise<void> => {
    if (countdown > 0) return;
    await sendOTP();
  };

  const verifyOTP = async (): Promise<void> => {
    if (otp.length < 6) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store tokens and user data
        await AsyncStorage.multiSet([
          ['accessToken', data.accessToken],
          ['refreshToken', data.refreshToken],
          ['user', JSON.stringify(data.user)]
        ]);
        
        // Redirect to user layout
        router.replace("/components/userlayout");
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  if (isCheckingAuth) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center"
      >
        <View className="px-5 w-full max-w-md mx-auto">
          <View className="items-center mb-8">
            <View className="mb-4">
              <Text className="text-4xl font-extrabold text-blue-600">
                Go<Text className="text-blue-800">Vissa</Text>
              </Text>
              <View className="h-1 w-16 bg-blue-400 rounded-full mx-auto mt-1"></View>
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500 text-center">
              {isOtpSent
                ? `Enter OTP sent to +91 ${phoneNumber.slice(0, 2)}******${phoneNumber.slice(-2)}`
                : "Sign in with your phone number"}
            </Text>
          </View>

          <View className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            {!isOtpSent ? (
              <>
                <View className={`mb-6 border rounded-lg ${focusedField === "phone" ? "border-blue-500 border-2" : "border-gray-200"}`}>
                  <View className="flex-row items-center px-4 h-14">
                    <Text className="text-base font-medium text-gray-700 mr-2">+91</Text>
                    <TextInput
                      className="flex-1 text-base text-gray-900 h-full"
                      placeholder="Enter phone number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="number-pad"
                      value={phoneNumber}
                      onChangeText={handlePhoneChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField("")}
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  className={`h-14 rounded-lg justify-center items-center ${phoneNumber.length === 10 ? "bg-gray-900" : "bg-gray-200"}`}
                  onPress={sendOTP}
                  disabled={phoneNumber.length < 10 || isLoading}
                >
                  <Text className="text-base font-semibold text-white">
                    {isLoading ? "Sending..." : "Continue"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="mb-6">
                  <Text className="text-base font-medium text-gray-700 mb-4">Verification Code</Text>
                  <View className="flex-row justify-between">
                    {[...Array(6)].map((_, i) => (
                      <View 
                        key={i}
                        className={`w-12 h-14 rounded-lg justify-center items-center ${focusedField === "otp" && otp.length === i ? "border-2 border-blue-500" : "border border-gray-200"} ${otp.length > i && "bg-gray-50"}`}
                      >
                        <Text className="text-xl font-semibold text-gray-900">{otp[i] || ""}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TextInput
                  className="absolute opacity-0 w-0 h-0"
                  value={otp}
                  onChangeText={handleOtpChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  onFocus={() => setFocusedField("otp")}
                  onBlur={() => setFocusedField("")}
                  autoFocus
                  inputMode="numeric"
                />

                <TouchableOpacity
                  className={`h-14 rounded-lg justify-center items-center mb-5 ${otp.length === 6 ? "bg-gray-900" : "bg-gray-200"}`}
                  onPress={verifyOTP} 
                  disabled={otp.length < 6 || isLoading}
                >
                  <Text className="text-base font-semibold text-white">
                    {isLoading ? "Verifying..." : "Verify"}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center">
                  <Text className="text-sm text-gray-500">Did not receive code?</Text>
                  <TouchableOpacity 
                    onPress={resendOTP} 
                    disabled={countdown > 0 || isLoading}
                    className="ml-1"
                  >
                    <Text className={`text-sm font-semibold ${countdown > 0 || isLoading ? "text-gray-400" : "text-blue-500"}`}>
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend now"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}