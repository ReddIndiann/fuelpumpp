import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    useWindowDimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  
  const Profile = () => {
    const [fullName, setFullName] = useState('Brielle Williamson');
    const [phoneNumber, setPhoneNumber] = useState('(0) 548 838 479');
    const [email, setEmail] = useState('brielle.williamson@example.com');
    const [currentPassword, setCurrentPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
  
    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Profile</Text>
  
            {/* Profile Picture and Info */}
            <View style={styles.profileContainer}>
              <View style={styles.profileIconContainer}>
                <Icon name="person" size={80} color="#0601B4" style={styles.profileIcon} />
              </View>
              <Text style={styles.profileName}>Brielle Williamson</Text>
              <Text style={styles.profileEmail}>brielle.williamson@example.com</Text>
            </View>
  
            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
  
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
  
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
  
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Icon name={passwordVisible ? "visibility" : "visibility-off"} size={24} color="#a0a0a0" />
                </TouchableOpacity>
              </View>
  
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default Profile;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContainer: {
      flexGrow: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    profileIconContainer: {
      backgroundColor: '#979797',
      borderRadius: 50,
      padding: 10,
      marginBottom: 10,
    },
    profileIcon: {
      width: 80,
      height: 80,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    profileEmail: {
      fontSize: 16,
      color: '#777',
    },
    formContainer: {
      marginTop: 20,
    },
    label: {
      fontSize: 16,
      color: '#000',
      marginBottom: 5,
    },
    input: {
      height: 50,
      borderColor: '#a0a0a0',
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 15,
      marginBottom: 15,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: '#a0a0a0',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 15,
      paddingRight: 10,
    },
    passwordInput: {
      flex: 1,
      height: 50,
      paddingLeft: 15,
    },
    editButton: {
      backgroundColor: '#007B5D',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    editButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  