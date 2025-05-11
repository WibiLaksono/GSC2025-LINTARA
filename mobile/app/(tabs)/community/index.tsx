import {
  createComment,
  getAllPosts,
  getCommentsByPost,
  getLikedByUsers,
  likePost,
  unlikePost,
} from "@/services/communityService";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userID, setUserID] = useState(null); // Store UserID

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPosts();
      const normalizedPosts = result.map((item) => ({
        ID: item.id,
        caption: item.Caption,
        image_url: item.ImageURL,
        location: item.Location,
        created_at: new Date(item.Created_at._seconds * 1000).toLocaleString(),
        username: "User",
        user_image: "",
      }));
      setPosts(normalizedPosts);
    };

    fetchPosts();
    const fetchUserID = async () => {
      const id = await getUserID();
      setUserID(id); // Set the userID
    };

    fetchUserID();
  }, []);

  const openCommentModal = async (post) => {
    console.log("Opening comment modal for post:", post.ID);
    setCommentModalVisible(true);
    setSelectedPost(post);
    const res = await getCommentsByPost(post.ID);
    console.log("Comments for post:", res.data);
    setComments(res.data || []);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await createComment(selectedPost.ID, newComment); // Kirimkan komentar ke database
      const res = await getCommentsByPost(selectedPost.ID); // Ambil komentar terbaru
      setComments(res.data || []); // Update state comments
      setNewComment(""); // Reset input
    }
  };

  const handleLikePost = async (post) => {
    if (!userID) return; // Ensure userID is available

    try {
      // Check if the user has already liked the post
      const isLiked = (await getLikedByUsers(post.ID)).data.some(
        (like) => like.UserID === userID
      );

      if (isLiked) {
        // Unlike the post if already liked
        await unlikePost(post.ID);
      } else {
        // Like the post if not already liked
        await likePost(post.ID);
      }

      // Fetch updated likes count and update the post state
      const updatedLikes = await getLikedByUsers(post.ID);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.ID === post.ID ? { ...p, likes: updatedLikes.postCount } : p
        )
      );
    } catch (error) {
      console.error("Error handling like/unlike post:", error);
    }
  };

  const renderPost = ({ item }) => (
    <View className="bg-white p-4 mb-4 rounded-md">
      <View className="flex-row items-center mb-2">
        <Image
          source={
            item.user_image
              ? { uri: item.user_image }
              : require("../../../assets/images/pict1.jpg")
          }
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="font-bold">{item.username}</Text>
          <Text className="text-xs text-gray-500">
            {item.created_at}, {item.location}
          </Text>
        </View>
      </View>
      <Text className="mb-2">{item.caption}</Text>
      {item.image_url?.startsWith("http") && (
        <Image
          source={{ uri: item.image_url }}
          className="w-full h-48 rounded-md"
        />
      )}
      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          onPress={() => handleLikePost(item)}
          className="flex-row items-center"
        >
          <FontAwesome
            name={item.likes && item.likes > 0 ? "heart" : "heart-o"}
            size={18}
            color={item.likes && item.likes > 0 ? "red" : "gray"}
            className="mr-2"
          />
          <Text>{item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => openCommentModal(item)}
          className="flex-row items-center"
        >
          <MaterialCommunityIcons
            name="comment-text-outline"
            size={18}
            color="gray"
            className="mr-2"
          />
          <Text>
            {comments.filter((comment) => comment.PostID === item.ID).length}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-green-200">
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View className="h-[66px] px-4 bg-green-200 flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-black">Community</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/community/search")}
          style={{ position: "absolute", right: 16 }}
        >
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* MAIN AREA */}
      <View className="flex-1 bg-white px-4 pt-4">
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => router.push("/community/create")}
        >
          <Image
            source={require("../../../assets/images/pict1.jpg")}
            className="w-10 h-10 rounded-full mr-3"
          />
          <Text className="text-gray-700 text-base border-[1px] border-gray-500 w-[86%] px-2 py-2 rounded-xl">
            Is there anything you would like to share?
          </Text>
        </TouchableOpacity>

        {posts.length === 0 ? (
          <Text className="text-center text-gray-400 mt-10">
            Nothing post to see
          </Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.ID.toString()}
            renderItem={renderPost}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* MODAL KOMENTAR */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View className="h-[40%] p-4 bg-gray-100 shadow-black shadow-lg rounded-t-lg">
        <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
          <Text className="text-blue-500 mb-4">Close</Text>
        </TouchableOpacity>

        {/* Scrollable Comments */}
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="mb-3 border-b border-gray-200 pb-2">
          <Text className="font-semibold">
            {item.Username || "User"}
          </Text>
          <Text className="text-gray-700">{item.Comment}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />

        {/* Static Input Comment */}
        <View className="flex-row items-center border-t pt-2">
          <TextInput
            placeholder="Add a comment"
            value={newComment}
            onChangeText={setNewComment}
            className="flex-1 border border-gray-300 rounded-md p-2"
          />
          <TouchableOpacity
            onPress={handleAddComment}
            className="ml-2 bg-green-500 px-4 py-2 rounded-md"
          >
            <Text className="text-white">Send</Text>
          </TouchableOpacity>
        </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
