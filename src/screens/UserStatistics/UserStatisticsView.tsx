import React from 'react'
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native'
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit'

interface UserStatisticsViewProps {
  loading: boolean
  labels: readonly string[]
  data: number[]
  totalFriends: number
  cityLabels: string[]
  cityData: number[]
  userGrowthLabels: string[]
  userGrowthData: number[]
}

export default function UserStatisticsView({
  loading,
  labels,
  data,
  totalFriends,
  cityLabels,
  cityData,
  userGrowthLabels,
  userGrowthData,
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
  const hasCityData = cityData.some(v => v > 0)
  const hasUserGrowthData = userGrowthData.some(v => v > 0)
  const maxData = Math.max(...data, 1)
  const chartWidth = Math.max(Dimensions.get('window').width - 16, labels.length * 80)

  const chartColors = ['#FF6B35', '#FF1744', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#00BCD4']
  const cityChartData = cityLabels.map((label, i) => ({
    name: label.length > 8 ? label.slice(0, 8) + '…' : label,
    value: cityData[i],
    color: chartColors[i % chartColors.length],
    legendFontColor: '#222',
    legendFontSize: 12,
  }))

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Friends by Sport</Text>
      <Text style={styles.subHeader}>Total friends: {totalFriends}</Text>

      {hasData ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          persistentScrollbar={true}
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
            scrollEnabled={true}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No friend sport data yet.</Text>
        </View>
      )}

      <Text style={[styles.header, { marginTop: 24 }]}>Friends by City</Text>

      {hasCityData ? (
        <View style={styles.pieChartContainer}>
          <PieChart
            data={cityChartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#222',
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.pieChart}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No friend city data yet.</Text>
        </View>
      )}

      <Text style={[styles.header, { marginTop: 24, marginBottom: 15 }]}>App's User Growth</Text>

      {hasUserGrowthData ? (
        <View style={styles.lineChartContainer}>
          <LineChart
            data={{
              labels: userGrowthLabels.length > 7 
                ? userGrowthLabels.filter((_, i) => i % Math.ceil(userGrowthLabels.length / 7) === 0)
                : userGrowthLabels,
              datasets: [{ data: userGrowthData }],
            }}
            width={Dimensions.get('window').width - 48}
            height={260}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
              labelColor: () => '#222',
              propsForLabels: {
                fontSize: 11,
              },
              strokeWidth: 2,
            }}
            style={styles.lineChart}
            bezier
            fromZero={true}
            segments={5}
            withDots={false}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noData}>No user growth data yet.</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 4, paddingHorizontal: 16 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 12, paddingHorizontal: 16 },
  scrollContainer: { marginHorizontal: 16 },
  scrollContent: { paddingRight: 8 },
  chart: { marginVertical: 8, borderRadius: 8 },
  pieChartContainer: { alignItems: 'center', paddingHorizontal: 16, marginBottom: 24 },
  pieChart: { borderRadius: 8 },
  lineChartContainer: { alignItems: 'center', paddingHorizontal: 16, marginBottom: 24, marginTop: 8 },
  lineChart: { borderRadius: 8 },
  emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 32 },
  noData: { fontSize: 16, color: '#888' },
})