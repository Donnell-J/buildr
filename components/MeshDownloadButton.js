import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Add import for TouchableOpacity
import { MaterialIcons } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown-transpiled';

const DownloadMeshButton = ({ pcdData, setLoading, setLoadingStage }) => {
    const [fileType, setFileType] = useState('.ply'); // Default file type
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const menuRef = useRef();

    const handleDownloadMesh = async () => {
        const fileName = Date.now().toString().concat(fileType);
        try {
            setLoadingStage(1);
            setLoading(true);
            const response = await fetch("http://82.2.192.225:9999/getMesh",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type' },
            body: JSON.stringify({ "points": pcdData.points, "point_normals" :pcdData.point_normals, "colors": pcdData.colors, "filename" :fileName}),
            });
            const blob = await response.blob();

            // Create a temporary URL for the downloaded file
            const url = URL.createObjectURL(blob);

            // Initiate a download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `mesh${fileType}`);
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            Alert.alert('Mesh downloaded successfully!');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error downloading mesh:', error);
            Alert.alert('Error downloading mesh. Please try again.');
        }
    };

    const handleDropdownSelect = (index, value) => {
        setFileType(value);
    };

    const handleDropdownWillShow = () => {
        setDropdownOpen(true);
    };

    const handleDropdownWillHide = () => {
        setDropdownOpen(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleDownloadMesh} style={styles.downloadButton}>
                <Text style={styles.downloadButtonText}>DOWNLOAD</Text>
            </TouchableOpacity>
            <ModalDropdown
                saveScrollPosition={false}
                options={['.ply', '.obj', '.gltf', '.stl', '.off', '.pcd']}
                defaultIndex={0}
                initialScrollIndex ={0}
                onSelect={handleDropdownSelect}
                style={styles.dropdownButton}
                dropdownStyle = {styles.dropdownDropdown}
                onDropdownWillShow={handleDropdownWillShow}
                onDropdownWillHide={handleDropdownWillHide}
                showsVerticalScrollIndicator = {false}
                animation ={true}
                animationType = {'slideUp'}
            >           
                <View style={styles.dropdownContent}>
                    <Text style={styles.dropdownButtonText}>{fileType}</Text>
                    <MaterialIcons name={!dropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#537da4" />
                </View>
            </ModalDropdown>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'relative',
        marginBottom: "5%",
        boxShadow: "0px 0px 10px #25292e"
    },
    downloadButton: {
        backgroundColor: '#537da4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        marginRight: -1,
    },
    downloadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dropdownButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#537da4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        marginLeft: -1,
    },
    dropdownButtonText: {
        color: '#537da4',
        fontWeight: 'bold',
        marginRight: 5,

    },
    dropdownContent: {
        flexDirection: 'row',
        alignItems: 'center', // Align items horizontally
    },
    dropdownDropdown: {
        alignItems:'center',
        width: 60,
        height:220,
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 100,
    },
});

export default DownloadMeshButton;