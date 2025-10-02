import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router';

const Analytics = () => {
    const navigation=useNavigation();
  return (
    <View className='flex-1'>
      <Text>Analytics</Text>
         {/* ChatBot */}
            <Pressable
              onPress={()=>navigation.navigate("ChatBot")} // 👈 Navigate to ChatBot screen
              className="absolute bottom-6 right-4 z-50 bg-[#B3DAFF] border  border-gray-400 rounded-2xl p-2 shadow-lg"
            >
              <Image
                className="h-16 w-16"
                source={require("../assets/chatBot.png")}
              />
            </Pressable>
    </View>
  )
}

export default Analytics;

const styles = StyleSheet.create({})