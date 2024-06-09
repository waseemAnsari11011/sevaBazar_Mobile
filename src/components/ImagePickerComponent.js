import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ImagePickerComponent = ({handleImage, url}) => {
  const [image, setImage] = useState(url);

  const getImageTypeFromUri = uri => {
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

  // const pickImage = async () => {
  //   const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (status !== 'granted') {
  //     alert('Sorry, we need camera roll permissions to make this work!');
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (result.assets) {
  //     setImage(result.assets[0].uri);
  //     handleImage({
  //       uri: result.assets[0].uri,
  //       name: 'abc',
  //       type: getImageTypeFromUri(result.assets[0].uri),
  //     });
  //   }
  // };


  const pickImage = ()=>{
    console.log("hii")
  }
  return (
    <View style={{alignItems: 'center'}}>
      <Text>image picker component</Text>
      {/* <TouchableOpacity onPress={pickImage}>
        {image ? (
          <View>
            <Image
              source={
                image ===
                'https://poon2.xonierconnect.com/storage/images/users/'
                  ? require('../assets/images/default_profile.png')
                  : {uri: image}
              }
              style={{width: 140, height: 140, borderRadius: 75}}
            />
            {image && (
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={{position: 'absolute', right: 0, bottom: 0}}>
                <Ionicons name="md-trash" size={32} color="red" />
              </TouchableOpacity>
            )}
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
            <Ionicons
              name="md-add-circle"
              size={32}
              color="grey"
              style={{position: 'absolute', right: 0, bottom: 0}}
            />
          </View>
        )}
      </TouchableOpacity> */}
    </View>
  );
};

export default ImagePickerComponent;
