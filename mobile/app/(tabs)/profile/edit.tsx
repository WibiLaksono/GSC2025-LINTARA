import { editUser, getUserById } from "@/services/userService";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function EditProfile() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    gender: "",
    birthDate: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const {
          First_name,
          Last_name,
          Username,
          Email,
          Gender,
          Birth_date,
          user_image,
        } = await getUserById();
        setForm({
          firstName: First_name || "",
          lastName: Last_name || "",
          username: Username || "",
          email: Email || "",
          gender: Gender || "",
          birthDate: Birth_date || "",
        });
        if (user_image) setSelectedImage(user_image);
      } catch (error) {
        Alert.alert("Error", "Failed to load user data");
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow access to media library."
        );
      }
    })();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      await editUser({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        gender: form.gender,
        birthDate: form.birthDate,
        user_image: selectedImage,
      });
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const saveImageToGallery = async (uri: string) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      let album = await MediaLibrary.getAlbumAsync("Lintara/profile");

      if (!album) {
        const lintaraAlbum = await MediaLibrary.getAlbumAsync("Lintara");
        if (!lintaraAlbum) {
          await MediaLibrary.createAlbumAsync("Lintara", asset, false);
          await MediaLibrary.createAlbumAsync("Challenge", asset, false);
        } else {
          await MediaLibrary.createAlbumAsync("Challenge", asset, false);
        }
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert("Saved", "Image saved to Lintara/Challenge.");
    } catch (error) {
      console.error("Failed to save image:", error);
      Alert.alert("Error", "Could not save image.");
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      await saveImageToGallery(uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
      await saveImageToGallery(uri);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-xl font-semibold text-center text-green-700 mb-6">
        Edit profile
      </Text>

      <View className="items-center mb-6 relative">
        <Image
          source={
            selectedImage
              ? { uri: selectedImage }
              : require("@/assets/images/pict1.jpg")
          }
          className="w-28 h-28 rounded-full border-2 border-green-700"
        />
        <TouchableOpacity
          className="absolute bottom-0 right-0 bg-green-700 p-2 rounded-full"
          onPress={() => setModalVisible(true)}
        >
          <Icon name="camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(text) => handleChange("firstName", text)}
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(text) => handleChange("lastName", text)}
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Username"
        value={form.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Birth Date (DD-MM-YYYY)"
        value={form.birthDate}
        onChangeText={(text) => handleChange("birthDate", text)}
      />

      <View className="flex-row mb-4 space-x-2">
        <TouchableOpacity
          onPress={() => handleChange("gender", "PR")}
          className={`flex-row items-center justify-center border rounded-lg px-4 py-3 flex-1 ${
            form.gender === "PR"
              ? "bg-green-700 border-green-700"
              : "border-gray-300"
          }`}
        >
          <Icon
            name="venus"
            size={20}
            color={form.gender === "PR" ? "#fff" : "#555"}
          />
          <Text
            className={`ml-2 ${
              form.gender === "PR" ? "text-white font-bold" : "text-gray-700"
            }`}
          >
            Female
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleChange("gender", "LK")}
          className={`flex-row items-center justify-center border rounded-lg px-4 py-3 flex-1 ${
            form.gender === "LK"
              ? "bg-green-700 border-green-700"
              : "border-gray-300"
          }`}
        >
          <Icon
            name="mars"
            size={20}
            color={form.gender === "LK" ? "#fff" : "#555"}
          />
          <Text
            className={`ml-2 ${
              form.gender === "LK" ? "text-white font-bold" : "text-gray-700"
            }`}
          >
            Male
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="E-mail"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TouchableOpacity className="bg-green-700 rounded-lg py-3 mb-4">
        <Text className="text-white text-center font-semibold">
          Change password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-green-700 rounded-lg py-3 mb-8"
      >
        <Text className="text-white text-center font-semibold">
          Save Changes
        </Text>
      </TouchableOpacity>

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
