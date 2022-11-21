/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
const {width, height} = Dimensions.get('screen');
const API_URL =
  'https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=10';

const fetchImagesFromPexel = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: '563492ad6f917000010000011ca855082a1d4b7f9c5219984ebfed46',
    },
  });
  const {photos} = await data.json();
  return photos;
};
const GalleryScreen = () => {
  const [images, setImages] = React.useState(null);
  React.useEffect(() => {
    const fetchImg = async () => {
      const img = await fetchImagesFromPexel();
      setImages(img);
    };
    fetchImg();
  }, []);
  const imgRef = React.useRef();
  const sliderRef = React.useRef();
  const [currentImgIndex, setCurrentImgIndex] = React.useState(0);

  const setCurrentImg = idx => {
    console.log('got clicked', idx);
    setCurrentImgIndex(idx);
    imgRef?.current?.scrollToOffset({
      offset: idx * width,
      animated: true,
    });
  };

  if (!images) {
    return (
      <View>
        <Text style={{fontSize: 20}}>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <FlatList
        ref={imgRef}
        data={images}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          console.log('data---', event.nativeEvent);
          setCurrentImg(
            Math.floor(event.nativeEvent.contentOffset.x / width + 0.85),
          );
        }}
        renderItem={({item}) => {
          return (
            <View style={{width, height}}>
              <Image
                source={{uri: item.src.portrait}}
                style={{
                  bottom: 0,
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={sliderRef}
        style={{
          position: 'absolute',
          bottom: 20,
        }}
        data={images}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity onPress={() => setCurrentImg(index)}>
              <Image
                source={{uri: item.src.portrait}}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  marginHorizontal: 6,
                  elevation: 20,
                  shadowOpacity: 0.5,
                  shadowColor: '#222222',
                  shadowRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    currentImgIndex === index ? '#FF6347' : 'transparent',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <GalleryScreen />
    </SafeAreaView>
  );
}
