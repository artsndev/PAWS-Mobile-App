import { onMounted, onUnmounted } from 'vue';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function useStatusBar() {
  function setStatusBarTransparent() {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      if (Capacitor.getPlatform() === 'ios') {
        StatusBar.setStyle({ style: 'LIGHT' });
        StatusBar.setBackgroundColor({ color: '#FFFFFF00' });
      } else if (Capacitor.getPlatform() === 'android') {
        StatusBar.setBackgroundColor({ color: '#FFFFFF00' });
      }
    }
  }

  onMounted(() => {
    setStatusBarTransparent();
  });

  onUnmounted(() => {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      if (Capacitor.getPlatform() === 'ios') {
        StatusBar.setStyle({ style: 'DARK' });
        StatusBar.setBackgroundColor({ color: '#FFFFFF00' });
        StatusBar.setOverlaysWebView({ overlay: false });
      } else if (Capacitor.getPlatform() === 'android') {
        StatusBar.setBackgroundColor({ color: '#000000' });
      }
    }
  });
  return {
    setStatusBarTransparent,
  };
}
