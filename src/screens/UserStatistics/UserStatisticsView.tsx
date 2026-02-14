import React from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import { BarChart } from 'react-native-chart-kit'

interface UserStatisticsViewProps {
  loading: boolean
  labels: readonly string[]
  data: number[]
  totalFriends: number
}

export default function UserStatisticsView({
  loading,
  labels,
  data,
  totalFriends,
}: UserStatisticsViewProps) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    )
  }

  const hasData = data.some(v => v > 0)
  const maxData = Math.max(...data, 1)
  const chartWidth = Math.max(Dimensions.get('window').width - 16, labels.length * 80)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends by Sport</Text>
      <Text style={styles.subHeader}>Total friends: {totalFriends}</Text>

      {hasData ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <BarChart
            data={{
              labels: labels as string[],
              datasets: [{ data }],
            }}
            width={chartWidth}
            height={280}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
              labelColor: () => '#222',
              propsForLabels: {
                fontSize: 12,
              },
            }}
            style={styles.chart}
            segments={Math.ceil(maxData)}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No friend sport data yet.</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 4, paddingHorizontal: 16 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 12, paddingHorizontal: 16 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingHorizontal: 8, paddingVertical: 8 },
  chart: { marginVertical: 8, borderRadius: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noData: { fontSize: 16, color: '#888' },
})