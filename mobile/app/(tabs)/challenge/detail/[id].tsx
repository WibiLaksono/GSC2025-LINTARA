import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getChallengeById, joinChallenge, hasUserJoinedChallenge } from "@/services/challengeService";
import headerImage from "@/assets/images/header.png";
import calendarIcon from "@/assets/icons/calendar.png";
import locationIcon from "@/assets/icons/Location.png";
import activityIcon from "@/assets/icons/Activity.png";
import awardIcon from "@/assets/icons/Award.png";
import userIcon from "@/assets/icons/User3.png";
import goldMedal from "@/assets/icons/Gold-Medal.png";
import silverMedal from "@/assets/icons/Silver-Medal.png";
import bronzeMedal from "@/assets/icons/Bronze-Medal.png";

export default function ChallengeDetail() {
  const { id } = useLocalSearchParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await getChallengeById(id);
        setChallenge(data);
      } catch (error) {
        console.error("Error loading challenge:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChallenge();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Challenge not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="absolute w-14 h-14 top-10 left-4 z-10">
        <TouchableOpacity
          onPress={() => {
            // Navigate to /challenge/join
            // Assuming you are using a navigation library like React Navigation
            // Replace with your navigation logic if different
            router.push("/challenge/join");
          }}
          className="rounded-full shadow-lg shadow-black h-14 justify-center items-center bg-white p-2"
        >
          <Ionicons name="chevron-back" size={24} color="green" />
        </TouchableOpacity>
      </View>

      <Image
        source={headerImage}
        className="w-full h-60"
        resizeMode="cover"
      />

      <View className="bg-white rounded-t-3xl -mt-8 p-4">
        <Text className="text-3xl font-bold mb-2">{challenge.ChallengeName}</Text>
        <Text className="text-gray-500 mb-4 text-justify">
          {challenge.Description}
        </Text>

        <View className="bg-green-200 w-full h-16 rounded-lg px-2 py-2 flex-row flex mb-3">
          <View className="w-[50%] h-full flex flex-col justify-start">
            <Text>Participant</Text>
            <Text>{challenge.Max_Participant}</Text>
          </View>
          <View className="w-[50%] h-full justify-center items-end px-4">
            <TouchableOpacity
              onPress={async () => {
                const handleJoinChallenge = async () => {
                  if (await hasUserJoinedChallenge(challenge.id)) {
                    return; // Do nothing if the user has already joined
                  }
                  try {
                    await joinChallenge(challenge.id);
                    alert("Successfully joined the challenge!");
                  } catch (error) {
                    alert("Failed to join the challenge. Please try again.");
                  }
                };

                handleJoinChallenge();
              }}
              disabled={false}
            >
              <Text
                className={`bg-green-500 w-14 text-center px-2 py-1 rounded-lg`}
              >
                Join
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <InfoRow icon={calendarIcon} text={formatDateRange(challenge.Start_date, challenge.End_date)} />
        <InfoRow icon={locationIcon} text={challenge.Location} />
        <InfoRow icon={userIcon} text="Participant Requirement" />
        <View className="ml-10 mb-4">
          {challenge.Requirements?.split('\n').flatMap((line, idx) => 
            line.split(',').map((item, subIdx) => (
              <Text key={`${idx}-${subIdx}`} className="text-gray-600 text-sm">• {item.trim()}</Text>
            ))
          )}
        </View>
        {challenge.Reward?.map((reward, index) => (
          <InfoRow key={index} icon={awardIcon} text={reward} />
        ))}

        <View className="mt-4 mb-6">
          <InfoRow className="text-base font-semibold mb-2" icon={activityIcon} text="Challenge Goals"/>
          <View className="bg-green-200 rounded-xl px-4 py-5 items-center">
            <Text className="text-2xl font-bold text-green-900 mb-1">
              {Number(challenge.Goals).toLocaleString("id-ID")} Pcs
            </Text>
            <View className="bg-green-300 h-2 w-full rounded-full mb-1 overflow-hidden">
              <View style={{ width: "56%" }} className="bg-green-700 h-full" />
            </View>
            <Text className="text-xs text-gray-700">Pickups 112.000 / {Number(challenge.Goals).toLocaleString("id-ID")}</Text>
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-lg font-semibold mb-2">Top Participant</Text>
          <LeaderboardItem rank={1} name="Diana" points="120.000" icon={goldMedal} />
          <LeaderboardItem rank={2} name="Tessalonika" points="120.000" icon={silverMedal} />
          <LeaderboardItem rank={3} name="Aditya Ramadhan" points="120.000" icon={bronzeMedal} />
          <LeaderboardItem rank={4} name="Bagas Hadikusumo" points="120.000" />
          <LeaderboardItem rank={5} name="Aliyah Sintia" points="120.000" />
        </View>
      </View>
    </ScrollView>
  );
}

function formatDateRange(startObj, endObj) {
  const format = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  return `${format(startObj)} - ${format(endObj)}`;
}

function InfoRow({ icon, text }) {
  return (
    <View className="flex-row items-center mb-2">
      <Image source={icon} className="w-5 h-5 mr-2" />
      <Text className="text-gray-700">{text}</Text>
    </View>
  );
}

function LeaderboardItem({ rank, name, points, icon }) {
  return (
    <View className="flex-row items-center justify-between bg-gray-100 rounded-xl px-4 py-2 mb-2">
      <View className="flex-row items-center">
        {icon && <Image source={icon} className="w-6 h-6 mr-2" />}
        <Text className="font-semibold">{rank}. {name}</Text>
      </View>
      <Text className="text-green-700 font-semibold">{points} Pcs</Text>
    </View>
  );
}
