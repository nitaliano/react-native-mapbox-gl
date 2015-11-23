import React from 'react-native';
import Mapbox from 'react-native-mapbox-gl';

const {
  AppRegistry,
  StyleSheet,
  Text,
  StatusBarIOS,
  View
} = React;

export default MapExample extends React.Component({
  constructor(props) {
    super(props);

    this.state = {
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 11,
      userTrackingMode: 'follow',
      annotations: [
        {
          id: 'marker1',
          coordinate: {
            latitude: 40.72052634,
            longitude: -73.97686958312988
          },
          type: 'point',
          title: 'This is marker 1',
          subtitle: 'It has a rightCalloutAccessory too',
          rightCalloutAccessoryImage: {
            source: {
              uri: 'https://cldup.com/9Lp0EaBw5s.png',
            }
            height: 25,
            width: 25
          },
          image: {
            source: require('./pin.png');
          },
        },
        {
          id: 'marker2',
          coordinate: {
            latitude: 40.714541341726175,
            longitude: -74.00579452514648
          },
          type: 'point',
          title: 'Important!',
          subtitle: 'Neat, this is a custom annotation image',
          image: {
            source: {
              uri: 'https://cldup.com/7NLZklp8zS.png',
            },
            height: 25,
            width: 25
          },
        },
        {
          'id': 'foobar',
          'coordinates': [[40.76572150042782,-73.99429321289062],[40.743485405490695, -74.00218963623047],[40.728266950429735,-74.00218963623047],[40.728266950429735,-73.99154663085938],[40.73633186448861,-73.98983001708984],[40.74465591168391,-73.98914337158203],[40.749337730454826,-73.9870834350586]],
          'type': 'polyline',
          'strokeColor': '#00FB00',
          'strokeWidth': 4,
          'strokeAlpha': .5,
        },
        {
          'id': 'zap',
          'coordinates': [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
          'type': 'polygon',
          'fillAlpha':1,
          'strokeColor': '#fffff',
          'fillColor': 'blue',
        }
      ]
    };
  }

  componentDidMount() {
    StatusBarIOS.setHidden(true);
  }

  componentWillUnmount() {
    StatusBarIOS.setHidden(false);
  }

  onRegionChanged(region) {
    console.log(region);
  },

  onUpdateUserLocation(location) {
    console.log(location);
  },

  onAnnotationSelected(id) {
    //console.log(storedAnnotationsAssoc[id]);
  },

  onTap(coord) {
    console.log(coord);
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text} onPress={() => this.refs.map.setDirection(0)}>
          Set direction to 0
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.setZoomLevel(6)}>
          Zoom out to zoom level 6
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.setCenterCoordinate({latitude: 48.8589, longitude: 2.3447})}>
          Go to Paris at current zoom level {parseInt(this.currentZoom)}
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.setCenterCoordinateZoomLevel({latitude: 35.68829, longitude: 139.77492}, 14)}>
          Go to Tokyo at fixed zoom level 14
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.addAnnotations([
            {
              coordinate: {
                latitude: 40.73312,
                longitude: -73.989
              },
              type: 'point',
              title: 'This is a new marker',
              id: 'foo'
            },
            {
              coordinates: [[40.749857912194386, -73.96820068359375], [40.741924698522055,-73.9735221862793], [40.735681504432264,-73.97523880004883], [40.7315190495212,-73.97438049316406], [40.729177554196376,-73.97180557250975], [40.72345355209305,-73.97438049316406], [40.719290332250544,-73.97455215454102], [40.71369559554873,-73.97729873657227], [40.71200407096382,-73.97850036621094], [40.71031250340588,-73.98691177368163], [40.71031250340588,-73.99154663085938]],
              type: polygon,
              fillAlpha: 1,
              fillColor: '#000',
              strokeAlpha: 1,
              id: 'new-black-polygon'
            }
          ]
      )}>
          Add new marker
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.selectAnnotation('foo')}>
          Open first popup
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.removeAnnotations(['foo'])}>
          Remove first annotation
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.setVisibleCoordinateBounds({latitude: 40.712, longitude: -74.227}, {latitude: 40.774, longitude: -74.125})}>
          Set visible bounds to 40.7, -74.2, 40.7, -74.1
        </Text>
        <Text style={styles.text} onPress={() => this.refs.map.resetPosition()}>
          Reset
        </Text>
        <Mapbox
          ref={'map'}
          accessToken={'your-mapbox.com-access-token'}
          styleURL={Mapbox.styles.emerald}
          style={styles.map}
          direction={0}
          showsUserLocation={true}
          userTrackingMode={this.state.userTrackingMode}
          centerCoordinate={this.state.center}
          zoomLevel={this.state.zoom}
          annotations={this.state.annotations}
          onTap={this.onTap}
          onRegionChanged={this.onRegionChanged}
          onAnnotationSelected={this.onAnnotationSelected}
          onUpdateUserLocation={this.onUpdateUserLocation} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  text: {
    padding: 3
  }
});

AppRegistry.registerComponent('your-app-name', () => MapExample);
