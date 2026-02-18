
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ListRenderItem } from 'react-native'
import { useFriendListViewModel } from './FriendListViewModel'
import { gradients } from '../../Models/Gradient'
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useCallback, memo } from 'react';
import { Friend } from './FriendListViewModel';

type props = {
  onSelectFriend: (friendId: string) => void
}

const FriendCard = memo(({ friend, onPress }: { friend: Friend; onPress: (uid: string) => void }) => {
  const isUnread = friend.unreadCount && friend.unreadCount > 0;
  const unreadNameStyle = isUnread ? styles.unreadName : styles.name;
  
  return (
    <TouchableOpacity 
      style={[styles.card, isUnread ? styles.unreadGlow : null]}
      activeOpacity={0.8} 
      onPress={() => onPress(friend.uid)}
    >
      <Image
        source={
          friend.image && friend.image.trim().length > 0
            ? { uri: friend.image }
            : require('../../assets/favicon.png')
        }
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text 
          style={unreadNameStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          {friend.name}
        </Text>
        {friend.sports?.length ? (
          <Text style={styles.sports} numberOfLines={1}>{friend.sports.join(', ')}</Text> 
        ) : null}
      </View>

      <Ionicons 
        name={isUnread ? "chatbubbles" : "chatbubbles-outline"}
        size={20} 
        color="#2b7cff" 
        style={styles.chatIcon} 
      />
      <Ionicons
        name="chevron-forward"
        size={22}
        color="#999"
      />
    </TouchableOpacity>
  );
});

const FriendListScreen = ({ onSelectFriend }: props) => {
  const { friends } = useFriendListViewModel()
 
  const sortedFriends = useMemo(() => {
    return [...friends].sort((a, b) => {

      const aTime = a.lastMessageTime?.seconds ?? 0;
      const bTime = b.lastMessageTime?.seconds ?? 0;
      return bTime - aTime;
    });
  }, [friends]);

  const handleSelectFriend = useCallback((friendId: string) => {
    onSelectFriend(friendId);
  }, [onSelectFriend]);

  const renderFriendItem: ListRenderItem<Friend> = useCallback(({ item: friend }) => (
    <FriendCard friend={friend} onPress={handleSelectFriend} />
  ), [handleSelectFriend]);

  return (
    <LinearGradient colors={gradients.friendListBackground} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.container}>
      <FlatList
        data={sortedFriends}
        keyExtractor={(friend) => friend.uid}
        contentContainerStyle={styles.list}
        renderItem={renderFriendItem}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
    </LinearGradient>
  );
}

export default FriendListScreen

const styles = StyleSheet.create({
  
    container: { 
      flex: 1, 
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
      elevation: 2, 
      overflow: 'hidden',
    },

    avatar: { 
      width: 55, 
      height: 55, 
      borderRadius: 27.5, 
    },

    info: { 
      marginLeft: 12, 
      flex: 1,
    },

    name: { 
      fontSize: 18, 
    },

    unreadName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#2b7cff",
    },

    sports: { 
      fontSize: 14, 
      color: '#666', 
      marginTop: 4 
    },

    chatIcon: {
      marginRight: 8,
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

