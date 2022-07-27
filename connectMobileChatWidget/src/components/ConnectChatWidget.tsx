import * as React from 'react';
import { useRef, useState } from 'react';

import LocalStaticServer from './LocalStaticServer';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

interface ConnectChatWidgetProps {
  customerName?: string;
  region: string;
  apiGatewayEndpoint: string;
  contactFlowId: string;
  instanceId: string;
  darkMode?: boolean;
  displayHeader?: boolean;
  paddingTop?: number;
  onMessage?: (message: string) => void;
  onChatDisconnected?: () => void;
  onChatBubbleLongPress?: (selectedMessage: string) => void;
}

interface WebViewMessage {
  nativeEvent: {
    data: string;
  };
}

const ConnectChatWidget: React.FC<ConnectChatWidgetProps> = ({
  customerName = 'Customer',
  region,
  apiGatewayEndpoint,
  contactFlowId,
  instanceId,
  darkMode = false,
  displayHeader = true,
  paddingTop = 0,
  onMessage = (message) => {
    console.log(message);
  },
  onChatDisconnected = () => {
    console.log('Chat disconnected');
  },
  onChatBubbleLongPress = (selectedMessage) => {
    console.log(selectedMessage);
  },
}) => {
  const webviewRef = useRef<WebView>(null);
  const [url, setUrl] = useState<any>(null);

  const onWebViewMessage = (message: WebViewMessage) => {
    let payload = message.nativeEvent.data;
    if (payload !== undefined) {
      let data: { state: string; data: string } = JSON.parse(payload);
      if ('state' in data) {
        if (data.state === 'JS_LOADED') {
          initializeWidget();
        } else if (data.state === 'CHAT_ENDED') {
          onChatDisconnected();
        } else if (data.state === 'MESSAGE_EVENT') {
          onMessage(data.data);
        } else if (data.state === 'LONG_PRESS_EVENT') {
          onChatBubbleLongPress(data.data);
        }
      }
    }
  };

  const initializeWidget = () => {
    invokeFunction('initializeWidget', {
      customerName,
      region,
      apiGatewayEndpoint,
      contactFlowId,
      instanceId,
      onMessage,
      onChatDisconnected,
      darkMode,
      displayHeader,
      paddingTop,
    });
  };

  const invokeFunction = (function_name: string, args: object) => {
    if (webviewRef && webviewRef.current) {
      let payload = JSON.stringify({
        function: function_name,
        arguments: args,
      });
      webviewRef.current.postMessage(payload);
    }
  };

  const backgroundStyle = {
    backgroundColor: darkMode ? Colors.black : Colors.white,
    height: '100%',
    width: '100%',
  };

  const webViewStyle = {
    flex: 1,
    marginTop: displayHeader ? paddingTop : 0,
  };

  const renderWebView = () => {
    if (url != null) {
      return (
        <WebView
          style={webViewStyle}
          ref={webviewRef}
          source={{ uri: url }}
          onMessage={onWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          bounces={false}
          cacheEnabled={false}
          cacheMode={'LOAD_NO_CACHE'}
          incognito={true}
        />
      );
    }
    return null;
  };
  return (
    <View style={backgroundStyle}>
      <LocalStaticServer
        onURLInitialized={(serverUri) => {
          setUrl(serverUri);
        }}
      />
      {renderWebView()}
    </View>
  );
};

export default ConnectChatWidget;
