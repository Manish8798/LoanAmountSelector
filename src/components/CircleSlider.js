import React, {Component} from 'react';
import {PanResponder, View, Dimensions, TextInput, Text} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  //   Text,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

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

  componentWillMount() {
    console.log('componentWillMount');
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
    let v = this.convertAngleToValue(parseInt(angle));
    console.log('polarToCartesian', v);
    let r = this.props.dialRadius;
    let hC = this.props.dialRadius + this.props.btnRadius;
    let a = ((angle - 90) * Math.PI) / 180.0;

    let x = hC + r * Math.cos(a);
    let y = hC + r * Math.sin(a);
    return {x, y, v};
  }

  cartesianToPolar(x, y) {
    console.log('cartesianToPolar');
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
    console.log('handleMeasure');
    this.setState({
      xCenter: px + (this.props.dialRadius + this.props.btnRadius),
      yCenter: py + (this.props.dialRadius + this.props.btnRadius),
    });
  };

  doStuff = () => {
    console.log('doStuff');
    this.refs.circleslider.measure(this.handleMeasure);
  };
  onValueChange = value => {
    this.setState({inputValue: value.toString()});
    return this.convertAngleToValue(this.state.angle);
  };

  onInputChange = event => {
    console.log(event.nativeEvent);
    let text = this.removeRupeeSymbol(event.nativeEvent.text);
    if (text.length == 5) return;

    this.setState({inputValue: text});

    // Ensure that the input value is a number
    const angle = this.convertValueToAngle(parseFloat(text));
    if (!isNaN(angle)) {
      console.log('onInputChange', text);
      this.setState({angle});
    }
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
    return mappedAngle;
  };

  render() {
    let width = (this.props.dialRadius + this.props.btnRadius) * 2;
    let bR = this.props.btnRadius;
    let dR = this.props.dialRadius;
    let startCoord = this.polarToCartesian(this.props.startCoord);
    let endCoord = this.polarToCartesian(this.state.angle);
    let value = this.convertAngleToValue(this.state.angle);

    return (
      <View style={{alignSelf: 'center'}}>
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
            style={{
              fontSize: 24,
              color: this.props.textColor,
              textAlign: 'center',
              backgroundColor: '#ecebf6',
              borderRadius: 10,
              fontWeight: 'bold',
              paddingVertical: 5,
              paddingHorizontal: 2,
            }}
            value={
              this.props.showValue && this.state.inputValue == 0
                ? `₹${endCoord.v}`
                : `₹${this.state.inputValue}`
            }
            onChange={e => this.onInputChange(e)}
            editable={true}
            keyboardType="numeric"
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
