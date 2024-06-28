// Intro.js
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import Swiper from 'react-native-swiper';

import { useNavigateToScreen } from '../../hooks/useNavigateToScreen';

const Intro = () => {

  const slides = [
    {
        img: require('../assets/slider3.png'), 
        text1: 'Welcome to Fuel Management App',
        text2: 'Welcome! Input vehicle info for', 
        text3: 'personalized savings. Let us',
        text4: 'optimize fuel together',
      
     
    },
    {
        img: require('../assets/slider4.png'), // update the path to your second image
        text1: 'Track, Analyze, Save',
        text2: 'Welcome! Easily track fuel,', 
        text3: 'save money, and reduce',
        text4: 'environmental impact. Let us',
        text5: 'make every drop count!',
      
    },
    {
      img: require('../assets/slider5.png'), // update the path to your second image
      text1: 'Maximize Efficiency with \t Fuel Management App',
      text2: 'Welcome to the future of fuel', 
      text3: 'management! Get ready to',
      text4: 'streamline your fuel usage and',
      text5: 'expenses with our intuitive app',
      
    },
];
  const navigateToScreen = useNavigateToScreen();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  return (
    <SafeAreaView style={styles.container}>
      <Swiper style={styles.swiper} showsButtons={false} loop={true}  activeDotColor="#00FF00" >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image style={isTablet ? styles.tabletImage : styles.image} source={slide.img} />
            <Text style={isTablet ? styles.tabletText0 : styles.text1}>{slide.text1}</Text>
            <Text style={isTablet ? styles.tabletText0 : styles.text2}>{slide.text2}</Text>
            <Text style={isTablet ? styles.tabletText3 : styles.text2}>{slide.text3}</Text>
            <Text style={isTablet ? styles.tabletText3 : styles.text2}>{slide.text4}</Text>
            <Text style={isTablet ? styles.tabletText3 : styles.text2}>{slide.text5}</Text>
          </View>
        ))}
      </Swiper>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, isTablet && styles.tabletButton]} onPress={()=>navigateToScreen('login')}>
          <Text style={styles.signInText}>Let’s begin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button1, isTablet && styles.tabletButton1]} onPress={()=>navigateToScreen('Main')}>
          <Text style={styles.signUpText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Intro;

const styles = StyleSheet.create({
  swiper: {
    height: '90%',
    backgroundColor: '#fff',
    marginTop: '30%',
  },
  slide: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '95%',
    height: '40%',
    
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    width: 300,
    height: 50,
    borderColor: '#02B2DD',
    backgroundColor:"#007B5D",
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 20,
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
    color: '#FFFFFF',
    fontSize: 17,
  },
  signUpText: {

    fontSize: 17,
  },
});
