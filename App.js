import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Platform, Dimensions, Alert } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import * as ImgPicker from 'expo-image-picker';
import ImageView from './components/ImageView';
import LoadModal from "./components/LoadModal";
import ViewDownloadModal from './components/ViewDownloadModal';
import * as Font from 'expo-font';
import AnimatedBackground from './background'; // Import the AnimatedBackground component
const placeholderIMG = require('./assets/images/placeholderdark.png');

export default function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const [confirmedImg, setConfirmedImg] = useState(false);
  const [pcdData, setPcdData] = useState(null);
  const [modelViewerVisible, setModelViewerVisible] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Choose a photo');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const loadModal = useRef();
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'title-font': require('./assets/fonts/Jersey10-Regular.ttf'),
        'default-font': require('./assets/fonts/Lato-Regular.ttf')
      });
    }
    loadFonts();
  }, []);

  useEffect(() => {
    if (selectedImg) {
      setButtonLabel('Change photo');
    } else {
      setButtonLabel('Choose a photo');
    }
  }, [selectedImg]);

  const pickImgAsync = async () => {
    let result = await ImgPicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImg(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const callAPI = async () => {
    if (selectedImg) {
      try {
        setConfirmedImg(true);
        setLoading(true);
        const resp = await fetch("http://82.2.192.225:9999/getPCD", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ "img": selectedImg }),
        });
        const pcdFromResp = await resp.json();
        setPcdData(pcdFromResp);
        setModelViewerVisible(true);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setConfirmedImg(false);
      }
    } else{
      alert('You did not select any image.');
    }
  }

  const isMobileWeb = Platform.OS === 'web' && Dimensions.get('window').width <= 768;

  return (
    <LinearGradient style={styles.page} colors = {['#25292e','#101010']}>
      <AnimatedBackground/> {/* Include the AnimatedBackground component */}
      <View style={styles.titleBar}>
        <Text style={isMobileWeb ? styles.titleMobile : styles.title}>buildr</Text>
      </View>
      <View style={styles.contentContainer}>
      {!confirmedImg && ( // Conditional rendering based on the loading state
        <View style={isMobileWeb ? styles.containerGreyMobile : styles.containerGrey}>
          <View style={styles.containerColumn}>
            <View style={isMobileWeb ? styles.imageContainerMobile : styles.imageContainer}>
              {selectedImg ? (
                <Image
                  source={{ uri: selectedImg }}
                  style={styles.selectedImage}
                />
              ) : (
                <Image
                  source={placeholderIMG}
                  style={styles.selectedImage}
                />
              )}
              <TouchableOpacity style={styles.button} onPress={pickImgAsync}>
                <Text style={styles.buttonLabel} onPress={pickImgAsync}>{buttonLabel}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={callAPI} style={styles.buttonContainer}>
              <Text style={styles.buttonLabel2}>Use this photo</Text>
            </TouchableOpacity>
  
            <View style={isMobileWeb ? styles.containerLightGreyMobile : styles.containerLightGrey}>
              <Text style={styles.infoText}>
                Step 1: Upload an Image {'\n'}
                Step 2: View the generated point cloud to see what it looks like{'\n'}
                Step 3: Download your 3D mesh!
              </Text>
            </View>
          </View>
        </View>
      ) }
  
      <LoadModal ref = {loadModal} isVisible={loading} mode = {loadingStage} />
      <ViewDownloadModal isVisible={modelViewerVisible && !loading} pcdData={pcdData} setLoading = {setLoading} setLoadingStage ={setLoadingStage}/>
      <StatusBar style="auto" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    width: '100%',
    height: '-30%', // Set a fixed height for the title bar
    marginTop: '2%',
    marginLeft: '2%', 
    marginRight: '2%',
  },
  contentContainer:{
    position: 'relative',
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'title-font',
    fontSize: 120,
    color: '#d8d8d8',
  },
  titleMobile: {
    fontFamily: 'title-font',
    fontSize: 80,
    color: '#d8d8d8',
  },
  navButtonText: {
    color: '#d8d8d8',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'default-font',
    borderStyle: 'groove',
    borderColor: '#d8d8d8',
    borderBottomWidth: 1,
  },
  containerGrey: {
    backgroundColor: '#464C55',
    borderRadius: 10,
    paddingTop: 250,
    padding: 50,
    alignItems: 'center',
    marginTop: 10,
    width: 550,
    marginLeft:'auto',
    marginRight:'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: "0px 0px 10px #131313"
    
  },
  containerGreyMobile: {
    backgroundColor: '#464C55',
    borderRadius: 10,
    paddingTop: '10%',
    paddingBottom: '10%',
    paddingLeft:'5%',
    paddingRight: '5%',
    alignItems: 'center',
    marginTop: '-3%',
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: "0px 0px 10px #131313"
  },
  imageContainer: {
    backgroundColor: '#537da4',
    overflow: 'hidden',
    width: '100%',
    height: 400,
    marginTop: -200,
    borderRadius: 10,
    borderColor: '#25292e',
    borderStyle: 'solid',
    borderWidth: 4,
    boxShadow: "0px 0px 14px #25292e"
  },
  imageContainerMobile: {
    backgroundColor: '#537da4',
    overflow: 'hidden',
    width: '100%',
    height: 300,
    borderColor: '#25292e',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: "1px 2px 5px #25292e"
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    backgroundColor: '#537da4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#25292e',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: "0px 0px 10px #25292e"
  },
  buttonLabel2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerLightGrey: {
    backgroundColor: '#d8d8d8',
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    width: '80%',
    borderRadius: 5,
    borderColor: '#25292e',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: "7px 7px #25292e"
  },
  containerLightGreyMobile: {
    backgroundColor: '#d8d8d8',
    marginTop: '5%',
    paddingTop: '2%',
    paddingBottom: '2%',
    paddingLeft:'2%',
    paddingRight:'2%',
    width: '100%',
    marginLeft: '4$',
    marginRight: '4%',
    borderRadius: 5,
    borderColor: '#25292e',
    borderStyle: 'solid',
    borderWidth: 2,
    boxShadow: "7px 7px #25292e"
  },
  containerColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  infoText: {
    fontFamily: 'default-font',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: '150%',
  },
});