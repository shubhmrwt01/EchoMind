import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabaseClient";

export default function PasteTranscript() {
  const [isFocused, setIsFocused] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const handleSubmit = async () => {
    if (!pasteText.trim()) {
      Alert.alert("Error", "Please enter text before processing");
      return;
    }

    const { error } = await supabase.from("transcript").insert([{ pasteText }]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Transcript saved to Supabase!");
      setPasteText("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Heading */}
        <Text className="text-3xl font-bold text-center text-gray-900">
          Paste Transcript
        </Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          Copy & paste your meeting transcript below
        </Text>

        {/* TextInput Card */}
        <View
          className={`mt-8 p-4 rounded-2xl bg-white shadow-lg ${
            isFocused ? "border-2 border-violet-500" : "border border-gray-200"
          }`}
        >
          <TextInput
            placeholder="Paste your transcript here..."
            placeholderTextColor="#A1A1AA"
            multiline
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ minHeight: 220, fontSize: 16, color: "#111827" }}
            value={pasteText}
            onChangeText={setPasteText}
            scrollEnabled
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-center gap-4 mt-10">
          <Pressable
            onPress={handleSubmit}
            className="flex-1 bg-violet-600 px-6 py-4 rounded-2xl shadow-lg active:scale-95"
          >
            <Text className="text-white text-lg font-semibold text-center">
              Process
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPasteText("")}
            className="flex-1 bg-white px-6 py-4 border border-gray-300 rounded-2xl shadow-sm active:scale-95"
          >
            <Text className="text-gray-500 text-lg font-semibold text-center">
              Cancel
            </Text>
          </Pressable>
        </View>

        {/* Optional Tip Section */}
        <View className="mt-6 bg-violet-50 p-4 rounded-xl shadow-sm">
          <Text className="text-gray-700 text-sm">
            Tip: Make sure your transcript is clear and properly formatted for
            better processing results.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
