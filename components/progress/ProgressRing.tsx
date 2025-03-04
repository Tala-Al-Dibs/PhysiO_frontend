import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import React from 'react';
import { ProgressChart } from 'react-native-chart-kit';

const data = {
  labels: ['Kyphosis', 'Lordosis', 'Uneven Shoulders'], // Labels for the chart
  data: [0.4, 0.6, 0.8], // Data values
  colors: ['#0A8697', '#FFAC33', '#0CA7BD'], // Line colors
  backgroundColors: ['white', 'black', 'red'], // Background colors for each line
};

const ProgressRing = () => {
  const { width: screenWidth } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <ProgressChart
          data={data}
          width={screenWidth * 0.6} // Use 60% of the screen width for the chart
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={{
            backgroundColor: '#f2f2f2', // Background color of the chart
            backgroundGradientFrom: '#f2f2f2', // Gradient start color
            backgroundGradientTo: '#f2f2f2', // Gradient end color
            color: (opacity) => `rgba(255, 255, 255, ${opacity})`, // Line color
            propsForLabels: {
              fill: 'transparent', // Hide default labels
            },
          }}
          hideLegend={true} // Hide the default legend
          withCustomBarColorFromData
        />
      </View>

      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {data.labels.map((label, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: data.colors[index] }, // Set color for the legend dot
              ]}
            />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'row', // Arrange chart and legend side by side
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Add space between chart and legend
    // paddingHorizontal: 20, // Add horizontal padding
  },
  chartContainer: {
    width: '60%', // Use 60% of the container width for the chart
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendContainer: {
    width: '40%', // Use 35% of the container width for the legend
    flexDirection: 'column', // Arrange legend items vertically
    justifyContent: 'center', // Center items vertically
  },
  legendItem: {
    flexDirection: 'row', // Arrange color dot and label horizontally
    alignItems: 'center', // Align items vertically
    marginBottom: 10, // Add space between legend items
  },
  legendColor: {
    width: 10, // Size of the color dot
    height: 10, // Size of the color dot
    borderRadius: 5, // Make the dot circular
    marginRight: 5, // Add space between the dot and the label
  },
  legendText: {
    fontSize: 12, // Adjust font size
    fontWeight: 'bold', // Adjust font weight
    flexShrink: 1, // Allow text to wrap
  },
});

export default ProgressRing;