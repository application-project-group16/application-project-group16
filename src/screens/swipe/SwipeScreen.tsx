import React, { useEffect, useState, useRef } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, Animated, PanResponder, Dimensions } from 'react-native'
import { db, auth, collection, getDocs, updateDoc, doc, arrayUnion, getDoc, setDoc, storage } from '../../firebase/Config'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { UserProfile } from '../../types/userProfile'

interface SwipeCard extends UserProfile {
  id: string
}

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

const userInterests = ['Jalkapallo', 'Tennis']

const uploadFile = async (uri: string, path: string) => {
  try {
    const response = await fetch(uri)
    const blob = await response.blob()
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, blob)

    uploadTask.on(
      'state_changed',
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      },
      error => console.error(error),
      () => console.log('Upload complete!')
    )
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const SwipeScreen: React.FC = () => {
  const [cards, setCards] = useState<SwipeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  //const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState('Testuser1')


  const position = useRef(new Animated.ValueXY()).current

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
          if (!data || !Array.isArray(data.sports)) return
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

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    const card = cards[currentIndex]
    if (!card || !currentUserId) return

    if (direction === 'right') {
      await updateDoc(doc(db, 'users', currentUserId), {
        likedUsers: arrayUnion(card.id),
      })

      if (card.image) {
        await uploadFile(card.image, `uploads/${currentUserId}/${card.id}.jpg`)
      }

      const likedUserSnap = await getDoc(doc(db, 'users', card.id))
      const likedUserData = likedUserSnap.data() as UserProfile | undefined

      if (likedUserData?.likedUsers?.includes(currentUserId)) {
        await setDoc(doc(collection(db, 'matches')), {
          users: [currentUserId, card.id],
          createdAt: new Date(),
        });
        Alert.alert('You got a new match!')
      }
    }
    position.setValue({ x: 0, y: 0 })
    setCurrentIndex((prev) => prev + 1)
  }

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction))
  }

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

  const renderCards = () => {
    if (currentIndex >= cards.length) {
      return <Text style={styles.noMoreCards}>No more profiles</Text>
    }

    return cards
      .map((card, index) => {
        if (index < currentIndex) return null

        const isCurrentCard = index === currentIndex

        const cardStyle = isCurrentCard
          ? {
              ...position.getLayout(),
              transform: [
                {
                  rotate: position.x.interpolate({
                    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
                    outputRange: ['-30deg', '0deg', '30deg'],
                  }),
                },
              ],
            }
          : {}

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, cardStyle, { zIndex: cards.length - index }]}
            {...(isCurrentCard ? panResponder.panHandlers : {})}
          >
            <Image
              source={{
                 uri: card.image ?? `https://picsum.photos/seed/${card.id}/300`,
              }}
              style={styles.image}
            />
            <Text style={styles.name}>{card.name}</Text>
            <Text style={styles.sports}>{card.sports.join(', ')}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: '90%',
    flex: 0.7,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  sports: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  noMoreCards: {
    fontSize: 20,
    color: '#888',
  },
})