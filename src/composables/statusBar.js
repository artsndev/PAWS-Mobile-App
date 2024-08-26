import { onMounted, onUnmounted } from 'vue';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export default function useStatusBar() {
  function setStatusBarTransparent() {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      if (Capacitor.getPlatform() === 'ios') {
        StatusBar.setStyle({ style: 'LIGHT' });
        StatusBar.setBackgroundColor({ color: '#ffffff' });
      } else if (Capacitor.getPlatform() === 'android') {
        StatusBar.setBackgroundColor({ color: '#ffffff' });
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
        StatusBar.setBackgroundColor({ color: '#ffffff' });
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
