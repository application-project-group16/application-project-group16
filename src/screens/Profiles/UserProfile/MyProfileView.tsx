import React from 'react'
import {View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainTabParamList } from '../../../Models/navigation'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../../../Models/Gradient'
import { useMyProfileViewModel } from './MyProfileViewModel'

const IMAGE_HEIGHT = 370

export default function MyProfileView() {
  const navigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>()
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['top']}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color={colors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings-outline" size={26} color={colors.white} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                profile.image && profile.image.trim() !== ''
                  ? profile.image
                  : `https://picsum.photos/seed/${user.uid}/600`,
            }}
            style={styles.image}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.name}>
              {[profile.name, profile.age].filter(Boolean).join(', ')}
            </Text>

            {profile.city && (
              <View style={styles.locationRow}>
                <Ionicons
                  name="location-sharp"
                  size={16}
                  color={colors.secondary}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.city}>{profile.city}</Text>
              </View>
            )}

            {profile.gender && (
              <View style={styles.genderRow}>
                <Ionicons
                  name={
                    profile.gender === 'Male' ? 'male' :
                      profile.gender === 'Female' ? 'female' :
                        'male-female'
                  }
                  size={16}
                  color={colors.secondary}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.genderText}>{profile.gender}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {profile.bio && (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{profile.bio}</Text>
            </>
          )}

          {sportsList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Sports</Text>
              <View style={styles.sports}>
                {sportsList.map((s: string) => (
                  <View key={s} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primary,
    marginBottom: 20,
    opacity: 0.6,
  },
  name: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  city: {
    fontSize: 15,
    color: colors.lightText,
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  genderText: {
    fontSize: 15,
    color: colors.lightText,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.white,
    padding: 24,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 20,
  },
  sports: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 8,
    marginBottom: 10,
  },
  chipText: {
    fontWeight: '600',
    color: colors.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 1000,
    padding: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 8,
    zIndex: 1000,
    padding: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
})
