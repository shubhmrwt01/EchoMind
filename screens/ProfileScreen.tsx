import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@clerk/clerk-expo';
export default function ProfileScreen() {
  const {signOut}=useAuth();
  return (
    <SafeAreaView>
      <Pressable onPress={()=>{
        signOut();
        return;
      }} className='flex-row gap-4 mt-4'>
        <Ionicons name="exit" size={24} color="black" />
        <Text>Logout</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})