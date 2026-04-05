import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, BackHandler, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export default function App() {
  const webViewRef = React.useRef(null);
  const [localUri, setLocalUri] = React.useState(null);

  React.useEffect(() => {
    async function setupLocalServer() {
      try {
        // Em desenvolvimento (Expo Go), tentamos conectar ao seu PC (10.0.2.2 no Android)
        // No APK final (EAS Build), usamos o arquivo embutido
        if (__DEV__) {
             setLocalUri('http://10.0.2.2:3000'); // Alterar se usar outra porta
        } else {
            const asset = Asset.fromModule(require('./dist/index.html'));
            await asset.downloadAsync();
            setLocalUri(asset.localUri);
        }
      } catch (e) {
        console.error("Falha ao iniciar site off-line:", e);
      }
    }
    setupLocalServer();
  }, []);

  React.useEffect(() => {
    const onBackPress = () => {
      if (webViewRef.current && canGoBack) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [canGoBack]);

  const [canGoBack, setCanGoBack] = React.useState(false);

  if (!localUri) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <WebView 
          ref={webViewRef}
          source={{ uri: localUri }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={['*']}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1 },
  webview: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
