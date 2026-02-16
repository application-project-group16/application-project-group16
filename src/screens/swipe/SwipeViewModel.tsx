import { useEffect, useRef, useState } from 'react'
import { db, collection, getDocs, updateDoc, doc, arrayUnion, getDoc, setDoc } from '../../firebase/Config'
import { User } from '../../Models/User'
import { useAuth } from '../../context/AuthContext'
import { Dimensions, Animated } from 'react-native'
import { Timestamp } from 'firebase/firestore'
import { FINLAND_CITIES } from '../../Models/User'

export interface SwipeCard extends User {
  id: string
}

const SCREEN_WIDTH = Dimensions.get('window').width

export const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25
export const SWIPE_OUT_DURATION = 250
export const CARD_WIDTH = SCREEN_WIDTH * 0.9

export const useSwipeViewModel = () => {
  const { user } = useAuth()
  const currentUserId = user?.uid ?? null

  const [allCards, setAllCards] = useState<SwipeCard[]>([])
  const [cards, setCards] = useState<SwipeCard[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipedUsers, setSwipedUsers] = useState<string[]>([])

  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const [minAge, setMinAge] = useState<number | null>(null)
  const [maxAge, setMaxAge] = useState<number | null>(null)

  const positions = useRef<Animated.ValueXY[]>([])
  const cardsRef = useRef<SwipeCard[]>([])
  const indexRef = useRef(0)
  const iconOpacity = useRef(new Animated.Value(1)).current

  const hasActiveFilters =
    selectedSports.length > 0 ||
    minAge !== null ||
    maxAge !== null ||
    selectedGender !== null ||
    selectedCity !== null

  useEffect(() => { cardsRef.current = cards }, [cards])
  useEffect(() => { indexRef.current = currentIndex; iconOpacity.setValue(1) }, [currentIndex])

  useEffect(() => {
    if (!currentUserId) return

    const fetchProfiles = async () => {
      if (!currentUserId) return
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, 'users'))
        const currentUserSnap = await getDoc(doc(db, 'users', currentUserId))
        const currentUserData = currentUserSnap.data() as User | undefined
        const likedUsers = currentUserData?.likedUsers || []

        const profiles: SwipeCard[] = []
        snap.forEach(docSnap => {
          const data = docSnap.data() as User
          if (!data || !Array.isArray(data.sports) || docSnap.id === currentUserId) return
          if (likedUsers.includes(docSnap.id)) return
          profiles.push({ id: docSnap.id, ...data })
        })

        setAllCards(profiles)
        setCards(profiles)
        positions.current = profiles.map(() => new Animated.ValueXY())
        setCurrentIndex(0)
      } catch (err) {
        console.error(err)
        alert('Error loading profiles')
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [currentUserId])

  useEffect(() => {
    const filtered = allCards
      .filter(card => {
        const sportOk = selectedSports.length === 0 || card.sports.some(s => selectedSports.includes(s))
        const minOk = minAge === null || card.age >= minAge
        const maxOk = maxAge === null || card.age <= maxAge
        const genderOk = !selectedGender || card.gender === selectedGender
        const cityOk = !selectedCity || card.city === selectedCity
        return sportOk && minOk && maxOk && genderOk && cityOk
      })
      .filter(card => !swipedUsers.includes(card.id))

    setCards(filtered)
    positions.current = filtered.map(() => new Animated.ValueXY())
    setCurrentIndex(0)
  }, [selectedSports, minAge, maxAge, selectedGender, selectedCity, allCards, swipedUsers])

  const forceSwipe = (direction: 'left' | 'right', onSwipeComplete: (direction: 'left' | 'right', idx: number) => void) => {
    const idx = indexRef.current
    const pos = positions.current[idx]
    if (!pos) return

    const x = direction === 'right'
      ? SCREEN_WIDTH * 1.5
      : -SCREEN_WIDTH * 1.5

    Animated.timing(pos, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      onSwipeComplete(direction, idx)
    })
  }

  const onSwipeComplete = async (direction: 'left' | 'right', idx: number) => {
    const card = cardsRef.current[idx]
    if (!card || !currentUserId) return

    setCurrentIndex(prev => prev + 1)
    setSwipedUsers(prev => [...prev, card.id])

    if (direction === 'right') {
      const currentUserRef = doc(db, 'users', currentUserId)
      await updateDoc(currentUserRef, { likedUsers: arrayUnion(card.id) })

      const swipedUserRef = doc(db, 'users', card.id)
      const swipedUserSnap = await getDoc(swipedUserRef)
      const swipedUserData = swipedUserSnap.data() as User | undefined

      if (swipedUserData?.likedUsers?.includes(currentUserId)) {
        alert('You got a new match!')
        const matchId = [currentUserId, card.id].sort().join('_')
        await setDoc(doc(db, 'matches', matchId), { users: [currentUserId, card.id], timestamp: Timestamp.now() })
      }
    }
  }

  const finlandCities = FINLAND_CITIES

  return {
    currentUserId,
    allCards,
    cards,
    loading,
    currentIndex,
    swipedUsers,
    selectedSports,
    setSelectedSports,
    selectedGender,
    setSelectedGender,
    selectedCity,
    setSelectedCity,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    positions,
    indexRef,
    iconOpacity,
    hasActiveFilters,
    forceSwipe,
    onSwipeComplete,
    finlandCities,
  }
}

