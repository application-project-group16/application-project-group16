import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AVAILABLE_SPORTS, User } from '../../Models/User'
import { db, collection, query, where, getDocs, doc, getDoc } from '../../firebase/Config'
import UserStatisticsView from './UserStatisticsView'

export default function UserStatisticsViewModel() {
  const { user } = useAuth()
  const currentUserUid = user?.uid

  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState<number[]>([])
  const [totalFriends, setTotalFriends] = useState(0)
  const [cityLabels, setCityLabels] = useState<string[]>([])
  const [cityData, setCityData] = useState<number[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUserUid) {
        setCounts(AVAILABLE_SPORTS.map(() => 0))
        setTotalFriends(0)
        setCityLabels([])
        setCityData([])
        setLoading(false)
        return
      }

      setLoading(true)

      const countsMap: Record<string, number> = Object.fromEntries(
        AVAILABLE_SPORTS.map(s => [s, 0])
      )
      const cityCountsMap: Record<string, number> = {}

      try {
        const matchesSnap = await getDocs(
          query(collection(db, 'matches'), where('users', 'array-contains', currentUserUid))
        )

        const friendIds = new Set<string>()
        matchesSnap.forEach(matchDoc => {
          const users = matchDoc.data().users as string[]
          const otherUid = users.find(uid => uid !== currentUserUid)
          if (otherUid) friendIds.add(otherUid)
        })

        setTotalFriends(friendIds.size)

        const friendSnaps = await Promise.all(
          Array.from(friendIds).map(uid => getDoc(doc(db, 'users', uid)))
        )

        friendSnaps.forEach(snap => {
          if (!snap.exists()) return
          const data = snap.data() as User
          const sports = Array.isArray(data.sports) ? Array.from(new Set(data.sports)) : []
          sports.forEach(s => {
            if (countsMap[s] !== undefined) countsMap[s] += 1
          })

          if (data.city) {
            cityCountsMap[data.city] = (cityCountsMap[data.city] || 0) + 1
          }
        })

        setCounts(AVAILABLE_SPORTS.map(s => countsMap[s] ?? 0))

        const sortedCities = Object.entries(cityCountsMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7) 

        setCityLabels(sortedCities.map(([city]) => city))
        setCityData(sortedCities.map(([_, count]) => count))
      } catch (err) {
        console.error('Failed to load user statistics', err)
        setCounts(AVAILABLE_SPORTS.map(() => 0))
        setTotalFriends(0)
        setCityLabels([])
        setCityData([])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [currentUserUid])

  return (
    <UserStatisticsView
      loading={loading}
      labels={AVAILABLE_SPORTS}
      data={counts}
      totalFriends={totalFriends}
      cityLabels={cityLabels}
      cityData={cityData}
    />
  )
}