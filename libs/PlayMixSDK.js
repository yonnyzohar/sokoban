const PlayMixSDK = (() => {
    const playStateChangeListeners = [];
  
    // Function to send a 'LOADED' event to the parent
    function sendLoadedEvent() {
      if (window.parent) {
        window.parent.postMessage({ type: "LOADED" }, "*");
      }
    }
  
    // Function to handle 'PlayStateChange' from the Vue app
    function handlePlayStateChange(state) {
      playStateChangeListeners.forEach((listener) => listener(state));
    }
  
    // Subscribe function for PlayStateChange events
    function onPlayStateChange(listener) {
      if (typeof listener === "function") {
        playStateChangeListeners.push(listener);
      }
    }
  
    // Listen for messages from the parent (Vue app)
    window.addEventListener("message", (event) => {
      // console.log("PlayMixSDK message received", event);
      if (event.data && event.data.type === "PLAY_STATE_CHANGE") {
        handlePlayStateChange(event.data.state);
      }
    });
  
    return {
      sendLoadedEvent,
      onPlayStateChange,
    };
  })();
  
  // Make the SDK available globally
  window.PlayMixSDK = PlayMixSDK;