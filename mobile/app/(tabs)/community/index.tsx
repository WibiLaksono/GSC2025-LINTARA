import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getAllPosts,
  getCommentsByPost,
  createComment,
} from "@/services/communityService";

export default function CommunityScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
  
      console.log("Normalized posts:", normalizedPosts);
      setPosts(normalizedPosts);
    };
  
    fetchPosts();
  }, []);
  

  const openCommentModal = async (post) => {
    setSelectedPost(post);
    const res = await getCommentsByPost(post.ID);
    setComments(res.data || []);
    setCommentModalVisible(true);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await createComment(selectedPost.ID, newComment);
      const res = await getCommentsByPost(selectedPost.ID);
      setComments(res.data || []);
      setNewComment("");
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
        <Image source={{ uri: item.image_url }} className="w-full h-48 rounded-md" />
      )}
      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          onPress={async () => {
            const userID = await getUserID();
            const isLiked = comments.some(
              (comment) => comment.UserID === userID && comment.PostID === item.ID
            );
        
            if (isLiked) {
              await unlikePost(item.ID);
            } else {
              await likePost(item.ID);
            }
        
            const updatedLikes = await getLikedByUsers(item.ID);
            setPosts((prevPosts) =>
              prevPosts.map((post) =>
                post.ID === item.ID
                  ? { ...post, likes: updatedLikes.postCount }
                  : post
              )
            );
          }}
          className="flex-row items-center"
        >
          <FontAwesome
            name={
              comments.some((comment) => comment.UserID === userID && comment.PostID === item.ID)
                ? "heart"
                : "heart-o"
            }
            size={18}
            color={
              comments.some((comment) => comment.UserID === userID && comment.PostID === item.ID)
                ? "red"
                : "gray"
            }
            className="mr-2"
          />
          <Text>{item.likes || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
        const res = await getCommentsByPost(item.ID);
        openCommentModal(item);
          }}
          className="flex-row items-center"
        >
          <MaterialCommunityIcons name="comment-text-outline" size={18} color="gray" className="mr-2" />
          <Text>{comments.filter(comment => comment.PostID === item.ID).length}</Text>
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
          <Text className="text-center text-gray-400 mt-10">Nothing post to see</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item, index) => (item?.ID ? item.ID.toString() : index.toString())}
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
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 p-4 bg-white">
            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
              <Text className="text-blue-500 mb-4">Close</Text>
            </TouchableOpacity>

            <FlatList
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="mb-3 border-b border-gray-200 pb-2">
                  <Text className="font-semibold">{item.username}</Text>
                  <Text className="text-gray-700">{item.comment}</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />

            {/* Input Comment */}
            <View className="flex-row items-center border-t pt-2 mt-2">
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
