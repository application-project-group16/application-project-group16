import React, { useRef } from 'react'
import { View, Text, StyleSheet, Image, ActivityIndicator, Animated, PanResponder, Dimensions, TextInput, TouchableOpacity, ScrollView, Pressable } from 'react-native'
import { useSwipeViewModel } from './SwipeViewModel'
import { AVAILABLE_SPORTS } from '../../Models/User'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainTabParamList } from '../../Models/navigation'
import type { ViewStyle } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width

const SwipeView = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainTabParamList>>()
  const { 
    cards, loading, currentIndex, positions, indexRef, iconOpacity, cardHeight, imageHeight, selectedSports, 
    setSelectedSports, minAge, setMinAge, maxAge, setMaxAge, hasActiveFilters, forceSwipe, onSwipeComplete
  } = useSwipeViewModel()

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => { positions.current[indexRef.current]?.setValue({ x: g.dx, y: g.dy }) },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SCREEN_WIDTH * 0.25) forceSwipe('right', onSwipeComplete)
        else if (g.dx < -SCREEN_WIDTH * 0.25) forceSwipe('left', onSwipeComplete)
        else Animated.spring(positions.current[indexRef.current], { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start()
      },
    })
  ).current

  const renderCards = () => {
    return cards
      .map((card, i) => {
        if (i < currentIndex) return null
        const pos = positions.current[i]
        if (!pos) return null

        const isTop = i === currentIndex
        const style: Animated.WithAnimatedObject<ViewStyle> = {
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
          zIndex: 100 - i,
        }

        return (
          <Animated.View
            key={card.id}
            style={[styles.card, { height: cardHeight }, style]}
            {...(isTop ? panResponder.panHandlers : {})}
          >
            <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('ProfileView', { userId: card.id })}>
              <Image source={{ uri: card.image?.trim() || `https://picsum.photos/seed/${card.id}/400` }} style={{ width: '100%', height: imageHeight }} />
              <View style={styles.infoContainer}>
                <Text style={styles.nameAge}>{card.name}, {card.age}</Text>
                <Text>{card.sports.join(', ')}</Text>
              </View>
            </Pressable>
          </Animated.View>
        )
      })
      .reverse()
  }

  const swipeX = positions.current[currentIndex]?.x

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </View>

      <View style={styles.cardsContainer}>
        <View style={styles.controlsContainer}>
          <View style={styles.ageContainer}>
            <TextInput 
              placeholder="Min" 
              keyboardType="numeric" 
              style={styles.ageInput} 
              value={minAge?.toString() ?? ''} 
              onChangeText={t => setMinAge(t ? parseInt(t) : null)} 
            />
            <TextInput 
            placeholder="Max" 
            keyboardType="numeric" 
            style={styles.ageInput} 
            value={maxAge?.toString() ?? ''} 
            onChangeText={t => setMaxAge(t ? parseInt(t) : null)} 
          />
          </View>

          {hasActiveFilters && (
            <TouchableOpacity style={styles.resetButton} onPress={() => { setSelectedSports([]); setMinAge(null); setMaxAge(null) }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Reset filters</Text>
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
      </View>

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
    padding: 8, 
    backgroundColor: '#fff', 
    elevation: 2, 
    zIndex: 10, 
  },
  cardsContainer: { 
    flex: 1, 
  },
  controlsContainer: { 
    paddingHorizontal: 8, 
    paddingTop: 8, 
  },
  deckContainer: { 
    flex: 1, 
    position: 'relative', 
    marginTop: 0, 
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
  ageContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 8, 
  },
  ageInput: { 
    flex: 1, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 8, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#ddd', 
  },
  resetButton: { 
    marginTop: 8, 
    padding: 8, 
    backgroundColor: '#ff1a75', 
    borderRadius: 20, 
    alignItems: 'center', 
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
