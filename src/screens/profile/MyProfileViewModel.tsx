import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/Config'
import { useAuth } from '../../context/AuthContext'

export const useMyProfileViewModel = () => {
  const { user, loading: authLoading } = useAuth()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (!user) return

    setLoading(true)

    const unsub = onSnapshot(
      doc(db, 'users', user.uid),
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
  }, [user])

  return {
    user,
    authLoading,
    loading,
    profile,
  }
}
