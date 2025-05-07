import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import GestureRecognizer from "react-native-swipe-gestures";
import { initializeAuthToken } from "../services/authService";
import './global.css';

const { width, height } = Dimensions.get("window");

const images = [
  {
    source: require("../assets/images/mobile1.png"),
    caption: "Let’s take action, one trash at a time",
  },
  {
    source: require("../assets/images/mobile2.png"),
    caption: "Link up with fellow envi-care souls",
  },
  {
    source: require("../assets/images/mobile3.png"),
    caption: "Join cleanup challenges across Indonesia",
  },
  {
    source: require("../assets/images/mobile4.png"),
    caption: "See who’s leading the clean movement!",
  },
];

export default function Index() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await initializeAuthToken();
        if (isAuthenticated) {
          router.replace("/action");
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <GestureRecognizer className="flex-1">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <ImageBackground
        source={require("../assets/images/background-s.png")}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        {/* Gambar mockup HP */}
        <View className="absolute top-[15%] items-center w-full h-[90%]">
          <Animated.Image
            source={images[currentImageIndex].source}
            style={{ opacity: fadeAnim }}
            className="h-[60%] w-[80%]"
            resizeMode="contain"
          />
        </View>

        {/* Panel putih 30% bagian bawah */}
        <View className="absolute bottom-0 w-full h-[30%] bg-white rounded-t-3xl px-6 pt-4 items-center justify-start">
          <Text className="text-lg font-semibold text-center text-black mb-3">
            {images[currentImageIndex].caption}
          </Text>

          <View className="flex-row justify-center mb-5">
            {images.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 w-1.5 rounded-full mx-1 ${
                  currentImageIndex === index ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </View>

          <TouchableOpacity
            className="bg-green-500 w-full py-3 rounded-lg mb-2"
            onPress={() => router.push("/auth/registerPage")}
          >
            <Text className="text-white text-center font-semibold text-lg">New user</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white border border-green-500 w-full py-3 rounded-lg"
            onPress={() => router.push("/auth/loginPage")}
          >
            <Text className="text-green-500 text-center font-semibold text-lg">
              Already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </GestureRecognizer>
  );
}
