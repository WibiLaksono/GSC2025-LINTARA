import { logoutUser } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserId, createReport, deleteReport } from "@/services/reportService";

const dummyData = {
  Organic: [
    require("../../assets/action-img/organic1.jpeg"),
    require("../../assets/action-img/organic2.jpeg"),
  ],
  "Non-Organic": [
    require("../../assets/action-img/non-organic1.jpeg"),
    require("../../assets/action-img/non-organic2.jpeg"),
  ],
  Hazard: [
    require("../../assets/action-img/hazard1.jpeg"),
    require("../../assets/action-img/hazard2.jpeg"),
  ],
};

const icons = {
  Organic: require("../../assets/icons/organic.png"),
  "Non-Organic": require("../../assets/icons/non-organic.png"),
  Hazard: require("../../assets/icons/hazard.png"),
  Camera: require("../../assets/icons/camera.png"),
};

interface CapturedImage {
  uri: string;
  categories: (keyof typeof dummyData)[];
}

export default function ActionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<keyof typeof dummyData>("Organic");
  const [facing, setFacing] = useState<CameraType>("back");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const cameraRef = useRef<Camera | null>(null);

  // Fungsi untuk memilih kategori acak
  function getRandomCategories(): (keyof typeof dummyData)[] {
    const allCategories: (keyof typeof dummyData)[] = ["Organic", "Non-Organic", "Hazard"];
    const shuffled = allCategories.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 1; // Ambil 1–3 kategori
    return shuffled.slice(0, count);
  }

  useEffect(() => {
    const loadCapturedImages = async () => {
      try {
        const dir = FileSystem.documentDirectory + "captured-images/";
        const files = await FileSystem.readDirectoryAsync(dir);

        const loadedImages: CapturedImage[] = [];

        for (const file of files) {
          const uri = dir + file;
          const randomCategories = getRandomCategories(); // Simulasi data asli

          loadedImages.push({
            uri,
            categories: randomCategories,
          });
        }

        setCapturedImages(loadedImages);
      } catch (e) {
        console.error("Failed to load local images:", e);
      }
    };

    loadCapturedImages();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync();

      const fileName = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        photo.uri
      );
      const newPath = FileSystem.documentDirectory + `captured-images/${fileName}.jpeg`;

      try {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "captured-images/",
          { intermediates: true }
        );

        await FileSystem.moveAsync({
          from: photo.uri,
          to: newPath,
        });

        const randomCategories = getRandomCategories();
        const userId = await getUserId();

        await createReport({
          UserID: userId,
          Category_trash: randomCategories,
          ImageURL: newPath,
          result: null,
          Location: null,
        });

        setCapturedImages((prev) => [
          { uri: newPath, categories: randomCategories },
          ...prev,
        ]);
      } catch (error) {
        console.error("Error saving image:", error);
      }

      setShowCamera(false);
    }
  };

  const handleDelete = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("No images selected", "Please select images to delete.");
      return;
    }

    try {
      for (const imageUri of selectedImages) {
        await deleteReport(imageUri);
        await FileSystem.deleteAsync(imageUri, { idempotent: true });

        setCapturedImages((prev) =>
          prev.filter((img) => img.uri !== imageUri)
        );
      }
      setSelectedImages([]);
      Alert.alert("Success", "Selected images have been deleted.");
    } catch (error) {
      console.error("Error deleting images:", error);
      Alert.alert("Error", "Failed to delete selected images.");
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-center text-lg text-black px-4">
          Kamera tidak diizinkan. Silakan aktifkan izin kamera di pengaturan.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="mt-4 bg-green-600 px-4 py-2 rounded-full"
        >
          <Text className="text-white">Minta Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View className="flex-1 bg-black">
        <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef as any}>
          <View className="absolute bottom-10 w-full flex-row justify-around px-6">
            <TouchableOpacity onPress={() => setShowCamera(false)}>
              <Text className="text-white text-lg">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCapture}>
              <Image source={icons.Camera} className="w-10 h-10" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setFacing((prev) => (prev === "back" ? "front" : "back"))
              }
            >
              <Text className="text-white text-lg">Flip</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  const filteredImages = [
    ...(dummyData[selectedCategory] || []),
    ...capturedImages
      .filter((img) => img.categories.includes(selectedCategory))
      .map((img) => img.uri),
  ];

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center h-[66px] shadow-xl shadow-black px-4 py-4 bg-green-200">
        <Text className="text-xl font-bold text-green-950 text-center flex-1">
          Action
        </Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={{ position: "absolute", right: 16 }}
        >
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="py-2 px-4 h-[90%]">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 max-h-10"
          contentContainerStyle={{ alignItems: "center" }}
        >
          {Object.keys(dummyData).map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() =>
                setSelectedCategory(category as keyof typeof dummyData)
              }
              className={`flex-row items-center h-10 mx-1 px-5 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-green-600"
                  : "bg-gray-100"
              }`}
            >
              <Image
                source={icons[category as keyof typeof icons]}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
              <Text
                className={`ml-2 text-md font-medium ${
                  selectedCategory === category
                    ? "text-white"
                    : "text-black"
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
          {filteredImages.map((uri, index) => (
            <TouchableOpacity
              key={index}
              className="shadow-lg shadow-black"
              onPress={() =>
                setSelectedImages((prev) =>
                  prev.includes(uri)
                    ? prev.filter((item) => item !== uri)
                    : [...prev, uri]
                )
              }
              style={{
                margin: 6,
                borderWidth: selectedImages.includes(uri) ? 2 : 0,
                borderColor: selectedImages.includes(uri) ? "green" : "transparent",
                borderRadius: 8,
              }}
            >
              <Image
                source={typeof uri === "string" ? { uri } : uri}
                className="w-32 h-32 rounded-xl"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          onPress={() => setShowCamera(true)}
          className="absolute bottom-4 right-4 bg-green-600 p-4 rounded-full shadow-lg"
        >
          <Image source={icons.Camera} className="w-6 h-6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
