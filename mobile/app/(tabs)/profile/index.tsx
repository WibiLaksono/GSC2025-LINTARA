import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserById } from "@/services/userService";
import { logoutUser } from "@/services/authService";

export default function ProfileScreen() {
  const router = useRouter();

  interface User {
    image?: string;
    First_name?: string;
    Last_name?: string;
    postCount?: number;
    followers?: number;
    following?: number;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await getUserById();
      console.log("User Data:", userData);
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const userImage = user?.image
    ? { uri: user.image }
    : require("../../../assets/images/pict1.jpg");
  const name =
    user?.First_name && user?.Last_name
      ? `${user.First_name} ${user.Last_name}`
      : "Nothing to see";
  const username = user?.First_name ? `@${user.First_name}` : "Nothing to see";
  const postCount = user?.postCount ?? 0;
  const followers = user?.followers ?? 0;
  const following = user?.following ?? 0;

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-4 bg-green-200 rounded-b-xl">
        <Text className="text-lg font-bold text-green-900">Profile</Text>
        <TouchableOpacity
          onPress={async () => {
            try {
              await logoutUser();
              router.replace("/");
            } catch (error) {
              console.error("Error during logout:", error);
            }
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View className="items-center mt-4">
        <Image source={userImage} className="w-24 h-24 rounded-full mb-2" />
        <Text className="text-xl font-semibold">{name}</Text>
        <Text className="text-gray-500">{username}</Text>

        <View className="flex-row justify-around w-full mt-4 px-6">
          <View className="items-center">
            <Text className="text-lg font-bold">{postCount}</Text>
            <Text className="text-xs text-gray-500">Post</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold">{followers}</Text>
            <Text className="text-xs text-gray-500">Followers</Text>
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold">{following}</Text>
            <Text className="text-xs text-gray-500">Following</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-green-600 px-6 py-2 rounded-lg mt-4"
          onPress={() => router.push("/(tabs)/profile/edit")}
        >
          <Text className="text-white font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder Graph / History / Post Preview */}
      <View className="mt-6 px-4">
        <Text className="text-sm text-gray-400">
          Your activity preview (mockup)
        </Text>
        {/* You can add chart component or list of posts here */}
      </View>
    </ScrollView>
  );
}
