import Checkbox from "expo-checkbox";
import { useState, useEffect } from "react";
import {
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { createChallenge } from "@/services/challengeService";

export default function ChallengeMakeScreen() {
    const [rewardCertificate, setRewardCertificate] = useState(false);
    const [rewardMoney, setRewardMoney] = useState(false);
    const [rewardOthers, setRewardOthers] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [challengeName, setChallengeName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [maxParticipant, setMaxParticipant] = useState("");
    const [location, setLocation] = useState("");
    const [participantRequirement, setParticipantRequirement] = useState("");
    const [challengeGoal, setChallengeGoal] = useState("");

    // Request media permission
    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission required", "Please allow access to media library.");
            }
        })();
    }, []);

    // Function to save image to folder Lintara/Challenge
    const saveImageToGallery = async (uri: string) => {
        try {
            const asset = await MediaLibrary.createAssetAsync(uri);
            let album = await MediaLibrary.getAlbumAsync("Lintara/Challenge");

            if (!album) {
                const lintaraAlbum = await MediaLibrary.getAlbumAsync("Lintara");
                if (!lintaraAlbum) {
                    const newLintara = await MediaLibrary.createAlbumAsync("Lintara", asset, false);
                    album = await MediaLibrary.createAlbumAsync("Challenge", asset, false);
                } else {
                    album = await MediaLibrary.createAlbumAsync("Challenge", asset, false);
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

    const handleCreateChallenge = async () => {
        const rewards = [];
        if (rewardCertificate) rewards.push("e-certificate");
        if (rewardMoney) rewards.push("money");
        if (rewardOthers) rewards.push("others");

        const challengeData = {
            ChallengeName:challengeName,
            Description: description,
            Max_Participant: maxParticipant,
            Location: location,
            Start_date: startDate,
            End_date: endDate,
            ImageURL: selectedImage ?? null,
            Requirements: participantRequirement,
            Reward: rewards,
            Goals: challengeGoal,
        };

        try {
            const response = await createChallenge(challengeData);
            Alert.alert("Success", "Challenge created successfully!");
        } catch (error) {
            Alert.alert("Error", "Failed to create challenge. Please try again.");
            console.error(error);
        }
    };

    return (
        <>
            <ScrollView className="flex-1 bg-white">
                {/* Header Image Preview */}
                <View className="h-40 bg-gray-200 w-full relative items-center justify-center">
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            className="absolute top-0 left-0 w-full h-full"
                            resizeMode="cover"
                        />
                    )}
                    <TouchableOpacity
                        onPress={() => {
                            selectedImage ? setSelectedImage(null) : setModalVisible(true);
                        }}
                        className="absolute right-4 bottom-4 bg-green-600 p-3 rounded-full"
                    >
                        <Ionicons
                            name={selectedImage ? "close" : "camera"}
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>

                {/* Form Input */}
                <View className="p-4 space-y-3 gap-3">
                    <Text>Challenge name</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="Enter challenge name"
                        value={challengeName}
                        onChangeText={setChallengeName}
                    />

                    <Text>Start date</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="dd/mm/yyyy"
                        value={startDate}
                        onChangeText={setStartDate}
                    />

                    <Text>End date</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="dd/mm/yyyy"
                        value={endDate}
                        onChangeText={setEndDate}
                    />

                    <Text>Challenge description</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="Description"
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Text>Max Participant</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="ex: 100"
                        multiline
                        value={maxParticipant}
                        onChangeText={setMaxParticipant}
                    />

                    <Text>Location</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="Enter location"
                        value={location}
                        onChangeText={setLocation}
                    />

                    <Text>Participant requirement</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="e.g. age, level"
                        value={participantRequirement}
                        onChangeText={setParticipantRequirement}
                    />

                    <Text>Reward for participant</Text>
                    <View className="space-y-4 gap-3">
                        <View className="flex-row items-center space-x-4">
                            <Checkbox
                                value={rewardCertificate}
                                onValueChange={setRewardCertificate}
                                color={rewardCertificate ? "#22c55e" : undefined}
                            />
                            <Text className="ml-2">e-certificate</Text>
                        </View>
                        <View className="flex-row items-center space-x-4">
                            <Checkbox
                                value={rewardMoney}
                                onValueChange={setRewardMoney}
                                color={rewardMoney ? "#22c55e" : undefined}
                            />
                            <Text className="ml-2">money</Text>
                        </View>
                        <View className="flex-row items-center space-x-4">
                            <Checkbox
                                value={rewardOthers}
                                onValueChange={setRewardOthers}
                                color={rewardOthers ? "#22c55e" : undefined}
                            />
                            <Text className="ml-2">others</Text>
                        </View>
                    </View>

                    <Text>Challenge goal</Text>
                    <TextInput
                        className="border rounded-md p-2"
                        placeholder="ex: 100.000"
                        value={challengeGoal}
                        onChangeText={setChallengeGoal}
                    />

                    <TouchableOpacity
                        className="bg-green-700 p-4 rounded-md mt-4"
                        onPress={handleCreateChallenge}
                    >
                        <Text className="text-white text-center font-bold">Make</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Modal for uploading image */}
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
        </>
    );
}
