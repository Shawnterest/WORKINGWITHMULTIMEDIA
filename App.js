import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [image, setImage] = useState(null);
  const [sound, setSound] = useState();
  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const pickImage = async () => {
    if (hasGalleryPermission === false) {
      alert('No access to gallery');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/cupid.mp3'));
    setSound(sound);
    await sound.playAsync();
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('./audio/cupid.mp3')
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };


  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Expo App</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Take a Photo" onPress={takePhoto} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Pick an Image from Library" onPress={pickImage} />

        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Play Sound" onPress={playSound} />
        </View>
        <View style={styles.container}>

      <View style={styles.buttonWrapper}>
        <Button 
          title={isPlaying ? "Pause Sound" : "Play Sound"} 
          onPress={playSound} 
        />
      </View>
    </View>
      </View>
    </View>
  );}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 30,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'relative',
    width: '80%',
    bottom: 15,
    marginTop: 20,
  },
  buttonWrapper: {
    marginBottom: 15,
  },
});
