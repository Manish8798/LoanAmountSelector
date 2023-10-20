import React, {Component} from 'react';
import {
  PanResponder,
  View,
  Dimensions,
  TextInput,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  //   Text,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import debounce from 'lodash.debounce';

export default class CircleSlider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      angle: this.props.value,
      inputValue: this.props.value.toString(), // Initialize input value
      xCenter: 0,
      yCenter: 0,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(prevState.angle != this.state.angle);
    if (prevState.angle != this.state.angle) {
      let value = this.convertAngleToValue(this.state.angle);
      this.updateInputValueDebounced(value, 'componentDidUpdate');
    }
  }

  componentWillMount() {
    // console.log('componentWillMount');
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gs) => true,
      onStartShouldSetPanResponderCapture: (e, gs) => true,
      onMoveShouldSetPanResponder: (e, gs) => true,
      onMoveShouldSetPanResponderCapture: (e, gs) => true,
      onPanResponderMove: (e, gs) => {
        let xOrigin =
          this.state.xCenter - (this.props.dialRadius + this.props.btnRadius);
        let yOrigin =
          this.state.yCenter - (this.props.dialRadius + this.props.btnRadius);
        let a = this.cartesianToPolar(gs.moveX - xOrigin, gs.moveY - yOrigin);
        this.setState({angle: a});
      },
    });
  }

  polarToCartesian(angle) {
    // this.setState({inputValue: v});
    // this.updateInputValueDebounced(v);
    // console.log('polarToCartesian', angle);
    // const v = this.convertAngleToValue(parseInt(angle));
    // this.updateInputValueDebounced(v, 'polarToCartesian');
    let r = this.props.dialRadius;
    let hC = this.props.dialRadius + this.props.btnRadius;
    let a = ((angle - 90) * Math.PI) / 180.0;

    let x = hC + r * Math.cos(a);
    let y = hC + r * Math.sin(a);
    return {x, y};
  }

  cartesianToPolar(x, y) {
    // console.log('cartesianToPolar');
    let hC = this.props.dialRadius + this.props.btnRadius;

    if (x === 0) {
      return y > hC ? 0 : 180;
    } else if (y === 0) {
      return x > hC ? 90 : 270;
    } else {
      return (
        Math.round((Math.atan((y - hC) / (x - hC)) * 180) / Math.PI) +
        (x > hC ? 90 : 270)
      );
    }
  }

  handleMeasure = (ox, oy, width, height, px, py) => {
    // console.log('handleMeasure');
    this.setState({
      xCenter: px + (this.props.dialRadius + this.props.btnRadius),
      yCenter: py + (this.props.dialRadius + this.props.btnRadius),
    });
  };

  doStuff = () => {
    // console.log('doStuff');
    this.refs.circleslider.measure(this.handleMeasure);
  };
  onValueChange = value => {
    this.setState({inputValue: value.toString()});
    return this.convertAngleToValue(this.state.angle);
  };

  onInputChange = event => {
    // console.log(event.nativeEvent);
    let text = this.removeRupeeSymbol(event.nativeEvent.text);
    if (text.length == 5) return;
    this.updateInputValueDebounced(text, 'onInputChange');
  };

  removeRupeeSymbol = text => {
    // Use the replace method to remove the '₹' character
    return text.replace(/₹/g, '');
  };

  convertAngleToValue = (angle = parseInt(angle)) => {
    // Define the value range
    const minValue = 0;
    const maxValue = 10000;

    // Define the angle range (e.g., 0 to 360 degrees)
    const minAngle = 0;
    const maxAngle = 360;

    // Calculate the reverse mapped value
    const reverseMappedValue =
      ((angle - minAngle) / (maxAngle - minAngle)) * (maxValue - minValue) +
      minValue;

    // Now, `reverseMappedValue` contains the value corresponding to your angle
    // console.log(Math.round(reverseMappedValue));
    return Math.round(reverseMappedValue);
  };

  convertValueToAngle = value => {
    // Define the value range
    const minValue = 0;
    const maxValue = 10000;

    // Define the angle range (e.g., 0 to 360 degrees)
    const minAngle = 0;
    const maxAngle = 360;

    // Calculate the mapped angle
    const mappedAngle =
      ((value - minValue) / (maxValue - minValue)) * (maxAngle - minAngle) +
      minAngle;

    // Now, `mappedAngle` contains the angle corresponding to your value
    // console.log('raw', mappedAngle, Math.round(mappedAngle));
    return mappedAngle;
  };

  amountText = () => (
    <Text style={{fontSize: 16, color: '#714fff', fontWeight: 'bold'}}>
      ₹2,00,000
    </Text>
  );

  updateInputValueDebounced = debounce((value, type) => {
    // console.log('Updating input value 1:', value, this.state.angle);

    if (type == 'onInputChange') {
      this.setState({inputValue: value});
      // Ensure that the input value is a number
      const angle = this.convertValueToAngle(parseInt(value));
      if (!isNaN(angle)) {
        // console.log('onInputChange 2', value);
        this.setState({angle});
      }
    } else {
      //   console.log('onInputChange 3', value);
      this.setState({inputValue: value});
    }
  }, 100);

  render() {
    let width = (this.props.dialRadius + this.props.btnRadius) * 2;
    let bR = this.props.btnRadius;
    let dR = this.props.dialRadius;
    let startCoord = this.polarToCartesian(this.props.startCoord);
    let endCoord = this.polarToCartesian(this.state.angle);

    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headText}>Select a loan amount</Text>
          <Text style={styles.subText}>
            You're eligible for loan upto {this.amountText()}
          </Text>
        </View>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Svg
            onLayout={this.doStuff}
            ref="circleslider"
            width={width}
            height={width}>
            <Defs>
              <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={'#ecebf6'} />
                <Stop offset="100%" stopColor={'#ecebf6'} />
              </LinearGradient>
            </Defs>
            <Circle
              r={dR}
              cx={width / 2}
              cy={width / 2}
              stroke={this.state.angle == 0 ? '#ecebf6' : '#714fff'}
              strokeWidth={15}
              fill="none"></Circle>
            {/* <Text
            x={width / 2}
            y={width / 2 + 50}
            fontSize={14}
            fill={this.props.textColor}
            textAnchor="middle">
            {`Start Coord X: ${startCoord.x}, Y: ${startCoord.y}`}
          </Text> */}
            <Path
              stroke={'url(#gradient1)'}
              strokeWidth={this.props.dialWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              d={`M${startCoord.x} ${startCoord.y} A ${dR} ${dR} 1 ${
                (this.props.startCoord + 180) % 360 > this.state.angle ? 1 : 0
              } 0 ${endCoord.x} ${endCoord.y}`}
            />

            <G x={endCoord.x - bR} y={endCoord.y - bR}>
              <Circle
                r={bR + 5}
                cx={bR}
                cy={bR}
                fill={'#fff'}
                stroke={'#E1D9D1'}
                strokeWidth={1}
                {...this._panResponder.panHandlers}></Circle>

              <Circle
                r={bR / 2 + 1}
                cx={bR}
                cy={bR}
                fill={'#714fff'}
                {...this._panResponder.panHandlers}></Circle>
            </G>
          </Svg>
          <View
            style={{
              position: 'absolute',
              alignSelf: 'center',
              justifyContent: 'center',
              top: '32%',
              // width: width / 2,
              zIndex: 100,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                padding: 10,
                fontWeight: '500',
              }}>
              LOAN AMOUNT
            </Text>
            <TextInput
              style={styles.input}
              value={this.props.showValue && `₹${this.state.inputValue}`}
              onChange={e => this.onInputChange(e)}
              editable={true}
              keyboardType="numeric"
            />
          </View>
          <Text style={{textAlign: 'center', padding: 20}}>
            Lorem ipsum dolor sit amet consectetur. Neque.
          </Text>
        </View>
        <View style={styles.footer}>
          <Button
            disabled={parseInt(this.state.inputValue) < 5000 ? true : false}
            color={'#714fff'}
            title="submit"
          />
        </View>
      </View>
    );
  }
}

CircleSlider.defaultProps = {
  btnRadius: 12,
  dialRadius: 130,
  dialWidth: 15,
  textColor: 'white',
  textSize: 32,
  value: 0,
  xCenter: Dimensions.get('window').width / 2,
  yCenter: Dimensions.get('window').height / 2,
  showValue: true,
  startGradient: '#12D8FA',
  endGradient: '#A6FFCB',
  backgroundColor: 'white',
  startCoord: 0,
  //   onValueChange: x => x,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  footer: {
    // position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    padding: 30,
    elevation: 2,
    borderTopColor: '#ccc',
  },
  headText: {
    fontSize: 20,
    color: '#000',
    letterSpacing: 0,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    color: 'gray',
  },
  textContainer: {
    margin: 20,
    marginBottom: 5,
  },
  input: {
    fontSize: 24,
    color: this.props?.textColor,
    textAlign: 'center',
    backgroundColor: '#ecebf6',
    borderRadius: 10,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
});
