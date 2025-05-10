import { createPost } from "@/services/communityService"; // adjust path
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

export default function createCommunity() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [allowComments, setAllowComments] = useState(null);
  const [location, setLocation] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const charLimit = 255;

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "We need access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.fileSize > 10 * 1024 * 1024) {
        Alert.alert("File too large", "Image must be under 10MB.");
        return;
      }

      // Get location from metadata
      if (asset.exif?.GPSLatitude && asset.exif?.GPSLongitude) {
        setLocation(
          `Lat: ${asset.exif.GPSLatitude}, Lng: ${asset.exif.GPSLongitude}`
        );
      }

      setImage(asset.uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission denied", "We need access to your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.fileSize > 10 * 1024 * 1024) {
        Alert.alert("File too large", "Image must be under 10MB.");
        return;
      }

      if (asset.exif?.GPSLatitude && asset.exif?.GPSLongitude) {
        setLocation(
          `Lat: ${asset.exif.GPSLatitude}, Lng: ${asset.exif.GPSLongitude}`
        );
      }

      setImage(asset.uri);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setLocation("");
  };

  const saveImageLocally = async (uri) => {
    const folderPath = `${FileSystem.documentDirectory}Lintara/community/`;
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });

    const filename = uri.split("/").pop();
    const newPath = folderPath + filename;
    await FileSystem.copyAsync({ from: uri, to: newPath });

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(newPath);
      await MediaLibrary.createAlbumAsync("Lintara/community", asset, false);
    }

    return newPath;
  };

  const handlePost = async () => {
    if (caption.length > charLimit) {
      Alert.alert("Too long", `Caption must be under ${charLimit} characters.`);
      return;
    }

    let savedImage = null;
    if (image) {
      savedImage = await saveImageLocally(image);
    }

    try {
      await createPost(
        caption,
        allowComments ? "true" : "false",
        savedImage,
        location
      );
      Alert.alert("Success", "Post uploaded!");
      router.push("/community");
    } catch (e) {
      Alert.alert("Error", "Something went wrong while uploading.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="h-[66px] bg-green-200 shadow-lg shadow-black flex-row items-center px-4">
        <TouchableOpacity onPress={() => router.push("/community")}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-end">
          <TouchableOpacity onPress={handlePost}>
            <Ionicons name="send-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <TextInput
          placeholder="What's going on?"
          multiline
          maxLength={charLimit}
          className="text-base text-black min-h-[120px] border-b border-gray-300 pb-2"
          value={caption}
          onChangeText={(text) => setCaption(text)}
        />
        <Text className="text-right text-gray-500">
          {charLimit - caption.length} characters left
        </Text>

        {/* Image preview */}
        {image ? (
          <View className="relative my-4">
            <Image source={{ uri: image }} className="w-full h-60 rounded-xl" />
            <TouchableOpacity
              onPress={handleRemoveImage}
              className="absolute top-2 right-2 bg-white p-1 rounded-full"
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Location info */}
        {location ? (
          <Text className="text-sm text-gray-500 mt-2">📍 {location}</Text>
        ) : null}
      </ScrollView>

      {/* Footer */}
      <View className="bg-green-200 h-20 px-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() =>
            setAllowComments((prev) => (prev === null ? true : null))
          }
          className="flex-row items-center space-x-2"
        >
          <View
            className={`w-5 h-5 border-2 rounded ${
              allowComments ? "bg-green-500 border-green-600" : "border-gray-400"
            }`}
          />
          <Text className="text-gray-700">Allow comments</Text>
        </TouchableOpacity>

        {!image && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialCommunityIcons name="image-plus" size={28} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for image options */}
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
          <View className="absolute bottom-0 w-full bg-white rounded-t-2xl p-6 space-y-4">
            <Text className="text-lg font-semibold text-center text-gray-700">
              Upload Image
            </Text>
            <TouchableOpacity
              onPress={() => {
                takePhoto();
                setModalVisible(false);
              }}
              className="bg-green-700 rounded-full w-full mb-3 py-3 items-center"
            >
              <Text className="text-white font-semibold">Take a new photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                pickImage();
                setModalVisible(false);
              }}
              className="bg-green-700 rounded-full w-full py-3 items-center"
            >
              <Text className="text-white font-semibold">Choose photo</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
