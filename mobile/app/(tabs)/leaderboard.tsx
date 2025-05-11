import { getReportsCountByUser } from "@/services/leaderboardService";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BronzeMedal from "@/assets/icons/Bronze-Medal.png";
import GoldMedal from "@/assets/icons/Gold-Medal.png";
import SilverMedal from "@/assets/icons/Silver-Medal.png";
import DefaultProfileImage from "@/assets/images/pict1.jpg";

interface UserLeaderboard {
  id: string;
  name: string;
  profileImage?: string;
  reportCount: number;
}

export default function LeaderboardScreen() {
  const [leaderboardData, setLeaderboardData] = useState<UserLeaderboard[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getReportsCountByUser(); // data: [{ userId, totalReports }]
      console.log("Fetched data:", data);

      const mappedData = data.map((item: any) => ({
        id: item.userId,
        name: `User ${item.userId.slice(0, 5)}`, // placeholder name
        reportCount: item.totalReports,
      }));

      const sorted = mappedData
        .sort((a: any, b: any) => b.reportCount - a.reportCount)
        .slice(0, 40);

      setLeaderboardData(sorted);
    };
    fetchData();
  }, []);

  const formatPoints = (num: number) =>
    num.toLocaleString("id-ID", { minimumFractionDigits: 3 });

  const renderTopThree = () => {
    const topThree = leaderboardData.slice(0, 3);
    if (topThree.length < 3) return null;

    // Atur ulang urutan untuk tampilan: silver - gold - bronze
    const medalData = [
      { ...topThree[1], medal: SilverMedal, position: 2 }, // Kiri
      { ...topThree[0], medal: GoldMedal, position: 1 }, // Tengah (naik)
      { ...topThree[2], medal: BronzeMedal, position: 3 }, // Kanan
    ];

    return (
      <View className="flex-row justify-around items-end mt-6 mb-4">
        {medalData.map((user) => (
          <View
            key={user.id}
            className="items-center"
            style={user.position === 1 ? { marginTop: -8 } : {}}
          >
            <View className="relative mb-2">
              <Image
                source={DefaultProfileImage}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  borderWidth: 3,
                  borderColor: "green",
                }}
              />
              <Image
                source={user.medal}
                className="w-6 h-6 absolute top-0 right-0"
              />
              <View className="absolute bottom-[-10px] left-[50%] -translate-x-1/2 bg-yellow-400 px-2 py-1 rounded-full">
                <Text className="text-xs font-bold text-white">
                  {user.position}
                </Text>
              </View>
            </View>
            <Text className="font-semibold text-green-900">{user.name}</Text>
            <Text className="text-green-700 text-sm">
              {formatPoints(user.reportCount)} Pcs
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: UserLeaderboard;
    index: number;
  }) => {
    if (index < 3) return null;

    return (
      <View className="flex-row justify-between items-center px-4 py-2 bg-white rounded-lg mb-2">
        <View className="flex-row items-center gap-3">
          <Text className="text-lg w-6 text-gray-500">{index + 1}</Text>
          <Image
            source={DefaultProfileImage}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "green",
            }}
          />

          <Text className="text-base text-black">{item.name}</Text>
        </View>
        <Text className="text-green-600 font-semibold text-sm">
          {formatPoints(item.reportCount)} Pcs
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#D1FADF]">
      <Stack.Screen options={{ title: "Leaderboard" }} />

      <View className="p-4">
        <Text className="text-center text-xl font-semibold text-green-800">
          Congratulations!
        </Text>
        {renderTopThree()}

        <FlatList
          data={leaderboardData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
