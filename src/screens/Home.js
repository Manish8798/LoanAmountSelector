import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import CircleSlider from '../components/CircleSlider';

const Home = () => {
  const amountText = () => (
    <Text style={{fontSize: 16, color: '#714fff'}}>₹2,00,000</Text>
  );
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.headText}>Select a loan amount</Text>
        <Text style={styles.subText}>
          You are eligible for loan upto {amountText()}
        </Text>
      </View>
      <CircleSlider value={0} textColor={'#000'} startCoord={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headText: {
    fontSize: 20,
    color: '#000',
    letterSpacing: 0,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'gray',
  },
  textContainer: {
    margin: 10,
  },
});

export default Home;
