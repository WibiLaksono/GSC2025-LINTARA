import {
  createReport,
  deleteReport,
  getReports,
  getUserId,
} from "@/services/reportService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const icons = {
  Organic: require("../../assets/icons/organic.png"),
  "Non-Organic": require("../../assets/icons/non-organic.png"),
  Hazard: require("../../assets/icons/hazard.png"),
  Camera: require("../../assets/icons/camera.png"),
};

interface Report {
  id: string;
  ImageURL: string;
  Category_trash: string[];
  Result: string;
}

export default function ActionScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Organic");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const fetchedReports = await getReports();
        setReports(fetchedReports);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    };

    fetchReports();
  }, []);

  const saveImage = async (uri: string) => {
    try {
      const userId = await getUserId();
      const imageFile = {
        uri,
        type: "image/jpeg",
        name: uri.split("/").pop(),
      };

      const reportData = {
        UserID: userId,
        Location: null,
        Challenge_id: null,
      };

      const { id, result, category } = await createReport(
        reportData,
        imageFile
      );

      setReports((prev) => [
        {
          id,
          ImageURL: uri,
          Category_trash: category,
          Result: result,
        },
        ...prev,
      ]);

      Alert.alert("Success", "Image uploaded and report created!");
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to upload image.");
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Camera permission is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled && result.assets) {
      saveImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Media library permission is required to pick images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled && result.assets) {
      saveImage(result.assets[0].uri);
    }
  };

  const handleDelete = async () => {
    if (selectedReports.length === 0) {
      Alert.alert("No reports selected", "Please select reports to delete.");
      return;
    }

    try {
      for (const reportId of selectedReports) {
        await deleteReport(reportId);

        setReports((prev) => prev.filter((report) => report.id !== reportId));
      }
      setSelectedReports([]);
      Alert.alert("Success", "Selected reports have been deleted.");
    } catch (error) {
      console.error("Error deleting reports:", error);
      Alert.alert("Error", "Failed to delete selected reports.");
    }
  };

  const filteredReports = reports.filter((report) =>
    report.Category_trash.includes(selectedCategory)
  );

  return (
    <View className="flex-1 bg-white">
      {" "}
      <View className="flex-row justify-between items-center h-[66px] shadow-xl shadow-black px-4 py-4 bg-green-200">
        {" "}
        <Text className="text-xl font-bold text-green-950 text-center flex-1">
          Action{" "}
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={{ position: "absolute", right: 16 }}
        >
          {" "}
          <Ionicons name="trash-outline" size={24} color="black" />{" "}
        </TouchableOpacity>{" "}
      </View>
      <View className="py-2 px-4 h-[90%]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 max-h-10"
          contentContainerStyle={{ alignItems: "center" }}
        >
          {["Organic", "Non-Organic", "Hazard"].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`flex-row items-center h-10 mx-1 px-5 py-2 rounded-full ${
                selectedCategory === category ? "bg-green-600" : "bg-gray-100"
              }`}
            >
              <Image
                source={icons[category as keyof typeof icons]}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text
                className={`ml-2 text-md font-medium ${
                  selectedCategory === category ? "text-white" : "text-black"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
        >
          {filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              className="shadow-lg shadow-black"
              onPress={() =>
                setSelectedReports((prev) =>
                  prev.includes(report.id)
                    ? prev.filter((item) => item !== report.id)
                    : [...prev, report.id]
                )
              }
              style={{
                margin: 6,
                borderWidth: selectedReports.includes(report.id) ? 2 : 0,
                borderColor: selectedReports.includes(report.id)
                  ? "green"
                  : "transparent",
                borderRadius: 8,
              }}
            >
              <Image
                source={{ uri: report.ImageURL }}
                className="w-32 h-32 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-xs text-center mt-2">{report.Result}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="absolute bottom-4 right-4 bg-green-600 p-4 rounded-full shadow-lg"
        >
          <Image source={icons.Camera} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
      {/* Modal Upload */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/30"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className="absolute bottom-0 w-full gap-3 bg-white rounded-t-2xl p-6 space-y-4">
            <Text className="text-lg font-semibold text-center text-gray-700">
              Choose Photo
            </Text>
            <TouchableOpacity
              onPress={() => {
                takePhoto();
                setModalVisible(false);
              }}
              className="bg-green-700 rounded-full py-3 items-center"
            >
              <Text className="text-white font-semibold">Take a new photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                pickImage();
                setModalVisible(false);
              }}
              className="bg-green-700 rounded-full py-3 items-center"
            >
              <Text className="text-white font-semibold">
                Select from gallery
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
