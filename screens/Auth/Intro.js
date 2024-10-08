// // Intro.js
// import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
// import React, { useState } from 'react';
// import Swiper from 'react-native-swiper';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { useNavigateToScreen } from '../../hooks/useNavigateToScreen';

  
// const Intro = () => {
//   const navigation = useNavigation();
//   const slides = [
//     {
//       img: require('../../assets/slider3.png'),  
//         text1: 'Welcome to Fuel Management App',
//         text2: 'Welcome! Input vehicle info for', 
//         text3: 'personalized savings. Let us',
//         text4: 'optimize fuel together',
      
     
//     },
//     {
//       img: require('../../assets/slider4.png'),  // update the path to your second image
//         text1: 'Track, Analyze, Save',
//         text2: 'Welcome! Easily track fuel,', 
//         text3: 'save money, and reduce',
//         text4: 'environmental impact. Let us',
//         text5: 'make every drop count!',
      
//     },
//     {
//       img: require('./slider5.png'), // update the path to your second image
//       text1: 'Maximize Efficiency with \t Fuel Management App',
//       text2: 'Welcome to the future of fuel', 
//       text3: 'management! Get ready to',
//       text4: 'streamline your fuel usage and',
//       text5: 'expenses with our intuitive app',
      
//     },
// ];
//   const navigateToScreen = useNavigateToScreen();
//   const { width } = useWindowDimensions();

//   const isTablet = width >= 768;
//   return (
//     <SafeAreaView style={styles.container}>
//       <Swiper style={styles.swiper} showsButtons={false} loop={true}  activeDotColor="#00FF00" >
//         {slides.map((slide, index) => (
//           <View key={index} style={styles.slide}>
//             <Image style={isTablet ? styles.tabletImage : styles.image} source={slide.img} />
//             <Text style={isTablet ? styles.tabletText0 : styles.text1}>{slide.text1}</Text>
//             <Text style={isTablet ? styles.tabletText0 : styles.text2}>{slide.text2}</Text>
//             <Text style={isTablet ? styles.tabletText3 : styles.text2}>{slide.text3}</Text>
//             <Text style={isTablet ? styles.tabletText3 : styles.text2}>{slide.text4}</Text>
//             <Text style={isTablet ? styles.tabletText3 : styles.text2}>{slide.text5}</Text>
//           </View>
//         ))}
//       </Swiper>

//       <View style={styles.buttonContainer}>
       
//         <TouchableOpacity style={[styles.button, isTablet && styles.tabletButton]} onPress={()=>navigateToScreen('Login')}>
//           <Text style={styles.signInText}>Log in</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default Intro;

// const styles = StyleSheet.create({
//   swiper: {
//     height: '90%',
//     backgroundColor: '#fff',
//     marginTop: '30%',
//   },
//   slide: {
//     alignItems: 'center',
//     width: '100%',
//     height: '100%',
//   },
//   image: {
//     width: '95%',
//     height: '40%',
    
//     borderRadius: 30,
//     marginTop: '5%',
//   },
//   tabletImage: {
//     width: '85%',
//     height: '75%',
//     borderRadius: 30,
//     marginTop: '5%',
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   text1: {
//     fontSize: 20,
//     fontWeight: 'bold',
    
//     marginTop: 15,
//     textAlign: 'center',
//     padding: 2,
//     color: '#007B5D',
//   },
//   text2: {
//     fontSize: 25,
    
   
//     marginTop: 5,
//     textAlign: 'center',
//     padding: 2,
//     color: '#000',
//   },
//   tabletText0: {
//     fontSize: 39,
//     fontWeight: 'bold',
//     marginTop: 25,
//     textAlign: 'center',
//     padding: 2,
//     color:"#007B5D",
//   },
//   text3: {
//     fontSize: 15,
//     fontWeight: '100',
//     marginBottom: 30,
//     textAlign: 'center',
//     marginTop: '2%',
//     padding: 8,
//     color: '#000',
//   },
//   tabletText3: {
//     fontSize: 25,
//     fontWeight: '100',
//     marginBottom: 30,
//     textAlign: 'center',
//     marginTop: '2%',
//     padding: 8,
//     color: '#000',
//   },
//   buttonContainer: {
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//     marginBottom: '4%',
//   },
//   button: {
//     width: 300,
//     height: 50,
//     borderColor: '#02B2DD',
//     backgroundColor:"#007B5D",
//     borderWidth: 1,
//     justifyContent: 'center',
//     borderRadius: 10,

//     alignItems: 'center',
//     alignContent:"center"
//   },
//   button1: {
//     width: 300,
//     height: 50,
//     justifyContent: 'center',
//     marginTop:10,
//     borderRadius: 10,
//     alignItems: 'center',
//     backgroundColor: '#F0F2F5',
//   },
//   tabletButton: {
//     width: 240,
//     height: 80,
//   },
//   tabletButton1: {
//     width: 240,
//     height: 80,
//     backgroundColor: '#02B2DD',
//   },
//   signInText: {
//     color: '#FFFFFF',
//     fontSize: 17,
//   },
//   signUpText: {

//     fontSize: 17,
//   },
// });






import React, { useRef, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, useWindowDimensions, Platform } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';


const Intro = () => {
  const navigation = useNavigation();

  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const swiperRef = useRef(null);

  const slides = [
    {
      img: require('../../assets/slider3.png'),
      title: 'Welcome to Fuel Management App',
      description: 'Input vehicle info for personalized savings. Let us optimize fuel together.',
    },
    {
      img: require('../../assets/slider4.png'),
      title: 'Track, Analyze, Save',
      description: 'Easily track fuel, save money, and reduce environmental impact. Let us make every drop count!',
    },
    {
      img: require('../../assets/slider5.png'),
      title: 'Maximize Efficiency',
      description: 'Get ready to streamline your fuel usage and expenses with our intuitive app.',
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      if (swiperRef.current) {
        swiperRef.current.scrollTo(0, false);
      }
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.swiperContainer, { height: height * 0.8 }]}>
        <Swiper
          ref={swiperRef}
          showsButtons={false}
          loop={false}
          activeDotColor="#008080"
          dotColor="#a0a0a0"
          paginationStyle={styles.pagination}
        >
          {slides.map((slide, index) => (
            <View key={index} style={styles.slide}>
              <Image style={[styles.image, isTablet && styles.tabletImage]} source={slide.img} />
              <View style={styles.textContainer}>
                <Text style={[styles.title, isTablet && styles.tabletTitle]}>{slide.title}</Text>
                <Text style={[styles.description, isTablet && styles.tabletDescription]}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </Swiper>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isTablet && styles.tabletButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={['#008080', '#00A3A3']}
            style={styles.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swiperContainer: {
    flex: 1,
  },
  pagination: {
    bottom: 20,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  tabletImage: {
    height: '60%',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabletTitle: {
    fontSize: 32,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tabletDescription: {
    fontSize: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  button: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  tabletButton: {
    height: 60,
    width: '50%',
    alignSelf: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Intro;