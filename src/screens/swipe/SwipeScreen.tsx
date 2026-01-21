import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, Animated, PanResponder, Dimensions } from 'react-native'
import { db, auth, collection, getDocs, updateDoc, doc, arrayUnion, getDoc, setDoc, storage } from '../../firebase/Config'
import { UserProfile } from '../../types/userProfile'

import type { Animated as AnimatedType, ViewStyle } from 'react-native'

interface SwipeCard extends UserProfile {
  id: string
}

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7
const CARD_WIDTH = SCREEN_WIDTH * 0.9

const userInterests = ['Jalkapallo', 'Tennis']

const SwipeScreen: React.FC = () => {
  const [cards, setCards] = useState<SwipeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  //const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState('Testuser1')

  const position = useRef(new Animated.ValueXY()).current

  useEffect(() => {
    position.setValue({ x: 0, y: 0 })
  }, [currentIndex])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
      setCurrentUserId(user.uid)
    } else {
      setCurrentUserId(null)
      setLoading(false) 
    }
  })
  return () => unsubscribe()
}, [])

  useEffect(() => {
    if (!currentUserId) return

    const fetchProfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const profiles: SwipeCard[] = []

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as UserProfile | undefined
          if (!data || !Array.isArray(data.sports) || typeof data.age !== 'number') return
          //console.log(docSnap.id, 'sports:', data.sports, typeof data.sports);

          if (docSnap.id !== currentUserId && data.sports.some((sport) => userInterests.includes(sport))) {
           //console.log('Included:', docSnap.id);
            profiles.push({ id: docSnap.id, ...data })
            //} else {
            //console.log('Skipped:', docSnap.id);
          }
        })

        setCards(profiles)
      } catch (error) {
        console.error('Firebase fetchProfiles failed:', error)
        Alert.alert('Error loading profiles', 'Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [currentUserId])

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left')
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current

  const forceSwipe = (direction: 'right' | 'left') => {
  const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5
  const y = 0;
  
  Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction))
  }

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    const card = cards[currentIndex]
    if (!card || !currentUserId) return

    if (direction === 'right') {
      console.log('Swiping right:', { currentUserId, cardId: card.id })
    try {
      await updateDoc(doc(db, 'users', currentUserId), {
        likedUsers: arrayUnion(card.id),
      })
      console.log('Update sent')

    const likedUserSnap = await getDoc(doc(db, 'users', card.id))
    const likedUserData = likedUserSnap.data() as UserProfile | undefined

    if (likedUserData?.likedUsers?.includes(currentUserId)) {
      await setDoc(doc(collection(db, 'matches')), {
        users: [currentUserId, card.id],
        createdAt: new Date(),
      })
        Alert.alert('You got a new match!')
      }
    } catch (err) {
      console.error('Error updating likedUsers or matches:', err)
    }
  }
      setCurrentIndex(prev => prev + 1)
      position.setValue({ x: 0, y: 0 })
    }

    const renderCards = () => {
      if (currentIndex >= cards.length) {
        return (
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreCards}>No more profiles</Text>
          </View>
        )
      }

      return cards
    .map((card, index) => {
      if (index < currentIndex) return null;

      const isTop = index === currentIndex;

      const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        outputRange: ['-30deg', '0deg', '30deg'],
      });

      const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = isTop
        ? {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate },
            ],
          }
        : {};

      return (
        <Animated.View
          key={card.id} // stable key
          {...(isTop ? panResponder.panHandlers : {})}
          style={[styles.card, animatedStyle, { zIndex: cards.length - index }]}
        >
          <Image
            source={{ uri: card.image ?? `https://picsum.photos/seed/${card.id}/300` }}
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

  if (loading) {
    return <ActivityIndicator size='large' style={{ flex: 1 }} />
  }

  return <View style={styles.container}>{renderCards()}</View>
}

export default SwipeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
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
})