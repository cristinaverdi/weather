import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { fetchLocationId, fetchWeather } from './utils/api';
import getImageForWeather from './utils/getImageForWeather';

import SearchInput from './components/SearchInput';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: false,
      location: '',
      temperature: 0,
      weather: '',
      errorMessage: ''
    };
  }

  componentDidMount() {
    const errorMessage = 'Could not load weather, please try a different city.'
    this.setState({errorMessage})
    this.handleUpdateLocation('San Francisco');
  }

  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const { location, weather, temperature } = await fetchWeather(
          locationId,
        );

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature,
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: true
        
        });
      }
    });
  }

  render() {
    const data = Object.assign({}, this.state);

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <StatusBar
          barStyle='light-content'
        />
        <ImageBackground
          source={getImageForWeather(data.weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <ActivityIndicator
              animating={data.loading}
              color="white"
              size="large"
            />
            {!data.loading && (this.renderWeatherWidget({...data}))}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>)
  }

  renderWeatherWidget({error, errorMessage, location, weather, temperature}) {
    return (
      <View>
        {error && (this.renderPleaseTryAgain(errorMessage))}

        {!error && (this.renderWeatherInfo(location, weather, temperature))}
        <SearchInput placeholder="Search any city" onSubmit={this.handleUpdateLocation} />
      </View>)
  }

  renderPleaseTryAgain(message) {
    return (
      <Text style={[styles.smallText, styles.textStyle]}>
        { message }
      </Text>) 
  }

  renderWeatherInfo(location, weather, temperature) {
    return (
      <View>
        <Text style={[styles.largeText, styles.textStyle]}>
          {location}
        </Text>
        <Text style={[styles.smallText, styles.textStyle]}>
          {weather}
        </Text>
        <Text style={[styles.largeText, styles.textStyle]}>
          {`${Math.round(temperature)}°`}
        </Text>
      </View>) 
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    backgroundColor: 'yellow',
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});