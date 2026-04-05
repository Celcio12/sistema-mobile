import { registerRootComponent } from 'expo';
import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

function App() {
  // Configuração de carregamento:
  // Em desenvolvimento (Expo Go / Emulador), apontamos para o servidor Vite (10.0.2.2 é o IP do localhost no Android Emulator)
  // Em produção, apontamos para o arquivo index.html embutido nos assets do Android
  const source = __DEV__ 
    ? { uri: 'http://10.0.2.2:3000' } 
    : { uri: 'file:///android_asset/dist/index.html' };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView 
        source={source}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        startInLoadingState={true}
        onLoadError={(e) => console.error("WebView Load Error: ", e.nativeEvent)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});

registerRootComponent(App);
