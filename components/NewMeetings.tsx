import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { supabase } from "../supabaseClient";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
export default function NewMeetings() {
  const navigation = useNavigation();
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
    <View className="h-[100%] bg-[#F8FCFF]">
      <View className="w-36 h-36 ml-[32%] mt-10   rounded-full overflow-hidden">
        <LinearGradient
          colors={["#93C5FD", "#C4B5FD", "#FBCFE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        >
          <View className="pl-10 pt-10">
            <Text className="text-[40px]">🎤</Text>
          </View>
        </LinearGradient>
      </View>
      <View className="items-center mt-6">
        <Text className="text-[18px] font-semibold ">
          Upload Meetings Recordings
        </Text>
        <Text className="text-[16px] mt-2 text-gray-600">
          Choose how you want to add your meeting
        </Text>
      </View>
      {/* Record Now */}
      <Pressable className="justify-center mx-8 rounded-2xl mt-12 h-20 w-[84%] bg-blue-300">
        <Text className="text-white text-center text-[22px] font-semibold">
          📱 Record Now
        </Text>
      </Pressable>
      {/* Upload File */}
      <Pressable
        onPress={handleFileUpload}
        className="justify-center mx-8 rounded-2xl mt-6 h-20 w-[84%] bg-blue-300"
      >
        <Text className="text-white text-center text-[22px] font-semibold">
          📁 Upload File
        </Text>
      </Pressable>
      {/* Paste Transcript */}
      <Pressable
        onPress={() => navigation.navigate("PasteTranscript")}
        className="justify-center mx-8 rounded-2xl mt-6 h-20 w-[84%] bg-blue-300"
      >
        <Text className="text-white pl-6 text-center text-[22px] font-semibold">
          📝 Paste Transcript
        </Text>
      </Pressable>
      {/* Supported Formats */}
      <View className="border w-[84%] border-gray-400 rounded-2xl mx-8 my-14 p-5 bg-blue-50 ">
        <Text className="text-[18px] font-semibold">Supported Formats</Text>
        <Text className="mt-2 text-[16px] text-gray-600 mx-2">
          • Audio: MP3, M4A, WAV, AAC
        </Text>
        <Text className="text-[16px] text-gray-600 mx-2">
          • Text: Plain text, Word docs
        </Text>
        <Text className="text-[16px] text-gray-600 mx-2">
          • Max file size: 10MB
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
