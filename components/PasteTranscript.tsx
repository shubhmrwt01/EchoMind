import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../supabaseClient";

export default function PasteTranscript() {
  const [isFocused, setIsFocused] = useState(false);
  const [pasteText,setPasteText]=useState("");
  const handleSubmit =async() => {
    if(!pasteText.trim()){
      Alert.alert("Error","Please enter text before process");
      return;
    }
    const {error}=await supabase
    .from("transcript")
    .insert([{pasteText}]);
    if(error){
      Alert.alert("Error ",error.message);
    }else{
      Alert.alert("Success","Script saved to Supabase!");
      setPasteText("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FCFF]">
      <View className="px-6 mt-16">
        {/* Heading */}
        <Text className="text-[28px] font-extrabold text-center text-gray-900">
          Paste Transcript
        </Text>
        <Text className="text-[15px] text-gray-500 text-center mt-2">
          Copy & paste your meeting transcript below
        </Text>

        <View
          className={`mt-8 rounded-3xl ${
            isFocused ? "border-2 border-violet-500" : "border border-gray-200"
          } bg-white shadow-md`}
        >
          <TextInput
            className="p-4 text-[16px] text-gray-800"
            placeholder="Paste your transcript here..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{ height: 220 }}
            scrollEnabled={true}
            value={pasteText}
            onChangeText={setPasteText}
          />
        </View>

        {/* Action buttons */}
        <View className="flex-row justify-center gap-4 mt-10">
          <Pressable onPress={handleSubmit} className="bg-violet-600 px-12 py-4 rounded-2xl shadow-md active:opacity-90">
            <Text className="text-white text-lg font-semibold">Process</Text>
          </Pressable>
          <Pressable onPress={()=>setPasteText("")} className="bg-white px-12 py-4 border border-gray-200 rounded-2xl shadow-sm active:opacity-70">
            <Text className="text-gray-400 text-lg font-semibold">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
