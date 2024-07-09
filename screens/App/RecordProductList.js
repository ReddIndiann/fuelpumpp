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

const RecordProductList = ({ navigation }) => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://gcnm.wigal.com.gh/fetchStocklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
          },
          body: JSON.stringify({
            agent_id: "2",
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailsScreen', { item })}
    >
      <Text style={styles.cardText}>{item.product_name}</Text>
      <Text style={styles.cardText}>{`Supplied Quantity: ${item.recorded_date}`}</Text>
      <Text style={styles.cardText}>{`Supplied Date: ${item.dispensed_quantity}`}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Product List</Text>
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

export default RecordProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 17,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    elevation: 5,
  },
  cardText: {
    flex: 1,
    fontSize: 16,
  },
  flatListContent: {
    padding: 20,
  },
});
