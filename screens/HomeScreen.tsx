import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabaseClient";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export default function HomeScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [recordMeeting, setRecordMeeting] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [meetingCount, setMeetingCount] = useState(0);
  useEffect(() => {
    recordMeetings();
  }, []);
  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  });
  const updateGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };
  const countMeeting = async () => {
    const querySnapshot = await getDocs(query(collection(db, "Meetings")));
    setMeetingCount(querySnapshot.size);
  };
  useEffect(() => {
    countMeeting();
  });
  const recordMeetings = async () => {
    setRecordMeeting([]);
    const q = query(collection(db, "Meetings"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setRecordMeeting((recordMeeting) => [...recordMeeting, doc.data()]);
    });
  };
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "audio/mpeg",
          "audio/x-m4a",
          "audio/wav",
          "audio/aac",
          "text/plain",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (result.type === "cancel") return;

      const file = result.assets?.[0];
      if (!file) {
        Alert.alert("Error", "No file selected.");
        return;
      }

      const { name, size, uri } = file;

      // 10MB limit
      if (size > 10 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a file under 10MB.");
        return;
      }

      // Convert file -> base64 -> Uint8Array
      const base64File = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileExt = name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("EchoMind")
        .upload(filePath, decode(base64File), {
          contentType: file.mimeType || "application/octet-stream",
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("EchoMind")
        .getPublicUrl(filePath);

      Alert.alert("Success ✅", `Uploaded to: ${urlData.publicUrl}`);
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert("Error", "Something went wrong while uploading.");
    }
  };
  return (
    <SafeAreaView className="bg-[#F8FCFF] flex-1 ">
      {/* Header */}
      <View className=" h-28 mx-3 my-3 p-4 border-b-2 border-gray-300 bg-white flex-row justify-between  rounded-2xl overflow-hidden">
        <View className="justify-center">
          <Text className="text-[23px] font-bold">{`${greeting}, ${user?.fullName}`}</Text>
          <Text className="text-[16px] text-gray-600">
            Ready to turn conversations into actions?
          </Text>
        </View>
        <Image
          className="h-12 w-12 mt-2 rounded-full pl-8 justify-center"
          source={{ uri: user?.imageUrl }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="m-1">
        {/* Analytics */}
        <View className="flex-row justify-center gap-10  ">
          <View className="bg-white h-40 w-48 justify-center border border-gray-300   rounded-2xl pl-10 ">
            <Text className="text-[30px]">📊</Text>
            <Text className="text-[28px] font-bold pt-2">{meetingCount}</Text>
            <Text className="text-[13px] text-gray-600">Meetings</Text>
          </View>
          <View className="bg-white h-46 w-48 pl-10 border border-gray-300   justify-center rounded-2xl overflow-hidden ">
            <Text className="text-[30px]">⏱️</Text>
            <Text className="text-[28px] font-bold pt-2">{`${2.5 * meetingCount} h`}</Text>
            <Text className="text-[13px] text-gray-600">Time Saved</Text>
          </View>
        </View>

        {/* New Meeting with zoom effect */}
        <Pressable
          onPress={() => navigation.navigate("NewMeetings")}
          className="w-[88%] h-[220px] ml-8 mt-8 rounded-3xl overflow-hidden"
        >
          <LinearGradient
            colors={["#93C5FD", "#C4B5FD", "#FBCFE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
          >
            <View className="items-center">
              <Text className="text-[60px] mt-11 text-center">🎤</Text>
              <Text className="text-white text-[22px] text-center font-semibold mt-6">
                New Meeting
              </Text>
              <Text className="text-white text-[18px] font-medium mt-2">
                Tap to record or upload
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
        {/* Upload & Paste Text */}
        <View className="flex-row justify-center gap-10 mt-6 ">
          <Pressable
            onPress={handleFileUpload}
            className="bg-white border border-gray-300 h-32 w-48 justify-center items-center  rounded-2xl "
          >
            <Text className="text-[32px]">📁</Text>
            <Text className="text-[13px] pt-2">Upload</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("PasteTranscript")}
            className="bg-white border border-gray-300 h-32 w-48  items-center justify-center rounded-2xl  "
          >
            <Text className="text-[30px]">📝</Text>
            <Text className="text-[13px] pt-2">Paste Transcript</Text>
          </Pressable>
        </View>
        {/* Recent Meetings */}
        <View className="m-6 bg-white rounded-2xl p-2 border border-gray-300">
          <View className="flex-row items-center justify-between">
            <Text className="text-[22px] font-bold pl-6 py-2">
              Recent Meetings
            </Text>
            <Pressable>
              <Text className="text-[18px] text-blue-600 pr-5">See All</Text>
            </Pressable>
          </View>
          <FlatList
            data={recordMeeting}
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                className=" justify-center border border-gray-300 mx-4 my-4 p-6 rounded-2xl overflow-hidden bg-[#FAFDFF]"
                key={index}
              >
                <Text className="text-[20px] font-semibold mt-">
                  {item?.Summary}
                </Text>
                <Text className="text-[18px] text-gray-500 font-medium mt-2">
                  {item?.Title}
                </Text>
                <Text className="text-[18px] mt-2 ">
                  {item?.isCompleted ? (
                    <View className="bg-green-200 p-2 rounded-lg overflow-hidden">
                      <Text className="font-semibold text-green-900 ">
                        ✅ Completed
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-yellow-200 p-2">
                      <Text className="font-semibold text-yellow-700 rounded-lg overflow-hidden">
                        ⏳ Processing
                      </Text>
                    </View>
                  )}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
      {/* ChatBot */}
      <Pressable
        onPress={() => navigation.navigate("ChatBot")} // 👈 Navigate to ChatBot screen
        className="absolute bottom-6 right-4 z-50 bg-[#B3DAFF] border  border-gray-400 rounded-2xl p-2 shadow-lg"
      >
        <Image
          className="h-16 w-16"
          source={require("../assets/chatBot.png")}
        />
      </Pressable>
    </SafeAreaView>
  );
}
