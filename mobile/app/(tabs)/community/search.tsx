import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { searchUser, followUser, getFollowers } from "@/services/followService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SearchCommunity() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const users = await searchUser(text);

      // Optionally mark followed status here if needed
      const followers = await getFollowers();
      const updatedUsers = users.map((user) => ({
        ...user,
        isFollowed: followers.some((follower) => follower.user_id === user.id),
      }));

      setResults(updatedUsers);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followUser(userId);
      const followers = await getFollowers();
      const updatedResults = results.map((user) =>
        followers.some((follower) => follower.user_id === user.id)
          ? { ...user, isFollowed: true }
          : user
      );
      setResults(updatedResults);
    } catch (error) {
      alert("Failed to follow user.");
    }
  };

  const renderItem = ({ item }) => (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center space-x-3">
        <Image
          source={
            item.user_image
              ? { uri: item.user_image }
              : require("../../../assets/images/pict1.jpg")
          }
          className="w-10 h-10 rounded-full"
        />
        <View>
          <Text className="font-semibold">{item.name}</Text>
          <Text className="text-gray-500">@{item.username}</Text>
        </View>
      </View>

      {item.isFollowed ? (
        <View className="bg-gray-300 px-4 py-1.5 rounded-lg shadow">
          <Text className="text-gray-700 font-medium">Followed</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => handleFollow(item.id)}
          className="bg-green-700 px-4 py-1.5 rounded-lg shadow text-white"
        >
          <Text className="text-white font-medium">Follow</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="h-[66px] bg-green-200 shadow-lg shadow-black flex-row items-center px-4">
        <TouchableOpacity onPress={() => router.push("/community")}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center -ml-6">
          <Text className="text-lg font-semibold">Search</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3">
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-2"
          placeholder="Search for people on Lintara"
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {/* Search Results */}
      {hasSearched && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            query.length > 0 && !loading ? (
              <Text className="text-center mt-10 text-gray-500">No users found.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
}
