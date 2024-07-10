import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Text, View, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';

const Home = () => {
  const screenWidth = Dimensions.get('window').width;
  const [existingUsersCount, setExistingUsersCount] = useState(0);
  const [totalAmountSold, setTotalAmountSold] = useState(0);
  const [totalVolumeSold, setTotalVolumeSold] = useState(0);
  const [stockRecords, setStockRecords] = useState(0);
  const [agentId, setAgentId] = useState(null);
  const [monthlySalesData, setMonthlySalesData] = useState([]);

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id);
      } catch (error) {
        console.error('Failed to fetch agent ID:', error);
      }
    };

    fetchAgentId();
  }, []);

  useEffect(() => {
    if (agentId) {
      fetchExistingClients();
      fetchTotalAmountSold();
      fetchMonthlySales();
      fetchStockRecords();
    }
  }, [agentId]);

  const fetchExistingClients = async () => {
    try {
      const response = await fetch('https://gcnm.wigal.com.gh/getCustomers', {
        method: 'POST',
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        setExistingUsersCount(data.data.length);
      } else {
        console.error('Failed to fetch existing clients:', data.message);
      }
    } catch (error) {
      console.error('Error fetching existing clients:', error);
    }
  };

  const fetchTotalAmountSold = async () => {
    try {
      const response = await fetch('https://gcnm.wigal.com.gh/sumofproductssold', {
        method: 'POST',
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        setTotalAmountSold(data.data.total_amount_sold);
        setTotalVolumeSold(data.data.total_volume_sold.toFixed(2)); // Ensure two decimal places
      } else {
        console.error('Failed to fetch total amount sold:', data.message);
      }
    } catch (error) {
      console.error('Error fetching total amount sold:', error);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      const response = await fetch('https://gcnm.wigal.com.gh/monthlyproductssold', {
        method: 'POST',
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        setMonthlySalesData(data.data);
      } else {
        console.error('Failed to fetch monthly sales:', data.message);
      }
    } catch (error) {
      console.error('Error fetching monthly sales:', error);
    }
  };

  const fetchStockRecords = async () => {
    try {
      const response = await fetch('https://gcnm.wigal.com.gh/fetchStocks', {
        method: 'POST',
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });

      const data = await response.json();
      if (data.statuscode === '00') {
        setStockRecords(data.data[0].total_dispenser_qunatity);
      } else {
        console.error('Failed to fetch stock records:', data.message);
      }
    } catch (error) {
      console.error('Error fetching stock records:', error);
    }
  };

  const backgrounds = [
    {
      img: require('../../assets/dashback1.png'),
      icontext: "Fuel Sold",
      value: totalVolumeSold,
      unit: "Litres"
    },
    {
      img: require('../../assets/dashback2.png'),
      icontext: "Stock Records",
      value: stockRecords,
      unit: "Litres"
    },
    {
      img: require('../../assets/dashback4.png'),
      icontext: "Existing Users",
      value: existingUsersCount,
      unit: "Users"
    },
    {
      img: require('../../assets/dashback5.png'),
      icontext: "Total Amount \nSold",
      value: totalAmountSold,
      unit: "GHS"
    },
  ];

  const CustomBarChart = ({ data }) => {
    const chartWidth = screenWidth - 40;
    const chartHeight = 250; // Increased height to accommodate full month names
    const padding = 40;
    const barWidth = (chartWidth - padding * 2) / (data.length || 1);
    
    const maxValue = Math.max(...data.map(item => item.total_amount_sold), 1);
    const scale = (chartHeight - padding * 2) / maxValue;
  
    const ensureNumber = (value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#F1948A', '#85C1E9', '#82E0AA', '#F8C471', '#D7BDE2'];
  
    const getMonthName = (monthStr) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthNum = parseInt(monthStr.slice(-2)) - 1;
      return months[monthNum];
    };

    return (
      <Svg width={chartWidth} height={chartHeight}>
        <G>
          {/* Y-axis */}
          <Line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={chartHeight - padding}
            stroke="#333"
            strokeWidth="1"
          />
          
          {/* X-axis */}
          <Line
            x1={padding}
            y1={chartHeight - padding}
            x2={chartWidth - padding}
            y2={chartHeight - padding}
            stroke="#333"
            strokeWidth="1"
          />
    
          {data.map((item, index) => {
            const barHeight = ensureNumber(item.total_amount_sold * scale);
            return (
              <G key={index}>
                <Rect
                  x={padding + index * barWidth}
                  y={chartHeight - padding - barHeight}
                  width={barWidth - 5}
                  height={barHeight}
                  fill={colors[index % colors.length]}
                />
                <SvgText
                  x={padding + index * barWidth + barWidth / 2}
                  y={chartHeight - padding + 15}
                  fontSize="8"
                  textAnchor="middle"
                  fill="#333"
                  transform={`rotate(-45 ${padding + index * barWidth + barWidth / 2} ${chartHeight - padding + 15})`}
                >
                  {getMonthName(item.month)}
                </SvgText>
              </G>
            );
          })}
    
          {/* Y-axis labels */}
          {[0, maxValue / 2, maxValue].map((value, index) => (
            <SvgText
              key={index}
              x={padding - 5}
              y={chartHeight - padding - ensureNumber(value * scale)}
              fontSize="10"
              textAnchor="end"
              fill="#333"
            >
              {ensureNumber(value).toFixed(0)}
            </SvgText>
          ))}
        </G>
      </Svg>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headertitle}>Dashboard Activity</Text>
        <View style={styles.cardsContainer}>
          {backgrounds.map((background, index) => (
            <View style={styles.card} key={index}>
              <ImageBackground source={background.img} style={styles.background} imageStyle={styles.backgroundImage}>
                <View style={styles.cardContent}>
                  <View style={styles.iconTextContainer}>
                    <Ionicons name="add-outline" size={24} color="white" />
                    <Text style={styles.iconText}>{background.icontext}</Text>
                  </View>
                  <Text style={styles.value}>{background.value}</Text>
                  <Text style={styles.unit}>{background.unit}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Monthly Sales</Text>
          <CustomBarChart data={monthlySalesData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  headertitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  background: {
    width: '100%',
    height: 150,
  },
  backgroundImage: {
    borderRadius: 15,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: '500',
    color: "#fff",
    marginLeft: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff",
    marginTop: 10,
  },
  unit: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20, // Add some bottom margin
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333', // Darker text color for better contrast
  },
});

export default Home;
