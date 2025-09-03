import { useState } from 'react';
import { Dimensions, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withTiming } from 'react-native-reanimated';


export default function HomeScreen() {
  const systemRotation = useSharedValue(0);
  const systemOffset = useSharedValue<number>(0);

  const systemAnimation = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: withTiming(`${(systemRotation.value + systemOffset.value)}deg`, { duration: 10 }) },
    ]
  }))

  const initialAngle = useSharedValue(0);
  const [centerX, setCenterX] = useState(0)
  const [centerY, setCenterY] = useState(0)

  const pan = Gesture.Pan()
    .onBegin((event) => {
      const x = event.absoluteX - centerX;
      const y = event.absoluteY - centerY;
      initialAngle.value = Math.atan2(y, x) * 180 / Math.PI;
    })
    .onChange((event) => {
      const x = event.absoluteX - centerX;
      const y = event.absoluteY - centerY;
      const currentAngle = Math.atan2(y, x) * 180 / Math.PI;

      let diff = currentAngle - initialAngle.value;
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      systemOffset.value = diff;
    })
    .onFinalize((event) => {
      const x = event.absoluteX - centerX;
      const y = event.absoluteY - centerY;
      const radius = Math.sqrt(x * x + y * y);

      if (radius > 0) {
        const velocity =
          ((event.velocityY * (event.absoluteX - centerX)) - (event.velocityX * (event.absoluteY - centerY))) /
          (radius * radius);

        const angularVelocity = velocity * (180 / Math.PI);

        systemRotation.value = systemRotation.value + systemOffset.value;
        systemOffset.value = 0;

        systemRotation.value = withDecay({
          velocity: angularVelocity,
          deceleration: 0.995,
          clamp: [-36000, 36000],
        });
      } else {
        systemRotation.value = systemRotation.value + systemOffset.value;
        systemOffset.value = 0;
      }
    });


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        onLayout={(event) => {
          const layout = event.nativeEvent.layout;
          setCenterY(layout.height / 2)
          setCenterX(layout.width / 2)
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
                borderRadius: Math.max(Dimensions.get('screen').height, Dimensions.get('screen').width),
                height: Dimensions.get('screen').height * 0.5,
                backgroundColor: 'blue'
              },
              systemAnimation,
            ]}
          >
            <Animated.View
              style={[
                {
                  top: 20,
                  left: '50%',
                }
              ]}
            >
              <TouchableOpacity onPress={() => console.log('planet 1')}>
                <View style={planetStyle} />
              </TouchableOpacity>
            </Animated.View>
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