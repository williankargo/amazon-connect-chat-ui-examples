export function sendStateToNative(state, data = {}) {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      state: state,
      data: data,
    }),
  );
}
