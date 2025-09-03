import { useState } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';


export default function HomeScreen() {
  const systemRotation = useSharedValue(0);
  const systemOffset = useSharedValue<number>(0);

  const systemAnimation = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: withTiming(`${systemRotation.value + systemOffset.value}deg`, { duration: 100 }) },
      // { scale:}
    ]
  }))

  const [centerX, setCenterX] = useState(0)
  const [centerY, setCenterY] = useState(0)

  const pan = Gesture.Pan()
    .onBegin((event) => {
      console.log('begin');
    })
    .onChange((event) => {
      console.log(event)
      console.log('change', event.translationX);

      systemOffset.value = (event.changeX < 0 ? 1 : -1)  * event.translationX / 3 + (event.changeY < 0 ? -1 : 1) * event.translationY / 3;
    })
    .onFinalize((event) => {
      systemRotation.value = systemRotation.value + systemOffset.value;
      console.log('fin: ', event, systemRotation.value)
      systemOffset.value = 0;
    });


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setCenterX(layout.width / 2)
          setCenterY(layout.height / 2)
        }}
        style={{
          flex: 1,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                width: '100%',
                height: Dimensions.get('screen').height * 0.5,
                backgroundColor: 'blue'
              },
              systemAnimation,
            ]}
          >
            <Animated.View
              style={[
                planetStyle,
                {
                  top: 20,
                  left: '50%',
                }
              ]}
            />
            <Animated.View
              style={[
                planetStyle,
                {
                  left: 50,
                  top: '50%',
                }
              ]}
            />
            <Animated.View
              style={[
                planetStyle,
                {
                  top: '50%',
                  left: '50%',
                }
              ]}
            />

          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const planetStyle: ViewStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  backgroundColor: `#${Math.random().toString(16).slice(-6)}`,
}