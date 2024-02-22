import React from 'react';
import { ScrollView, SafeAreaView, ImageBackground, useWindowDimensions, View, LogBox } from 'react-native';

LogBox.ignoreLogs(['VirtualizedList']);

console.disableYellowBox = true;

function Screen({
  children,
  safe = true,
  style,
  headerSpace,
  refreshControl,
  backgroundColor = '#FFFFFF',
  backgroundImage,
  paddingHorizontal = 16,
}) {
  const { height, width } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1}}>
      {safe && (
        <>
          {backgroundImage ? (
            <>
              <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <ScrollView style={{ paddingHorizontal }}>
                  <View 
                    style={{
                    height: height,
                    backgroundColor: 'blue',
                    position: 'relative'
                }}
            >
                {children}
            </View>
                  </ScrollView>
                </View>
              </ImageBackground>
            </>
          ) : (
            <>
              <ScrollView
                style={{
                  width,
                  backgroundColor,
                  height: height + 60,
                  marginTop: headerSpace || 0,
                  position: 'relative'
                }}
                paddingHorizontal={paddingHorizontal}
                refreshControl={refreshControl}
                {...style}
              >
                 <View 
                     style={{
                    height: height,
                    position: 'relative'
                }}
            >
                {children}
            </View>
              </ScrollView>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

export default Screen;
