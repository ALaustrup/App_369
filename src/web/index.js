import { AppRegistry } from 'react-native';
import App from '../../App';
import { name as appName } from '../../app.json';

AppRegistry.registerComponent('main', () => App);
AppRegistry.runApplication('main', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
