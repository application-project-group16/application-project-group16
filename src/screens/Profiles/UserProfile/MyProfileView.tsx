import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainTabParamList } from '../../../Models/navigation'
import { useMyProfileViewModel } from './MyProfileViewModel'

const SCREEN_WIDTH = Dimensions.get('window').width
const IMAGE_SIZE = SCREEN_WIDTH * 0.6

export default function MyProfileView() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainTabParamList>>()

  const { user, authLoading, loading, profile } = useMyProfileViewModel()

  if (authLoading || loading)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />

  if (!user)
    return (
      <View style={styles.center}>
        <Text>Please log in</Text>
      </View>
    )

  if (!profile)
    return (
      <View style={styles.center}>
        <Text>No profile found</Text>
      </View>
    )

  const sportsList = Array.isArray(profile.sports) ? profile.sports : []

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.settings}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings-outline" size={26} color="#000" />
      </TouchableOpacity>

      <Image
        source={{
          uri:
            profile.image && profile.image.trim() !== ''
              ? profile.image
              : `https://picsum.photos/seed/${user.uid}/300`,
        }}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        {[profile.name, profile.age].filter(Boolean).join(', ')}
      </Text>

      {profile.city && <Text style={styles.city}>{profile.city}</Text>}
      {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      {sportsList.length > 0 && (
        <View style={styles.sports}>
          {sportsList.map((s: string) => (
            <View key={s} style={styles.chip}>
              <Text style={styles.chipText}>{s}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  settings: {
    position: 'absolute',
    top: 12,
    right: 50, 
    zIndex: 10,
  },
  avatar: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginTop: 32,
    marginBottom: 24,
    backgroundColor: '#eee',
  },
  name: { 
    fontSize: 24, 
    fontWeight: '700', 
  },
  city: { 
    color: '#000',
    marginBottom: 12, 
  },
  bio: { 
    textAlign: 'center', 
    marginBottom: 16, 
    paddingHorizontal: 8, 
  },
  sports: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    justifyContent: 'center', 
  },
  chip: { 
    backgroundColor: '#eee', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16,
  },
  chipText: { 
    color: '#000', 
    fontWeight: '500', 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
})
