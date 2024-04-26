import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import ModelViewer from './ModelViewer.js';
import DownloadMeshButton from './MeshDownloadButton.js';
import { MaterialIcons } from '@expo/vector-icons';

export default function ViewDownloadModal({ isVisible, pcdData, setLoading, setLoadingStage }) {
    const [showInfo, setShowInfo] = useState(false);
    const [rotateEnabled, setRotateEnabled] = useState(true);
    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    const toggleRotate = () => {
        setRotateEnabled(!rotateEnabled); // Toggle rotation state
        
    };

    const isMobileWeb = Platform.OS === 'web' && Dimensions.get('window').width <= 768;

    return (
        <Modal animationType="fade" transparent={true} visible={isVisible}>
            <View style={isMobileWeb ? styles.modalContentMobile : styles.modalContentWeb}>
                <View style={isMobileWeb ? styles.titleContainerMobile : styles.titleContainerWeb}>
                    {!isMobileWeb && (
                        <TouchableOpacity onPress={toggleInfo} style={styles.infoIconWeb}>
                            <MaterialIcons name="info" size={36} color="#d8d8d8" />
                        </TouchableOpacity>
                    )}
                    <Text style={isMobileWeb ? styles.titleMobile : styles.titleWeb }>View and Download Mesh</Text>
                </View>
                <View style={isMobileWeb ? styles.modelViewerContainerMobile : styles.modelViewerContainerWeb}>
                    <ModelViewer pcdData={pcdData}  />
                </View>
                <View style={isMobileWeb ? styles.footerContainerMobile : styles.footerContainer}>
                    <View style={isMobileWeb ? styles.buttonViewMobile : styles.buttonViewWeb}>
                        <DownloadMeshButton pcdData={pcdData}  setLoading = {setLoading} setLoadingStage ={setLoadingStage} />
                    </View>
                </View>
                {showInfo && (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            View Controls:
                            {"\n"}
                            Pan with Right Click
                            {"\n"}
                            Rotate with Left Click
                            {"\n"}
                            Zoom with Scroll Wheel
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContentWeb: {
        height: '80%',
        width: '50%',
        marginTop:170,
        margin: 'auto',
        backgroundColor: '#464C55',
        borderRadius: 18,
        position: 'relative',
        borderStyle: 'solid',
        borderWidth: 1,
        boxShadow: "0px 0px 10px #131313",
        paddingBottom:'5%'
    },

    modalContentMobile: {
        height: '75%',
        width: '90%',
        margin: 'auto',
        backgroundColor: '#464C55',
        borderRadius: 18,
        position: 'relative',
        borderStyle: 'solid',
        borderWidth: 1,
        boxShadow: "0px 0px 10px #131313"
    },
    titleContainerWeb: {
        height: '1%',
        backgroundColor: '#464C55',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: '1%',
        flexDirection: 'row',
        marginBottom:'8%',
        marginTop:'5%'
    },
    titleContainerMobile: {
        height: '10%',
        backgroundColor: '#464C55',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: '3%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
    },
    titleMobile: {
        marginBottom: '10%',
        color: '#d8d8d8',
        fontSize: 20,
        fontWeight: 'bold',
    },
    titleWeb: {
        marginBottom: '1%',
        color: '#d8d8d8',
        fontSize: 28,
        fontWeight: 'bold',
        marginLeft:'auto',
        marginRight: 'auto',
    },
    modelViewerContainerWeb: {
        marginTop: '1%',
        marginLeft: '3%',
        marginRight: '3%',
        marginBottom: '3%',
        height: 500,
        boxShadow: "1px 2px 15px #25292e",
        borderRadius: 5,
    },
    modelViewerContainerMobile: {
        flex: 1,
        marginTop: '10%',
        marginLeft: '3%',
        marginRight: '3%',
        marginBottom: '3%',
        boxShadow: "1px 2px 15px #25292e",
        borderRadius: 5,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'flex-center',
        marginRight: 100,
        marginBottom: 80,
    },

    footerContainerMobile: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'flex-center',
        marginRight: 100,
        marginBottom: 80,
    },

    infoIconWeb: {
        left:40,
    },

    buttonViewWeb: {
        marginLeft: 40
    },
    buttonViewMobile: {
        marginLeft: '30%',
    },
    infoContainer: {
        position: 'absolute',
        top: 40,
        left: 120,
        backgroundColor: '#537da4',
        padding: 20,
        borderRadius: 10,
        zIndex: 1,
        marginLeft: 10,
    },
    infoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },

});