import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/Config'

export const useSwipeProfileViewModel = (userId: string) => {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!userId) return

    setLoading(true)

    const unsub = onSnapshot(
      doc(db, 'users', userId),
      docSnap => {
        setProfile(docSnap.exists() ? docSnap.data() : null)
        setLoading(false)
      },
      err => {
        console.error('Error fetching profile:', err)
        setProfile(null)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [userId])

  return {
    loading,
    profile,
  }
}
