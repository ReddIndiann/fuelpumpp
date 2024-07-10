import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ProductDetailsModal from './ProductDetailModal';

const StockProductList = ({ navigation }) => {
  const [productData, setProductData] = useState([]);
  const [agentId, setAgentId] = useState(null);
  const [startDate, setStartDate] = useState(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
      fetchData();
    }
  }, [agentId, startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://gcnm.wigal.com.gh/fetchProductsupplylist', {
        method: 'POST',
        headers: {
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      const responseData = await response.json();

      if (responseData.statuscode === '00') {
        setProductData(responseData.data);
      } else {
        Alert.alert('Error', responseData.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch product data');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedItem(item);
        setIsModalVisible(true);
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Supplied Quantity:</Text>
            <Text style={styles.detailValue}>{item.delivered_quantity}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Supplied Date:</Text>
            <Text style={styles.detailValue}>{item.arrival_date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleDateChange = (event, selectedDate, isStartDate) => {
    const currentDate = selectedDate || (isStartDate ? new Date(startDate) : new Date(endDate));
    if (isStartDate) {
      setShowStartDatePicker(Platform.OS === 'ios');
      setStartDate(moment(currentDate).format('YYYY-MM-DD'));
    } else {
      setShowEndDatePicker(Platform.OS === 'ios');
      setEndDate(moment(currentDate).format('YYYY-MM-DD'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Product List</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProductSupply')}
        >
          <Icon name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>{startDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{endDate}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={productData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
      {showStartDatePicker && (
        <DateTimePicker
          value={new Date(startDate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, true)}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={new Date(endDate)}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, false)}
        />
      )}
      <ProductDetailsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        item={selectedItem}
      />
    </SafeAreaView>
  );
};

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
  addButton: {
    backgroundColor: '#007B5D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  datePickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});

export default StockProductList;