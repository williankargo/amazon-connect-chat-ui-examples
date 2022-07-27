import {sendStateToNative} from './utils.js';

export default class Bridge {
  constructor(handlers) {
    this.handlers = {
      initializeWidget: handlers.initializeWidgetHandler,
      endChat: handlers.endChatHandler,
    };
  }

  connect() {
    window.addEventListener('message', this.#handleEvents.bind(this));
    sendStateToNative('JS_LOADED');
  }

  sendMessageEvent(message) {
    sendStateToNative('MESSAGE_EVENT', message);
  }

  sendLongPressEvent(message) {
    sendStateToNative('LONG_PRESS_EVENT', message);
  }

  endChat() {
    sendStateToNative('CHAT_ENDED');
  }

  #handleEvents(message) {
    let payload = message.data;
    if (payload !== undefined && payload !== null) {
      payload = JSON.parse(payload);
      if (
        typeof payload === 'object' &&
        !Array.isArray(payload) &&
        'function' in payload &&
        'arguments' in payload
      ) {
        this.handlers[payload.function](payload.arguments);
      }
    }
  }
}
