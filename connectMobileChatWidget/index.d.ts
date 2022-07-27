import { Component } from 'react';
import { ConnectChatWidgetProps } from './lib/components/ConnectChatWidget';

declare class ConnectChatWidget<P = {}> extends Component<
  ConnectChatWidgetProps & P
> {
  /**
   * End user's name to be displayed to agent
   */
  customerName: string;

  /**
   * Region where Connect instance is set
   */
  region: string;

  /**
   * AWS API Gateway endpoint for Connect instance
   */
  apiGatewayEndpoint: string;

  /**
   * AWS Contact Flow ID for Connect instance
   */
  contactFlowId: string;

  /**
   * AWS Instance ID for Connect instance
   */
  instanceId: string;

  /**
   * Enable dark mode for Customer chat widget
   */
  darkMode: boolean;

  /**
   * Enable header for Customer chat widget
   */
  displayHeader: boolean;

  /**
   * Enable padding (in pixels) on top in the Customer chat widget
   */
  paddingTop: number;

  /**
   * Listener for messages (strings) received and sent between agent and customer
   */
  onMessage: (message: string) => void;

  /**
   * Chat disconnect handler. Executes when chat session is disconnected by user
   */
  onChatDisconnected: () => void;

  /**
   * Listener for selected message (strings) when a chat bubble is long pressed
   */
  onChatBubbleLongPress: (selectedMessage: string) => void;
}

export default ConnectChatWidget;
