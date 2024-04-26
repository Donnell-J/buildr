import { StyleSheet, Image } from 'react-native';

export default function ImageView({ placeholderImgSource, selectedImg }) {
  const imgSource = selectedImg  ? { uri: selectedImg } : placeholderImgSource;
  return (
    
    <Image source={imgSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});