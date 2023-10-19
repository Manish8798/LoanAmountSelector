import React from 'react';
import {View, Text, TextInput} from 'react-native';
import CircleSlider from './src/components/CircleSlider';

const App = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <CircleSlider
        value={0}
        textColor={'#000'}
        startGradient="#01fffc"
        endGradient="#a200ff"
        startCoord={0}
      />
    </View>
  );
};

export default App;
