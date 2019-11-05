import { AppRegistry } from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  // eslint-disable-next-line global-require
  require('./stories');
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
