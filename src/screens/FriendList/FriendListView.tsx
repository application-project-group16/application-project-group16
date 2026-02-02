
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useFriendListViewModel } from './FriendListViewModel'

const FriendListScreen = () => {
  const { friends } = useFriendListViewModel()


 return (
  <View style = {styles.container}>
    <FlatList
      data={friends}
      keyExtractor={(friend, index) => friend.uid ? friend.uid : `friend-${index}`}
      contentContainerStyle={styles.list}
      renderItem={({ item: friend }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <Image
            source={
              friend.image && friend.image.trim().length > 0
                ? { uri: friend.image }
                : require('../../assets/favicon.png')
            }
            style={styles.avatar}
          />
        <View style={styles.info}>
          <Text style={styles.name}>{friend.name}</Text>
          {friend.sports?.length ? (
          <Text style={styles.sports} numberOfLines={1}>{friend.sports.join(', ')}</Text> 
          ) : null}
        </View>
        </TouchableOpacity>
      )}
    />
  </View>

  )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    list: { padding: 16 },
    card: { 
    flexDirection: 'row', alignItems: 'center', 
    marginBottom: 16, backgroundColor: '#fff', 
    borderRadius: 8, padding: 12, shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, 
    shadowRadius: 4, elevation: 2 
    },
    avatar: { width: 55, height: 55, borderRadius: 27.5, },
    info: { marginLeft: 12 },
    name: { fontSize: 18, fontWeight: 'bold' },
    sports: { fontSize: 14, color: '#666', marginTop: 4 },
})

export default FriendListScreen