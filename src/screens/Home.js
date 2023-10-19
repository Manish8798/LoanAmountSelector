import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import CircleSlider from '../components/CircleSlider';

const Home = () => {
  return (
    <View style={styles.container}>
      <CircleSlider value={0} textColor={'#000'} startCoord={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
});

export default Home;
