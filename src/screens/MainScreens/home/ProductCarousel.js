import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSelector } from "react-redux";
import { baseURL } from "../../../utils/api";
import calculateDiscountedPrice from "../../../utils/calculateDiscountedPrice";



const ProductCarousel = ({navigation}) => {
    const { loading: recentlyAddedLoading, products, error: recentlyAddedError, } = useSelector(state => state.recentlyAddedProducts);

  const autoPlay = true;
  const loop = true;
  const pagingEnabled = false;
  const snapEnabled = false;
  const mode = "parallax";
  const snapDirection = "left";

  return (
    <View style={styles.container}>
      <Carousel
        style={styles.carousel}
        width={300}
        height={210}
        pagingEnabled={pagingEnabled}
        snapEnabled={snapEnabled}
        enabled
        // mode={mode}
        loop={loop}
        autoPlay={autoPlay}
        data={products}
        modeConfig={{
          snapDirection,
          stackInterval: mode === "vertical-stack" ? 8 : 18,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() =>
            navigation.navigate('Details', { product: item })
          } style={styles.productContainer} key={item.id}>
            <Image source={{ uri: `${baseURL}${item?.images[0]}` }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.discountedPrice}>₹{calculateDiscountedPrice(item.variations[0].price, item.variations[0].discount)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProductCarousel;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  productName: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18
  },
  carousel: {
    width: "100%",
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  productContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  productName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
