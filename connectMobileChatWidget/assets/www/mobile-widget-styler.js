import StyleBuilder from './StyleBuilder.js';
import {html} from './constants.js';
import './amazon-connect-chat-interface.js';
import './long-press-event.js';
import Bridge from './bridge.js';

let session = null;
let bridge = new Bridge({
  initializeWidgetHandler: initializeWidget,
  endChatHandler: endChat,
});

bridge.connect();

function endChat() {
  if (session !== null) {
    session.endChat();
  }
}

document.addEventListener(
  'touchmove',
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  false,
);

let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  function (event) {
    let now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false,
);

function initializeWidget(props) {
  initializeChat(props);
  initializeStyles(props);
}

function initializeChat({
  customerName,
  region,
  apiGatewayEndpoint,
  contactFlowId,
  instanceId,
}) {
  connect.ChatInterface.init({
    containerId: 'section-chat',
  });
  connect.ChatInterface.initiateChat(
    {
      name: customerName,
      region: region,
      apiGatewayEndpoint: apiGatewayEndpoint,
      contactAttributes: JSON.stringify({
        customerName: customerName,
      }),
      contactFlowId: contactFlowId,
      instanceId: instanceId,
    },
    chatSession => {
      session = chatSession;
      chatSession.onChatDisconnected(data => {
        session = null;
        bridge.endChat();
      });
      chatSession.onIncoming(data => {
        if (data.Type === 'MESSAGE') {
          bridge.sendMessageEvent(data);
        }
      });
      chatSession.onOutgoing(data => {
        if (data.Type === 'MESSAGE') {
          bridge.sendMessageEvent(data);
        }
      });
    },
    error => {
      console.log(error);
    },
  );
}

function initializeStyles({darkMode, displayHeader, paddingTop}) {
  let styleBuilder = new StyleBuilder();
  styleBuilder.addStylesToClass(html.classes.CHAT_WIDGET, null, [
    {height: 'inherit'},
    {width: 'inherit'},
    {margin: 0},
  ]);
  styleBuilder.addStylesToClass(html.classes.CHAT_BUBBLE_TEXT, null, [
    {'pointer-events': null},
  ]);
  if (!displayHeader) {
    styleBuilder.addStylesToClass(html.classes.CHAT_HEADER, null, [
      {display: null},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_CONTENT, null, [
      {'padding-top': paddingTop},
    ]);
  } else {
    styleBuilder.addStylesToClass(html.classes.CHAT_HEADER, null, [
      {'border-radius': 0},
    ]);
  }
  if (darkMode) {
    styleBuilder.addStylesToTag(html.elements.BODY, null, [
      {'background-color': 'black'},
      {color: 'white'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_BUBBLE_INCOMING, null, [
      {'background-color': '#1c1c1e'},
      {color: 'white'},
      {padding: '10px 15px'},
      {'border-radius': '20px'},
      {width: 'max-content'},
      {'max-width': '100%'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_BUBBLE_INCOMING, 'after', [
      {'border-bottom-color': '#1c1c1e'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_BUBBLE_OUTGOING, null, [
      {'background-color': '#0a8e23'},
      {color: 'white'},
      {padding: '10px 15px'},
      {'border-radius': '20px'},
      {width: 'max-content'},
      {'max-width': '100%'},
      {float: 'right'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_BUBBLE_OUTGOING, 'after', [
      {'border-bottom-color': '#0a8e23'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_COMPOSER, null, [
      {'background-color': 'black'},
      {'border-color': 'gray'},
      {'border-radius': 100},
      {'border-style': 'solid'},
      {margin: 10},
      {'border-width': '0.1px'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_COMPOSER_TEXTAREA, null, [
      {'background-color': 'transparent'},
      {color: 'white'},
    ]);
    styleBuilder.addStylesToClass(
      html.classes.CHAT_COMPOSER_TEXTAREA,
      'placeholder',
      [{color: 'white'}],
    );
    styleBuilder.addStylesToClass(html.classes.CHAT_FOOTER, null, [
      {'background-color': '#1C1C1E'},
      {height: '75px'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_END_BUTTON, null, [
      {'background-image': null},
      {'background-color': '#1C1C1E'},
      {color: 'white'},
      {'max-width': '100%'},
      {'max-height': '100%'},
      {width: '100%'},
      {height: '100%'},
    ]);
    styleBuilder.addStylesToClass(html.classes.CHAT_END_BUTTON, 'hover', [
      {'background-color': '#1c1c1e'},
    ]);
  }
  styleBuilder.build();
  styleBuilder.apply(document.head);
  document.addEventListener('long-press', function (e) {
    if (e.target && e.target.className.includes(html.classes.CHAT_BUBBLE)) {
      let selectedBubbleText = e.target.children[0];
      let selectedMessage = selectedBubbleText.textContent;
      bridge.sendLongPressEvent(selectedMessage);
    }
  });
}
