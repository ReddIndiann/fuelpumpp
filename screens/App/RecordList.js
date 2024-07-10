import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RecordList = ({ navigation }) => {
  const [productData, setProductData] = useState([]);
  const [agentId, setAgentId] = useState(null);
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
    const fetchData = async () => {
      try {
        const response = await fetch('https://gcnm.wigal.com.gh/fetchStocklist', {
          method: 'POST',
          headers: {
            
            'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
          },
          body: JSON.stringify({
            agent_id: '30',
            start_date: "",
            end_date: ""
          }),
        });

        const responseData = await response.json();

        if (responseData.statuscode === "00") {
          setProductData(responseData.data);
        } else {
          Alert.alert('Error', responseData.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch product data');
      }
    };

    fetchData();
  }, []);
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
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailsScreen', { item })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Dispensed Quantity:</Text>
            <Text style={styles.detailValue}>{item.dispensed_quantity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Recorded Date:</Text>
            <Text style={styles.detailValue}>{item.recorded_date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Record List</Text>
      </View>
      <FlatList
        data={productData}
        renderItem={renderItem}
        keyExtractor={(item) => item.product_name}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default RecordList;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsContainer: {
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  flatListContent: {
    padding: 15,
  },
});