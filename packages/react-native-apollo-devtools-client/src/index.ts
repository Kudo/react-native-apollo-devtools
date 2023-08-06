import type { DevToolsPluginClient } from 'expo/devtools';
import type { addPlugin } from 'react-native-flipper';

import { initializeExpoUtils, initializeFlipperUtils } from './initializeUtils';
import type { ApolloClientType, Callback } from './typings';

export function createFlipperPlugin(
  client: ApolloClientType,
  config?: {
    onConnect?: Callback;
    onDisconnect?: Callback;
  }
): Parameters<typeof addPlugin>[0] {
  return {
    getId() {
      return 'react-native-apollo-devtools';
    },
    onConnect(connection) {
      initializeFlipperUtils(connection, client);
      if (config?.onConnect) config?.onConnect();
    },
    onDisconnect() {
      if (config?.onDisconnect) config?.onDisconnect();
    },
  };
}

export function bindExpoPlugin(
  devToolsClient: DevToolsPluginClient,
  client: ApolloClientType
) {
  initializeExpoUtils(devToolsClient, client);
}
