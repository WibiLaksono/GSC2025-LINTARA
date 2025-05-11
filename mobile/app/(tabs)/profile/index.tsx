import { logoutUser } from "@/services/authService";
import { getUserById } from "@/services/userService";
import { getAllPostsUser } from "@/services/communityService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  interface User {
    id?: string;
    image?: string;
    First_name?: string;
    Last_name?: string;
    Username?: string;
    postCount?: number;
    followers?: number;
    following?: number;
  }

  interface Post {
    ID: string;
    UserID: string;
    caption: string;
    image_url: string;
    created_at: string;
    location?: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserAndPosts = async () => {
    try {
      // Fetch user data
      const userData = await getUserById();
      const currentUser = userData.user;
      console.log("Current User Data:", currentUser);
      setUser(currentUser);

      // Fetch user-specific posts using getAllPostsUser
      const allPosts = await getAllPostsUser();
      console.log("All Posts Data:", allPosts);

      // Format posts as needed
      const formattedPosts = allPosts.map((item: any) => ({
        ID: item.id,
        UserID: item.UserID,
        caption: item.Caption,
        image_url: item.ImageURL,
        location: item.Location,
        created_at: new Date(item.Created_at._seconds * 1000).toLocaleString(),
      }));

      setUserPosts(formattedPosts); // Set the formatted posts for the user
    } catch (error) {
      console.error("Failed to load user or posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndPosts();
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
  const username = user?.Username ? `@${user.Username}` : "Nothing to see";
  const postCount = user?.postCount ?? userPosts.length;
  const followers = user?.followers ?? 0;
  const following = user?.following ?? 0;

  const renderPost = ({ item }: { item: Post }) => (
    <View className="bg-white p-4 mb-4 rounded-md border border-gray-200">
      <Text className="font-semibold mb-2">{item.caption}</Text>
      {item.image_url?.startsWith("http") && (
        <Image
          source={{ uri: item.image_url }}
          className="w-full h-48 rounded-md"
        />
      )}
      <Text className="text-xs text-gray-500 mt-1">{item.created_at}</Text>
    </View>
  );

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

        <View className="flex-row justify-center w-full mt-4 px-6">
          <View className="items-center w-[30%]">
            <Text className="text-xl font-bold">{postCount}</Text>
            <Text className="text-md text-gray-500">Post</Text>
          </View>
          <View className="items-center w-[30%]">
            <Text className="text-xl font-bold">{followers}</Text>
            <Text className="text-md text-gray-500">Followers</Text>
          </View>
          <View className="items-center w-[30%]">
            <Text className="text-xl font-bold">{following}</Text>
            <Text className="text-md text-gray-500">Following</Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-green-600 w-[90%] px-6 py-2 rounded-lg mt-4"
          onPress={() => router.push("/profile/edit")}
        >
          <Text className="text-white text-center font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Postingan User */}
      <View className="mt-6 px-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">
          Your Posts
        </Text>

        {userPosts.length === 0 ? (
          <Text className="text-center text-gray-400">
        You haven’t posted anything yet.
          </Text>
        ) : (
          <FlatList
        data={userPosts}
        keyExtractor={(item) => item.ID}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-4 rounded-md border border-gray-200">
            <View className="flex-row items-center mb-2">
          <Image
            source={userImage}
            className="w-10 h-10 rounded-full mr-2"
          />
          <Text className="font-semibold">{name}</Text>
            </View>
            <Text className="font-semibold mb-2">{item.caption}</Text>
            {item.image_url?.startsWith("http") && (
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-48 rounded-md"
          />
            )}
            <Text className="text-xs text-gray-500 mt-1">
          {item.created_at}
            </Text>
          </View>
        )}
        scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}
