import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RecordDetailsModal = ({ isVisible, onClose, item }) => {
  if (!item) return null;

  const details = [
    { label: 'Product', value: item.product_name },
    { label: 'Location', value: item.location_name },
    { label: 'Record Date', value: item.record_date },
    { label: 'Dipping Time', value: item.dipping_time },
    { label: 'Dipping Quantity', value: item.dipping_quantity },
    { label: 'Dispenser Quantity', value: item.dispenser_qunatity },
    { label: 'Recorded By', value: item.recorded_by },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.modalTitle}>{item.product_name}</Text>
            {details.map((detail, index) => (
              detail.value ? (
                <View key={index} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{detail.label}:</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              ) : null
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  scrollView: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
  },
  closeButton: {
    backgroundColor: '#007B5D',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RecordDetailsModal;
