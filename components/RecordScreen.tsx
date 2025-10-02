import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { supabase } from "../supabaseClient";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";

const RecordScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setStatusMsg("Recording...");
    } catch (err) {
      console.error("Start recording error:", err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri || null);
      setRecording(null);
      setStatusMsg("Recording stopped");
    } catch (err) {
      console.error("Stop recording error:", err);
    }
  };

  const playSound = async () => {
    if (!audioUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error("Playback error:", err);
    }
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const uploadAudio = async () => {
    if (!audioUri) return;
    try {
      setIsUploading(true);
      setStatusMsg("Uploading...");

      const base64File = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBytes = new Uint8Array(
        atob(base64File)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      const fileName = `meeting-${Date.now()}.m4a`;

      const { error } = await supabase.storage
        .from("EchoMind")
        .upload(`uploads/${fileName}`, fileBytes, {
          contentType: "audio/m4a",
        });

      if (error) throw error;

      setStatusMsg("✅ Upload complete!");
    } catch (err) {
      console.error("Upload error:", err);
      setStatusMsg("❌ Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View
      className="flex-1  bg-[#F8FCFF]"
    >
      {/* Header */}
      <View className="bg-indigo-700  px-5 pt-16 pb-8">
        <Text className="text-2xl font-bold text-white">🎙️ Meeting Recorder</Text>
        <Text className="text-sm text-indigo-200">
          Capture, summarize, and organize with AI
        </Text>
      </View>

      {/* Status Bar */}
      <View className="bg-indigo-600 flex-row justify-between px-4 py-3">
        <Text className="text-white font-medium">
          {statusMsg || "Ready to record"}
        </Text>
        {recording && (
          <Text className="text-white font-mono font-bold">
            {formatTime(recordingTime)}
          </Text>
        )}
      </View>

      {/* Recording Visualization */}
      <View className="bg-white mx-4 mt-4 rounded-2xl p-6 items-center">
        {recording ? (
          <Text className="text-lg text-gray-600">🎤 Listening...</Text>
        ) : audioUri ? (
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-green-500 items-center justify-center mb-4">
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text className="text-xl font-bold text-gray-900">
              Recording Complete!
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              Your audio is ready to upload
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <View className="w-24 h-24 rounded-full bg-indigo-100 items-center justify-center mb-4">
              <Ionicons name="mic" size={48} color="#4f46e5" />
            </View>
            <Text className="text-xl font-bold text-gray-900">
              Ready to Record
            </Text>
            <Text className="text-sm text-gray-500 mt-2">
              Tap the microphone button to start
            </Text>
          </View>
        )}
      </View>

      {/* Controls */}
      <View className=" flex-row justify-center gap-6 my-6">
        {recording ? (
          <TouchableOpacity
            onPress={stopRecording}
            className="p-5 rounded-full bg-red-500"
          >
            <Ionicons name="stop" size={28} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startRecording}
            className="p-5 rounded-full bg-indigo-700"
          >
            <Ionicons name="mic" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {audioUri && !recording && (
          <>
            <TouchableOpacity
              onPress={playSound}
              className="p-5 rounded-full bg-blue-500"
            >
              <Ionicons name="play" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={uploadAudio}
              className={`px-6 py-5 rounded-full ${
                isUploading ? "bg-gray-400" : "bg-emerald-500"
              }`}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Feather name="upload" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* AI Insights */}
      <View className="bg-white mx-4 rounded-2xl p-6 mt-4">
        <Text className="text-lg font-bold text-gray-900">🧠 AI Insights</Text>
        <Text className="text-xs text-gray-500 mb-4">
          Powered by EchoMind Intelligence
        </Text>

        {[
          ["📝", "Full Transcript"],
          ["💡", "Key Discussion Points"],
          ["✅", "Action Items & Deadlines"],
          ["👥", "Speaker Identification"],
        ].map(([icon, text], i) => (
          <View key={i} className="flex-row items-center mb-2">
            <Text className="text-xl mr-2">{icon}</Text>
            <Text className="text-sm text-gray-700">{text}</Text>
          </View>
        ))}
      </View>

      {/* Pro Tips */}
      <View className="flex-row items-start bg-indigo-100 mx-4 mt-4 p-4 rounded-xl">
        <MaterialIcons name="lightbulb-outline" size={24} color="#4f46e5" />
        <View className="ml-3">
          <Text className="font-bold text-gray-900 mb-2">Pro Tips</Text>
          <Text className="text-sm text-gray-700">• Place device near speakers</Text>
          <Text className="text-sm text-gray-700">• Keep background noise low</Text>
          <Text className="text-sm text-gray-700">• Speak clearly</Text>
          <Text className="text-sm text-gray-700">• Max length: 2 hours per session</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordScreen;
