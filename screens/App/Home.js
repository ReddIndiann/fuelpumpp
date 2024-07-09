import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, Text, View, ImageBackground, useWindowDimensions, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const screenWidth = Dimensions.get('window').width;
  const [existingUsersCount, setExistingUsersCount] = useState(0);
  const [totalAmountSold, setTotalAmountSold] = useState(0);
  const [agentId, setAgentId] = useState(null);

  useEffect(() => {
    const fetchAgentId = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = JSON.parse(savedUser);
        setAgentId(user?.id); // Adjust this based on your user object structure
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
        setExistingUsersCount(data.data.length); // Assuming data.data is an array of customers
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
        setTotalAmountSold(data.data.total_amount_sold); // Use a specific property from the object
      } else {
        console.error('Failed to fetch total amount sold:', data.message);
      }
    } catch (error) {
      console.error('Error fetching total amount sold:', error);
    }
  };

  const backgrounds = [
    {
      img: require('../../assets/dashback1.png'),       
      icontext: "Fuel Sold",
      cur: "GHS",
      value: "25,000.40",
    },
    {
      img: require('../../assets/dashback2.png'), 
      icontext: "Stock Records",
      value: 123456789,
    },
    {
      img: require('../../assets/dashback4.png'), 
      icontext: "Existing Users",
      value: existingUsersCount, // Use the fetched number here
    },
    {
      img: require('../../assets/dashback5.png'), 
      icontext: "Total Amount Sold",
      cur: "GHS",
      value: totalAmountSold, // Use the fetched total amount sold here
    },
  ];

  const dataa = [
    { label: 'Withdraw Funds', value: 250 },
    { label: 'Add Funds', value: 150 },
  ];

  const maxValue = Math.max(...dataa.map(d => d.value));
  const step = maxValue / 5; // Number of steps for the scale

  const data = [
    { month: 'Nov', product1: 30, product2: 60 },
    { month: 'Dec', product1: 50, product2: 50 },
    { month: 'Jan', product1: 60, product2: 40 },
    { month: 'Feb', product1: 70, product2: 70 },
    { month: 'Mar', product1: 40, product2: 30 },
    { month: 'Apr', product1: 20, product2: 10 }
  ];

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.headertitle}>Dashboard Activity</Text>
        <View style={styles.locations}>
          {backgrounds.map((background, index) => (
            <View style={styles.dashupper} key={index}>
              <ImageBackground source={background.img} style={styles.background}>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationText}>
                    <Ionicons name="add-outline" size={24} color="white" /> {background.icontext}
                  </Text>
                  {background.cur && <Text style={styles.cur}>{background.cur}</Text>}
                  <Text style={styles.value}>{background.value}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </View>
      
        
       
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
    margin: 10,
  },
  headertitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  dashupper: {
    width: '50%', // To ensure two items per row with space in between
    marginBottom: 20,
  },
  background: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-start',
    padding: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  locationTextContainer: {
    alignItems: 'flex-start',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: "#fff",
  },
  cur: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#6200ee',
  },
  tabText: {
    color: '#fff',
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    marginBottom: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bar: {
    width: 20,
    marginHorizontal: 2,
  },
  label: {
    marginTop: 5,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  legendText: {
    fontSize: 16,
  },
  description: {
    marginBottom: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  transferContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  transferTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transferAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  transferChange: {
    fontSize: 18,
    color: '#28a745',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  customBarChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 300,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    
  },
  yAxisLabel: {
    fontSize: 12,
    
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 300,
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginLeft: 10,
    
  },
  barContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    
  },
  customBar: {
    width: 50,
    backgroundColor: '#007B5D',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    
  },
  barLabel: {
    marginTop: 10,
    
    
    textAlign: 'center',
  },
});
