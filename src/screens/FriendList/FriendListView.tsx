
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useFriendListViewModel } from './FriendListViewModel'

type props = {
  onSelectFriend: (friendId: string) => void
}

const FriendListScreen = ({ onSelectFriend }: props) => {
  const { friends } = useFriendListViewModel()
 
  const sortedFriends = [...friends].sort((a, b) => {
    if (a.lastMessageTime && b.lastMessageTime) {
      return b.lastMessageTime.seconds - a.lastMessageTime.seconds;
    }
    return 0;
  });

 return (
  <View style = {styles.container}>
    <FlatList
      data={sortedFriends}
      keyExtractor={(friend, index) => friend.uid ?? `friend-${index}`}
      contentContainerStyle={styles.list}
      renderItem={({ item: friend }) => (
        <TouchableOpacity style={[styles.card, friend.unreadCount && friend.unreadCount > 0 ? styles.unreadGlow : null]} activeOpacity={0.8} onPress={() => onSelectFriend(friend.uid)}>
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
        {friend.unreadCount > 0 && (
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{friend.unreadCount}</Text>
        </View>
    )}
        </TouchableOpacity>
        
      )}
    />
  </View>

  )
}

export default FriendListScreen

const styles = StyleSheet.create({
  
    container: { 
      flex: 1, 
      backgroundColor: '#f0f0f0' 
    },

    list: {
      padding: 16 
    },
    
    card: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 16, 
      backgroundColor: '#fff', 
      borderRadius: 8, 
      padding: 12, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 4, 
      elevation: 2 
    },

    avatar: { 
      width: 55, 
      height: 55, 
      borderRadius: 27.5, 
    },

    info: { 
      marginLeft: 12 
    },

    name: { 
      fontSize: 18, 
      fontWeight: 'bold' 
    },

    sports: { 
      fontSize: 14, 
      color: '#666', 
      marginTop: 4 
    },
    
    badge: { 
      backgroundColor: '#e74c3c', 
      borderRadius: 10, 
      width: 20, 
      height: 20, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginLeft: 'auto' 
    },

    badgeText: { 
      color: '#fff', 
      fontSize: 12, 
      fontWeight: 'bold' 
    },
    unreadGlow: {
      borderColor: '#2b7cff',
      borderWidth: 2,
      shadowColor: '#2b7cff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
})

