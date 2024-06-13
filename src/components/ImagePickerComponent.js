import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from './Icons/Icon';
import { useSelector } from 'react-redux';
import { baseURL } from '../utils/api';

const ImagePickerComponent = ({ handleImage, url }) => {

  const [image, setImage] = useState(url);

  const getImageTypeFromUri = (uri) => {
    const extension = uri.split('.').pop(); // Extract the file extension from the URI
    const imageTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      // Add more image types as needed
    };

    const defaultType = 'image/jpeg'; // Default image type if the extension is not recognized

    return imageTypes[extension.toLowerCase()] || defaultType;
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = response.assets[0];
        setImage(source.uri);
        handleImage({
          uri: source.uri,
          name: source.fileName || 'image.jpg',
          type: getImageTypeFromUri(source.uri),
        });
      }
    });
  };

  console.log("image-->>", image)

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <View>
            <Image
              source={
                image.includes('uploads/customer') 
                  ? { uri:  `${baseURL}${image}` }
                  : { uri:  image }
              }
              style={{ width: 140, height: 140, borderRadius: 75 }}
            />
            <TouchableOpacity
              onPress={() => setImage(null)}
              style={{ position: 'absolute', right: 0, bottom: 0 }}>
              <Icon.AntDesign name="closecircle" size={32} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Image
              source={require('../assets/images/profile_jpg.jpeg')}
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                borderWidth: 0.5,
              }}
            />
            <Icon.AntDesign
              name="pluscircle"
              size={32}
              color="grey"
              style={{ position: 'absolute', right: 0, bottom: 0 }}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerComponent;
