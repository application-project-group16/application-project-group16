import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, Animated, PanResponder, Dimensions, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { db, collection, getDocs, updateDoc, doc, arrayUnion, getDoc, setDoc } from '../../firebase/Config'
import { UserProfile, AVAILABLE_SPORTS } from '../../Models/User'
import type { ViewStyle } from 'react-native'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'

const availableSports = AVAILABLE_SPORTS;

interface SwipeCard extends UserProfile { id: string }

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250
const CARD_HEIGHT = SCREEN_HEIGHT * 0.70
const CARD_WIDTH = SCREEN_WIDTH * 0.90

const SwipeScreen: React.FC = () => {
  const { user } = useAuth()
  const currentUserId = user?.uid ?? null

  const [cards, setCards] = useState<SwipeCard[]>([])
  const [allCards, setAllCards] = useState<SwipeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [minAge, setMinAge] = useState<number | null>(null)
  const [maxAge, setMaxAge] = useState<number | null>(null)

  const positions = useRef<Animated.ValueXY[]>([])
  const topCardIndex = useRef(0)
  const cardsRef = useRef<SwipeCard[]>([])
  const iconOpacity = useRef(new Animated.Value(1)).current
  
  useEffect(() => {
    cardsRef.current = cards
  }, [cards])

  useEffect(() => {
    iconOpacity.setValue(1)
  }, [currentIndex])

  useEffect(() => {
    if (!currentUserId) return

    let initialized = false
    const q = query(
      collection(db, 'matches'),
      where('users', 'array-contains', currentUserId)
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      if (!initialized) {
        initialized = true
        return
      }
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          Alert.alert('You have a new match!')
        }
      })
    })
    return () => unsubscribe()
  }, [currentUserId])

  const canSwipe =
    cards.length > 0 &&
    currentIndex < cards.length &&
    positions.current[currentIndex]

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const idx = topCardIndex.current
        const pos = positions.current[idx]
        const topCard = cardsRef.current[idx]

        if (!pos || !topCard) return
        pos.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (_, gesture) => {
        const idx = topCardIndex.current
        const pos = positions.current[idx]
        const topCard = cardsRef.current[idx]

        if (!pos || !topCard) return
        if (gesture.dx > SWIPE_THRESHOLD) forceSwipe('right')
        else if (gesture.dx < -SWIPE_THRESHOLD) forceSwipe('left')
        else {
          Animated.spring(pos, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current
  
  useEffect(() => {
  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const snapshot = await getDocs(collection(db, 'users'))
      const profiles: SwipeCard[] = []

      snapshot.forEach(docSnap => {
        const data = docSnap.data() as UserProfile | undefined
        if (!data || !Array.isArray(data.sports) || docSnap.id === currentUserId) return
        profiles.push({ id: docSnap.id, ...data })
      })

        setAllCards(profiles)
        setCards(profiles)
        positions.current = profiles.map(() => new Animated.ValueXY())
        topCardIndex.current = 0
        setCurrentIndex(0)
      } catch (err) {
        console.error(err)
        Alert.alert('Error loading profiles')
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [currentUserId])

  useEffect(() => {
    const filtered = allCards.filter(card => {
      const matchesSport = selectedSports.length === 0 || card.sports.some(s => selectedSports.includes(s))
      const matchesMinAge = minAge === null || card.age >= minAge
      const matchesMaxAge = maxAge === null || card.age <= maxAge
      return matchesSport && matchesMinAge && matchesMaxAge
    })
    setCards(filtered)
    positions.current = filtered.map(() => new Animated.ValueXY())
    topCardIndex.current = 0
    setCurrentIndex(0)
  }, [selectedSports, minAge, maxAge, allCards])

  const forceSwipe = (direction: 'right' | 'left') => {
    const idx = topCardIndex.current
    const pos = positions.current[idx]
    const topCard = cardsRef.current[idx]
    if (!pos || !topCard) return

  const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5

  Animated.timing(pos, {
    toValue: { x, y: 0 },
    duration: SWIPE_OUT_DURATION,
    useNativeDriver: false,
  }).start(() => {
    topCardIndex.current += 1
    setCurrentIndex(topCardIndex.current)
    onSwipeComplete(direction, idx)
  })
}

const onSwipeComplete = async (direction: 'right' | 'left', idx: number) => {
  const card = cardsRef.current[idx]
  if (!card) return

  if (direction === 'right') {
    try {
      await updateDoc(doc(db, 'users', currentUserId), { likedUsers: arrayUnion(card.id) })
      const likedUserSnap = await getDoc(doc(db, 'users', card.id))
      const likedUserData = likedUserSnap.data() as UserProfile | undefined
      if (likedUserData?.likedUsers?.includes(currentUserId)) {
        await setDoc(doc(collection(db, 'matches')), { users: [currentUserId, card.id]})
        Alert.alert('You got a new match!')
      }
    } catch (err) { console.error(err) }
  }
}

  const renderCards = () => { 
  if (cards.length === 0) return <Text>No profiles found</Text>

  return cards
    .map((card, index) => {
      if (index < currentIndex) return null 

      const pos = positions.current[index]
      if (!pos) return null

      const isTop = index === currentIndex
      const animatedStyle = {
        transform: isTop
          ? [
              { translateX: pos.x },
              { translateY: pos.y },
              {
                rotate: pos.x.interpolate({
                  inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                  outputRange: ['-30deg', '0deg', '30deg'],
                }),
              },
            ]
          : [
              { scale: 0.95 - (index - currentIndex) * 0.02 },
              { translateY: (index - currentIndex) * 10 },
            ],
        opacity: isTop ? 1 : 0.8,
        zIndex: 100 - index,
      } as Animated.WithAnimatedObject<ViewStyle>

      return (
        <Animated.View
          key={card.id}
          style={[styles.card, animatedStyle]}
          pointerEvents={isTop ? 'auto' : 'none'}
          {...(isTop && canSwipe ? panResponder.panHandlers : {})}
        >
          <Image
            source={{ 
              uri: card.image && card.image.trim() 
                ? card.image 
                : `https://picsum.photos/seed/${card.id}/300` 
            }}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nameAge}>{card.name}, {card.age}</Text>
            <Text style={styles.sports}>{card.sports.join(', ')}</Text>
          </View>
        </Animated.View>
      )
    })
    .reverse()
  }

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />

  if (!currentUserId) {
    return (
      <View style={styles.center}>
        <Text>Please log in to use Swipe</Text>
      </View>
    )
  }

  const swipeX =
    positions.current[currentIndex] &&
    positions.current[currentIndex].x

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          {availableSports.map(sport => (
            <TouchableOpacity
              key={sport}
              style={[styles.chip, selectedSports.includes(sport) && styles.selectedChip]}
              onPress={() => {
                if (selectedSports.includes(sport)) {
                  setSelectedSports(selectedSports.filter(s => s !== sport))
                } else {
                  setSelectedSports([...selectedSports, sport])
                }
              }}
            >
              <Text style={styles.chipText}>{sport}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.ageContainer}>
          <TextInput
            placeholder="Min Age"
            keyboardType="numeric"
            style={styles.ageInput}
            value={minAge?.toString() ?? ''}
            onChangeText={text => setMinAge(text ? parseInt(text) : null)}
          />
          <TextInput
            placeholder="Max Age"
            keyboardType="numeric"
            style={styles.ageInput}
            value={maxAge?.toString() ?? ''}
            onChangeText={text => setMaxAge(text ? parseInt(text) : null)}
          />
        </View>
        {cards.length === 0 && (
          <TouchableOpacity style={styles.resetButton} onPress={() => {
            setMinAge(null)
            setMaxAge(null)
            setSelectedSports([])
          }}>
            <Text style={styles.resetText}>Reset filters</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardsContainer}>
        {cards.length === 0 ? (
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreCards}>No profiles match current filters</Text>
          </View>
        ) : currentIndex >= cards.length ? (
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreCards}>No more profiles</Text>
          </View>
        ) : (
          renderCards()
        )}
      </View>

      {swipeX && (
        <>
          <Animated.Text
            style={[
              styles.leftIcon,
              {
                opacity: Animated.multiply(
                  iconOpacity,
                  swipeX.interpolate({
                    inputRange: [-SCREEN_WIDTH * 0.5, -SWIPE_THRESHOLD, 0],
                    outputRange: [1, 0.6, 0],
                    extrapolate: 'clamp',
                  })
                ),
              },
            ]}
          >
            ❌
          </Animated.Text>

          <Animated.Text
            style={[
              styles.rightIcon,
              {
                opacity: Animated.multiply(
                  iconOpacity,
                  swipeX.interpolate({
                    inputRange: [0, SWIPE_THRESHOLD, SCREEN_WIDTH * 0.5],
                    outputRange: [0, 0.6, 1],
                    extrapolate: 'clamp',
                  })
                )
              }
            ]}
          >
            ❤️
          </Animated.Text>
        </>
      )}
    </View>
  )
}

export default SwipeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  filterContainer: {
    padding: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardsContainer: { 
    flex: 1, 
    marginTop: 15, 
    zIndex: 0, 
    pointerEvents: 'box-none', 
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '75%',
  },
  nameAge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  sports: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  leftIcon: {
    position: 'absolute',
    top: '45%',
    left: 8,
    fontSize: 40,
    zIndex: 2000,
  },
  rightIcon: {
    position: 'absolute',
    top: '45%',
    right: 8,
    fontSize: 40,
    zIndex: 2000,
  },
  chipsContainer: {
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ddd', 
    borderRadius: 20, 
    marginRight: 8, 
  },
  selectedChip: { 
    backgroundColor: '#ff1a75', 
  },
  chipText: { 
    color: '#000', 
  },
  ageContainer: { 
    flexDirection: 'row', 
    gap: 8, 
  },
  ageInput: { 
    flex: 1, 
    backgroundColor: '#eee', 
    borderRadius: 8, 
    padding: 8, 
    fontSize: 16, 
  },
  resetButton: { 
    marginTop:8, 
    padding:8, 
    backgroundColor:'#ff1a75', 
    borderRadius:8, 
    alignItems:'center', 
  },
  resetText: { 
    color:'#fff', 
    fontWeight:'700', 
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCards: {
    fontSize: 20,
    color: '#888',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(240, 240, 240, 0.7)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})