import { Modal, View, Text, Pressable, StyleSheet, ActivityIndicator, Platform, Dimensions } from 'react-native';

export default function LoadModal({ isVisible, mode }) {
  const isMobileWeb = Platform.OS === 'web' && Dimensions.get('window').width <= 768;
  const activityIndicatorColor = isMobileWeb ? '#464c55' : '#537da4';

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={[styles.modalContent, isMobileWeb && styles.modalContentMobile]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Please Wait...</Text>
        </View>
        <ActivityIndicator size={'large'} color={activityIndicatorColor} />
        {mode === 0 ? (<Text style={styles.text}>Processing the selected image.</Text>) : (<Text style={styles.text}>Preparing your download file.{"\n"} This may take a while, do not refresh..</Text>)}
        
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: '70%',
    width: '50%',
    margin: 'auto',
    backgroundColor: '#464C55',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
    marginBottom: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: "0px 0px 10px #131313"
  },
  modalContentMobile: {
    height: '60%',
    width: '90%',
    marginTop: '40%',
    marginBottom: '35%',
    backgroundColor:'#537da4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%',
    marginBottom: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: "0px 0px 10px #131313"
  },
  titleContainer: {
    height: '10%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 30,
  },
  text: {
    color: '#fff',
    marginTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
});
