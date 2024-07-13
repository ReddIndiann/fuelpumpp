import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Text, View, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const [existingUsersCount, setExistingUsersCount] = useState(0);
  const [totalAmountSold, setTotalAmountSold] = useState(0);
  const [totalVolumeSold, setTotalVolumeSold] = useState(0);
  const [stockRecords, setStockRecords] = useState(0);
  const [agentId, setAgentId] = useState(null);
  const [monthlySalesData, setMonthlySalesData] = useState([]);

  const fetchAgentId = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(savedUser);
      setAgentId(user?.id);
    } catch (error) {
      console.error('Failed to fetch agent ID:', error);
    }
  };

  useEffect(() => {
    fetchAgentId();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (agentId) {
        fetchExistingClients();
        fetchTotalAmountSold();
        fetchMonthlySales();
        fetchStockRecords();
      }
    }, [agentId])
  );

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
        setTotalVolumeSold(data.data.total_volume_sold.toFixed(2));
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
      unit: "Litres",
      screen: "Home"
    },
    {
      img: require('../../assets/dashback2.png'),
      icontext: "Stock Records",
      value: stockRecords,
      unit: "Litres",
      screen: "StockRecords"
    },
    {
      img: require('../../assets/dashback4.png'),
      icontext: "Existing Users",
      value: existingUsersCount,
      unit: "Users",
      screen: "Customers"
    },
    {
      img: require('../../assets/dashback5.png'),
      icontext: "Total Amount \nSold",
      value: totalAmountSold,
      unit: "GHS",
      screen: "Home"
    },
  ];

  const CustomBarChart = ({ data }) => {
    const chartWidth = screenWidth - 40;
    const chartHeight = 250;
    const padding = 25;
    const barWidth = (chartWidth - padding * 2) / (data.length || 1);

    const maxValue = Math.max(...data.map(item => Number(item.total_amount_sold) || 0), 1);
    const scale = (chartHeight - padding * 2) / maxValue;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#F1948A', '#85C1E9', '#82E0AA', '#F8C471', '#D7BDE2'];

    const getMonthName = (monthStr) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNum = parseInt(monthStr.slice(-2)) - 1;
      return months[monthNum];
    };

    return (
      <View style={{ width: chartWidth, height: chartHeight }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
          {data.map((item, index) => {
            const barHeight = (Number(item.total_amount_sold) || 0) * scale;
            return (
              <View key={index} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={{
                    width: barWidth - 5,
                    height: barHeight,
                    backgroundColor: colors[index % colors.length],
                  }}
                />
                <Text style={{ fontSize: 8, transform: [{ rotate: '-45deg' }], marginTop: 5 }}>
                  {getMonthName(item.month)}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: padding, justifyContent: 'space-between' }}>
          {[maxValue, maxValue / 2, 0].map((value, index) => (
            <Text key={index} style={{ fontSize: 10, textAlign: 'right' }}>
              {value.toFixed(0)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headertitle}>Dashboard Activity</Text>
        <View style={styles.cardsContainer}>
          {backgrounds.map((background, index) => (
            <TouchableOpacity
              style={styles.card}
              key={index}
              onPress={() => navigation.navigate(background.screen)}
            >
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
            </TouchableOpacity>
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
    paddingBottom: 100, // Increased bottom padding
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
    marginBottom: 60, // Increased bottom margin
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
});

export default Home;