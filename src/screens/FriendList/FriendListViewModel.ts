import { useEffect, useState } from 'react';
import { UserProfile } from '../../Models/User';
import { db, collection, getDoc, doc, query, where, onSnapshot } from '../../firebase/Config';
import { useAuth } from '../../context/AuthContext';

interface Friend extends UserProfile {
  uid: string;
}

export const useFriendListViewModel = () => {
    const { user } = useAuth();
    const currentUserUid = user?.uid;

    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {

    if (!currentUserUid) return;
    const q = query(
        collection(db, 'matches'),
        where('users', 'array-contains', currentUserUid)

    );

    const unsubscribe = onSnapshot(q, async snapshot => {
        const friendPromises = snapshot.docs.map(async matchDoc => {
            const users = matchDoc.data().users as string[]
            const friendUid = users.find(uid => uid !== currentUserUid);
            if (!friendUid) return null;

            const profileSnap = await getDoc(doc(db, 'users', friendUid));
            if (!profileSnap.exists()) return null;

            return {
                uid: friendUid,
                ...(profileSnap.data() as UserProfile)
            }
        })

        const resolvedFriends = (await Promise.all(friendPromises)).filter(Boolean) as Friend[];

        const uniqueFriends = Array.from(
        new Map(resolvedFriends.map(friend => [friend.uid, friend])).values()
        );

        setFriends(uniqueFriends)
    });

    return unsubscribe;

}, [currentUserUid]);

    return {
        friends
    };
}

