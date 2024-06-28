// Intro.js
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import Swiper from 'react-native-swiper';

import { useNavigateToScreen } from '../../hooks/useNavigateToScreen';

  
const Passwordsuccess = () => {


  const navigateToScreen = useNavigateToScreen();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  return (
    <SafeAreaView style={styles.container}>
<Image source={require('../assets/checkimg.png')} style={styles.image} />
<View style={styles.textcontainer}>
    <Text style={styles.textitem} >Password created</Text>
    <Text style={styles.textitem1}> Your password has been created</Text>
</View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, isTablet && styles.tabletButton]} onPress={()=>navigateToScreen('login')}>
          <Text style={styles.signInText}>Let’s begin</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

export default Passwordsuccess;

const styles = StyleSheet.create({
  
  
  image: {
    width: '60%',
    height: '30%',
    
    
    borderRadius: 30,
    marginTop: '5%',
  },
  tabletImage: {
    width: '85%',
    height: '75%',
    borderRadius: 30,
    marginTop: '5%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007B5D',
  },
  textcontainer:{
marginBottom:300
  },
  textitem:{
   fontSize:30,
   fontWeight:'bold',
   color:"#FFFFFF"
      },
      textitem1:{
        fontSize:16,
        color:"#FFFFFF"
        
           },
  text1: {
    fontSize: 20,
    fontWeight: 'bold',
    
    marginTop: 15,
    textAlign: 'center',
    padding: 2,
    color: '#007B5D',
  },
  text2: {
    fontSize: 25,
    
   
    marginTop: 5,
    textAlign: 'center',
    padding: 2,
    color: '#000',
  },
  tabletText0: {
    fontSize: 39,
    fontWeight: 'bold',
    marginTop: 25,
    textAlign: 'center',
    padding: 2,
    color:"#007B5D",
  },
  text3: {
    fontSize: 15,
    fontWeight: '100',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: '2%',
    padding: 8,
    color: '#000',
  },
  tabletText3: {
    fontSize: 25,
    fontWeight: '100',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: '2%',
    padding: 8,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: '4%',
  },
  button: {
    width: 320,
    height: 50,
    alignSelf:'center',
  
    backgroundColor:"#FFFFFF",
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
   
    alignItems: 'center',
  },
  button1: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    marginTop:10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  tabletButton: {
    width: 240,
    height: 80,
  },
  tabletButton1: {
    width: 240,
    height: 80,
    backgroundColor: '#02B2DD',
  },
  signInText: {
    color: '#007B5D',
    fontSize: 17,
  },
  signUpText: {

    fontSize: 17,
  },
});
