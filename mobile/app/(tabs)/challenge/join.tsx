import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { getAllChallenges } from "@/services/challengeService";
import { useRouter } from "expo-router";

export default function ChallengeJoinScreen() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
    const fetchChallenges = async () => {
        try {
            const data = await getAllChallenges();
            // console.log("Fetched challenges data:", data); // Log the fetched data
            setChallenges(data);
        } catch (error) {
            console.error("Error loading challenges:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchChallenges();
}, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 mt-4">
      {challenges.map((challenge, index) => (
        <Pressable
          key={index}
          onPress={() => {
            console.log(`Navigating to /challenge/detail/${challenge.id}`);
            router.push(`/challenge/detail/${challenge.id}`);
          }}
          className="bg-white rounded-xl shadow-lg shadow-black mb-6 overflow-hidden"
        >
          <Image
            source={{ uri: challenge.ImageURL }}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-xl font-bold">{challenge.ChallengeName}</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {formatDateRange(challenge.Start_date, challenge.End_date)}
            </Text>
            <Text className="text-sm text-gray-600">{challenge.Location}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function formatDateRange(startObj, endObj) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const format = (timestamp) => {
      const date = new Date(timestamp._seconds * 1000); // Convert detik ke milidetik
      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };
  
    return `${format(startObj)} - ${format(endObj)}`;
  }