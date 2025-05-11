import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getChallengesByCurrentUser } from "@/services/challengeService";

export default function ChallengeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await getChallengesByCurrentUser();
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
        <View
          key={index}
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
        </View>
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
