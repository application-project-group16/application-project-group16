import React from 'react'
import { View,  Text,  StyleSheet,  Image,  ScrollView,  ActivityIndicator,  Dimensions } from 'react-native'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useSwipeProfileViewModel } from './SwipeProfileViewModel'
import { MainTabParamList } from '../../../Models/navigation'

const SCREEN_WIDTH = Dimensions.get('window').width
const IMAGE_SIZE = SCREEN_WIDTH * 0.6

type ProfileViewRouteProp = RouteProp<MainTabParamList, 'ProfileView'>

export default function ProfileView() {
    const route = useRoute<ProfileViewRouteProp>()
    const { userId } = route.params
    const { loading, profile } = useSwipeProfileViewModel(userId)

  if (loading)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />

  if (!profile)
    return (
      <View style={styles.center}>
        <Text>No profile found</Text>
      </View>
    )

  const sportsList = Array.isArray(profile.sports) ? profile.sports : []

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri:
            profile.image && profile.image.trim() !== ''
              ? profile.image
              : `https://picsum.photos/seed/${userId}/300`,
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
    marginBottom: 12 
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
