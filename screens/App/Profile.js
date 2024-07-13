import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formFullName, setFormFullName] = useState('');
  const [formPhoneNumber, setFormPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verifyPasswordVisible, setVerifyPasswordVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setFormFullName(parsedUser.Name);
          setFormPhoneNumber(parsedUser.phoneNumber);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleVerifyPasswordVisibility = () => {
    setVerifyPasswordVisible(!verifyPasswordVisible);
  };

  const updateUserDetails = async () => {
    if (password !== verifyPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://gcnm.wigal.com.gh/updateUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': 'muJFx9F3E5ptBExkz8Fqroa1D79gv9Nv',
        },
        body: JSON.stringify({
          agent_id: user.id,
          name: formFullName,
          phoneNumber: formPhoneNumber,
          password: password,
        }),
      });

      if (response.ok) {
        const updatedUser = { ...user, Name: formFullName, phoneNumber: formPhoneNumber };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating profile');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Profile</Text>

          <View style={styles.profileContainer}>
            <View style={styles.profileIconContainer}>
              <Icon name="person" size={80} color="#0601B4" style={styles.profileIcon} />
            </View>
            <Text style={styles.profileName}>{user.Name}</Text>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoText}>{user.location}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Client:</Text>
              <Text style={styles.infoText}>{user.client}</Text>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formFullName}
              onChangeText={setFormFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#a0a0a0"
            />

            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                placeholder="Enter your new password"
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon name={passwordVisible ? "visibility" : "visibility-off"} size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Verify New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={verifyPassword}
                onChangeText={setVerifyPassword}
                secureTextEntry={!verifyPasswordVisible}
                placeholder="Verify your new password"
                placeholderTextColor="#a0a0a0"
              />
              <TouchableOpacity onPress={toggleVerifyPasswordVisibility}>
                <Icon name={verifyPasswordVisible ? "visibility" : "visibility-off"} size={24} color="#a0a0a0" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={updateUserDetails}>
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007B5D',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007B5D',
    width: 80,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#007B5D',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Profile;