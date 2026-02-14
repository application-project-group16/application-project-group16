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
  const [userGrowthLabels, setUserGrowthLabels] = useState<string[]>([])
  const [userGrowthData, setUserGrowthData] = useState<number[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUserUid) {
        setCounts(AVAILABLE_SPORTS.map(() => 0))
        setTotalFriends(0)
        setCityLabels([])
        setCityData([])
        setUserGrowthLabels([])
        setUserGrowthData([])
        setLoading(false)
        return
      }

      setLoading(true)

      const countsMap: Record<string, number> = Object.fromEntries(
        AVAILABLE_SPORTS.map(s => [s, 0])
      )
      const cityCountsMap: Record<string, number> = {}
      const userGrowthMap: Record<string, number> = {}

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

          if (data.createdAt) {
            let createdDate: Date
            
            if (data.createdAt instanceof Date) {
              createdDate = data.createdAt
            } else if (data.createdAt.toDate && typeof data.createdAt.toDate === 'function') {
              createdDate = data.createdAt.toDate()
            } else if (typeof data.createdAt === 'string') {
              createdDate = new Date(data.createdAt)
            } else if (typeof data.createdAt === 'number') {
              createdDate = new Date(data.createdAt)
            } else {
              return 
            }
            
            const dateKey = createdDate.toISOString().split('T')[0] 
            userGrowthMap[dateKey] = (userGrowthMap[dateKey] || 0) + 1
          }
        })

        setCounts(AVAILABLE_SPORTS.map(s => countsMap[s] ?? 0))

        const sortedCities = Object.entries(cityCountsMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)

        setCityLabels(sortedCities.map(([city]) => city))
        setCityData(sortedCities.map(([_, count]) => count))

        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29) // 29 days ago to include today = 30 days

        const dateRange: string[] = []
        for (let i = 0; i < 30; i++) {
          const date = new Date(thirtyDaysAgo)
          date.setDate(date.getDate() + i)
          dateRange.push(date.toISOString().split('T')[0])
        }

        // Build cumulative data for all 30 days
        let cumulativeCount = 0
        const cumulativeData = dateRange.map(dateStr => {
          const count = userGrowthMap[dateStr] || 0
          cumulativeCount += count
          return cumulativeCount
        })

        setUserGrowthLabels(dateRange.map(dateStr => {
          const d = new Date(dateStr)
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
        setUserGrowthData(cumulativeData)
      } catch (err) {
        console.error('Failed to load user statistics', err)
        setCounts(AVAILABLE_SPORTS.map(() => 0))
        setTotalFriends(0)
        setCityLabels([])
        setCityData([])
        setUserGrowthLabels([])
        setUserGrowthData([])
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
      userGrowthLabels={userGrowthLabels}
      userGrowthData={userGrowthData}
    />
  )
}