import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

export default function HomeScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const [recordMeeting, setRecordMeeting] = useState([]);
  useEffect(() => {
    recordMeetings("Summary1");
  }, []);

  const recordMeetings = async () => {
    setRecordMeeting([]);
    const q = query(collection(db, "Meetings"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setRecordMeeting((recordMeeting) => [...recordMeeting, doc.data()]);
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="m-1">
      {/* Header */}
      <View className="bg-white">
        <View className="flex-row ml-24 pt-10 pl-10">
          <Text className="text-[24px] font-bold">{`Hello, ${user?.fullName} 👋`}</Text>
        </View>
        <View className="ml-8">
          <Text className="text-[18px]">{`You have saved ${user?.fullName} hours this month`}</Text>
        </View>
        <View className="border-gray-400 border mt-5" />
      </View>

      {/* New Meeting with zoom effect */}
      <Pressable
        onPress={() => navigation.navigate("RecordScreen")}
        className="w-[90%] h-[225px] ml-6 mt-8 rounded-3xl overflow-hidden"
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
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

      {/* Recent Meetings */}
      <View className="m-6 bg-white rounded-2xl p-2 ">
        <Text className="text-[26px] font-bold pl-4 py-2">Recent Meetings</Text>
        <FlatList
          data={recordMeeting}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className=" justify-center mx-4 my-4 p-6 rounded-lg overflow-hidden bg-[#F2F2F2]"
              key={index}
            >
              <Text className="text-[20px] font-semibold mt-">{item?.Summary}</Text>
              <Text className="text-[18px] text-gray-500 font-medium mt-2">
                {item?.Title}
              </Text>
              <Text className="text-[18px] mt-2 ">
                {item?.isCompleted ? (
                  <View className="bg-green-200 p-2 rounded-lg overflow-hidden">
                    <Text className="font-semibold text-green-900 ">✅ Completed</Text>
                  </View>
                ) : (
                  <View className="bg-yellow-200 p-2">
                    <Text className="font-semibold text-yellow-700 rounded-lg overflow-hidden">⏳ Processing</Text>
                  </View>
                )}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScrollView>
  );
}
