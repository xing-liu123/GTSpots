import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import PieChart from "react-native-pie-chart";

export default function UniversityBuildingDetails({ route }) {
  const { building } = route.params;

  const totalAvailability = Object.values(building.availabilityPercentages).reduce(
    (sum, count) => sum + count,
    0
  );

  const availabilityPercentages = Object.entries(building.availabilityPercentages).map(
    ([status, count]) => ({
      status,
      percentage: totalAvailability > 0 ? (count / totalAvailability) * 100 : 0,
    })
  );

  const colorScheme = {
    Available: "#4CAF50",
    Limited: "#FFC107",
    Full: "#F44336",
  };

  const widthAndHeight = 250;
  const series = availabilityPercentages.map(({ percentage }) => percentage);
  const sliceColor = availabilityPercentages.map(({ status }) => colorScheme[status]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{building.name}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Total Views: {building.totalViews}</Text>
        <Text style={styles.detailText}>Total Updates: {building.totalUpdates}</Text>
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={series}
          sliceColor={sliceColor}
          coverRadius={0.6}
          coverFill={"#FFF"}
        />
        <View style={styles.legendContainer}>
          {availabilityPercentages.map(({ status, percentage }) => (
            <View key={status} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: colorScheme[status] }]} />
              <Text style={styles.legendText}>{`${status} (${percentage.toFixed(1)}%)`}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 8,
  },
  chartContainer: {
    alignItems: "center",
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});