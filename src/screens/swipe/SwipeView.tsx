import React, { useRef, useState } from 'react'
import { useSwipeViewModel } from './SwipeViewModel'
import { AVAILABLE_SPORTS } from '../../Models/User'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainTabParamList } from '../../Models/navigation'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { 
  View, Text, StyleSheet, Image, ActivityIndicator, Animated, PanResponder, 
  Dimensions, TextInput, TouchableOpacity, ScrollView, Pressable, Modal
} from 'react-native'

const FILTER_PANEL_HEIGHT = 160;
const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const DECK_HEIGHT = SCREEN_HEIGHT - FILTER_PANEL_HEIGHT
const CARD_HEIGHT = DECK_HEIGHT * 0.780
const IMAGE_HEIGHT = CARD_HEIGHT * 0.825

const SwipeView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>()

  const { cards, loading, currentIndex, positions, indexRef, selectedSports, setSelectedSports, 
    selectedGender, setSelectedGender, selectedCity, setSelectedCity, minAge, setMinAge, maxAge, 
    setMaxAge, hasActiveFilters, forceSwipe, onSwipeComplete, finlandCities, iconOpacity
  } = useSwipeViewModel()

  const genderRef = useRef<View>(null)
  const cityRef = useRef<View>(null)

  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0 })

  const openDropdown = (
    ref: React.RefObject<View>,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!ref.current) return

    ref.current.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y: y + height, width })
      setVisible(true)
    })
  }

  const resetFilters = () => {
    setSelectedSports([])
    setSelectedGender(null)
    setSelectedCity(null)
    setMinAge(null)
    setMaxAge(null)
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !showCityDropdown && !showGenderDropdown,
      onMoveShouldSetPanResponder: () => !showCityDropdown && !showGenderDropdown,
      onPanResponderMove: (_, g) => {
        if (!showCityDropdown && !showGenderDropdown) {
          positions.current[indexRef.current]?.setValue({ x: g.dx, y: g.dy })
        }
      },
      onPanResponderRelease: (_, g) => {
        if (!showCityDropdown && !showGenderDropdown) {
          if (g.dx > SCREEN_WIDTH * 0.25) forceSwipe('right', onSwipeComplete)
          else if (g.dx < -SCREEN_WIDTH * 0.25) forceSwipe('left', onSwipeComplete)
          else Animated.spring(positions.current[indexRef.current], { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
        }
      },
    })
  ).current

  const renderCards = () =>
    cards
      .map((card, i) => {
        if (i < currentIndex) return null
        const pos = positions.current[i]
        if (!pos) return null

        const isTop = i === currentIndex
        const style: Animated.WithAnimatedObject<any> = {
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
              { scale: 0.95 - (i - currentIndex) * 0.02 },
              { translateY: (i - currentIndex) * 12 },
            ],
          zIndex: 10 - i,
        }

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, { height: CARD_HEIGHT }, style]}
            {...(isTop ? panResponder.panHandlers : {})}
          >
            <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('ProfileView', { userId: card.id })}>
              <Image
                source={{ uri: card.image?.trim() || `https://picsum.photos/seed/${card.id}/400` }}
                style={{ width: '100%', height: IMAGE_HEIGHT }}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.nameAge}>{card.name}, {card.age}</Text>
                <Text>{card.sports.join(', ')}</Text>
              </View>
            </Pressable>
          </Animated.View>
        )
      })
      .reverse()

  const swipeX = positions.current[currentIndex]?.x

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {AVAILABLE_SPORTS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, selectedSports.includes(s) && styles.selectedChip]}
              onPress={() => setSelectedSports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
            >
              <Text>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.genderCityContainer}>
          <View ref={genderRef} style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => { setShowCityDropdown(false); openDropdown(genderRef, setShowGenderDropdown); }}
            >
              <Text style={[styles.dropdownInput, { color: selectedGender ? '#333' : '#aaa' }]}>{selectedGender || 'Gender'}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <View ref={cityRef} style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => { setShowGenderDropdown(false); openDropdown(cityRef, setShowCityDropdown); }}
            >
              <Text style={[styles.dropdownInput, { color: selectedCity ? '#333' : '#aaa' }]}>{selectedCity || 'City'}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ageContainer}>
          <TextInput
            placeholder="Min age"
            keyboardType="numeric"
            style={styles.ageInput}
            value={minAge?.toString() ?? ''}
            onChangeText={t => setMinAge(t ? parseInt(t) : null)}
          />
          <TextInput
            placeholder="Max age"
            keyboardType="numeric"
            style={styles.ageInput}
            value={maxAge?.toString() ?? ''}
            onChangeText={t => setMaxAge(t ? parseInt(t) : null)}
          />
        </View>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>Reset filters</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.deckContainer}>
        {cards.length === 0 ? (
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreCards}>{hasActiveFilters ? 'No profiles match current filters' : 'No more profiles'}</Text>
          </View>
        ) : currentIndex >= cards.length ? (
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreCards}>No more profiles</Text>
          </View>
        ) : (
          renderCards()
        )}
      </View>
    
      {showGenderDropdown && (
        <Modal transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowGenderDropdown(false)}>
            <View style={[styles.modalDropdown, { top: dropdownLayout.y, left: dropdownLayout.x, width: dropdownLayout.width }]}>
              {['Male', 'Female', 'Other'].map(g => (
                <TouchableOpacity key={g} style={styles.dropdownOption} onPress={() => { setSelectedGender(g); setShowGenderDropdown(false); }}>
                  <Text style={styles.dropdownOptionText}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}

      {showCityDropdown && (
        <Modal transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setShowCityDropdown(false)}>
            <View style={[styles.modalDropdown, { top: dropdownLayout.y, left: dropdownLayout.x, width: dropdownLayout.width }]}>
              <ScrollView keyboardShouldPersistTaps="handled">
                {finlandCities.map(c => (
                  <TouchableOpacity key={c} style={styles.dropdownOption} onPress={() => { setSelectedCity(c); setShowCityDropdown(false); }}>
                    <Text style={styles.dropdownOptionText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}

      {swipeX && (
        <>
          <Animated.Text 
            style={[styles.leftIcon, { 
              opacity: Animated.multiply(iconOpacity, swipeX.interpolate
                ({ 
                  inputRange: [-SCREEN_WIDTH * 0.5, -SCREEN_WIDTH * 0.25, 0], 
                  outputRange: [1, 0.6, 0], 
                  extrapolate: 'clamp' 
                })) 
            }]}
          >❌</Animated.Text>

          <Animated.Text 
            style={[styles.rightIcon, { 
              opacity: Animated.multiply(iconOpacity, swipeX.interpolate
              ({ 
                inputRange: [0, SCREEN_WIDTH * 0.25, SCREEN_WIDTH * 0.5], 
                outputRange: [0, 0.6, 1], 
                extrapolate: 'clamp' 
              })) 
            }]}
          >❤️</Animated.Text>
        </>
      )}
    </View>
  )
}

export default SwipeView

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f2f2f2', 
  },
  filterContainer: {
    padding: 4,
    backgroundColor: '#fff',
    elevation: 10,
  },
  chipScroll: {
    marginBottom: 8,
  },
  deckContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  card: { 
    position: 'absolute', 
    width: SCREEN_WIDTH * 0.9, 
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
  leftIcon: { 
    position: 'absolute', 
    top: '45%', 
    left: 5, 
    fontSize: 40, 
    zIndex: 2000, 
  },
  rightIcon: { 
    position: 'absolute', 
    top: '45%', 
    right: 5, 
    fontSize: 40, 
    zIndex: 2000, 
  },
  infoContainer: { 
    position: 'absolute',
    bottom: 0, 
    width: '100%', 
    padding: 16, 
    backgroundColor: 'rgba(240,240,240,0.7)', 
  },
  nameAge: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#000', 
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
  genderCityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dropdownContainer: { 
    flex: 1, 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    backgroundColor: '#fafafa', 
    paddingVertical: 10, 
  },
  dropdownInput: { 
    flex: 1, 
    fontSize: 16, 
  },
  ageContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 3, 
  },
  ageInput: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 8, 
    borderWidth: 1, 
    borderColor: '#ddd', 
  },
  dropdownOption: { 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
  },
  dropdownOptionText: { 
    fontSize: 16, 
  },
  modalOverlay: { 
    flex: 1, 
  },
  modalDropdown: { 
    position: 'absolute', 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    maxHeight: 300, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    elevation: 20, 
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ff1a75',
    borderRadius: 20,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '700',
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
})
