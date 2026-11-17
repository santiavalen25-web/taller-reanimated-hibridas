import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Accelerometer } from 'expo-sensors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

// ============================================================================
// 1. DRAG AND DROP WITH ROTATION
// ============================================================================
function DragRotateScreen() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    });

  const animatedStyle = useAnimatedStyle(() => {
    // Si se arrastra a la izquierda (< 0) rota a la izquierda (grados negativos);
    // si se arrastra a la derecha (> 0) rota a la derecha (grados positivos).
    const rotateDeg = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-45, 0, 45],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateDeg}deg` },
      ],
    };
  });

  const resetPosition = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>1. Drag & Drop con Rotación</Text>
      <Text style={styles.subtitle}>
        Arrastra el cuadro hacia la izquierda o derecha para ver cómo rota en esa dirección.
      </Text>

      <View style={styles.arena}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.draggableBox, animatedStyle]}>
            <Text style={styles.boxText}>Arrástrame</Text>
          </Animated.View>
        </GestureDetector>
      </View>

      <Pressable style={styles.button} onPress={resetPosition}>
        <Text style={styles.buttonText}>Centrar Figura</Text>
      </Pressable>
    </View>
  );
}

// ============================================================================
// 2. LOADING ANIMATION (INFINITE SPINNER + ANIMATED PROGRESS BAR)
// ============================================================================
function LoadingAnimationScreen() {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    rotation.value = 0;
    progress.value = 0;

    // Spinner infinito al montar el componente
    rotation.value = withRepeat(
      withTiming(360, { duration: 1100, easing: Easing.linear }),
      -1,
      false
    );

    // Barra de progreso animada simultánea
    progress.value = withRepeat(
      withTiming(1, { duration: 2800, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    );
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>2. Animación de Carga</Text>
      <Text style={styles.subtitle}>
        Spinner infinito automático junto con una barra de progreso animada al montar la vista.
      </Text>

      <View style={styles.arena}>
        <Animated.View style={[styles.spinner, spinnerStyle]} />
        <Text style={styles.loadingLabel}>Cargando recursos...</Text>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressBarStyle]} />
        </View>
      </View>
    </View>
  );
}

// ============================================================================
// 3. MULTITOUCH GESTURES (ZOOM IN/OUT, MOVE & ROTATE IMAGE)
// ============================================================================
function MultitouchScreen() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = Math.max(0.5, Math.min(savedScale.value * e.scale, 3.5));
    });

  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      savedRotation.value = rotation.value;
    })
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    });

  const composedGesture = Gesture.Simultaneous(
    panGesture,
    pinchGesture,
    rotationGesture
  );

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  const resetImage = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>3. Gestos Multitouch</Text>
      <Text style={styles.subtitle}>
        Usa dos dedos para hacer zoom y rotar la imagen, o un dedo para moverla por la pantalla.
      </Text>

      <View style={styles.arena}>
        <GestureDetector gesture={composedGesture}>
          <Animated.Image
            source={{ uri: 'https://picsum.photos/id/1025/500/500' }}
            style={[styles.multitouchImage, imageAnimatedStyle]}
          />
        </GestureDetector>
      </View>

      <Pressable style={styles.button} onPress={resetImage}>
        <Text style={styles.buttonText}>Restablecer Imagen</Text>
      </Pressable>
    </View>
  );
}

// ============================================================================
// 4. BOUNCE ANIMATION (PRESS TO SHRINK, RELEASE TO BOUNCE BACK)
// ============================================================================
function BounceScreen() {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.68, { duration: 140 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 4,
      stiffness: 220,
      mass: 0.8,
    });
  };

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>4. Animación Bounce</Text>
      <Text style={styles.subtitle}>
        Mantén presionado el círculo para reducir su tamaño y suéltalo para ver el rebote.
      </Text>

      <View style={styles.arena}>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[styles.bounceCircle, bounceStyle]}>
            <Text style={styles.boxText}>Presióname</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

// ============================================================================
// 5. ANIMATED CAROUSEL (SCALE, ROTATION & TRANSITION EFFECTS)
// ============================================================================
const CAROUSEL_ITEMS = [
  { id: '1', title: 'Reanimated 3', desc: 'Animaciones fluidas a 60/120 FPS en el hilo nativo', color: '#4F46E5' },
  { id: '2', title: 'Gesture Handler', desc: 'Reconocimiento táctil nativo y multitouch', color: '#0891B2' },
  { id: '3', title: 'Expo Sensors', desc: 'Integración directa con el acelerómetro del móvil', color: '#059669' },
  { id: '4', title: 'Drawer Menu', desc: 'Navegación lateral entre todos los ejercicios', color: '#D97706' },
  { id: '5', title: 'UCompensar', desc: 'Desarrollo de Aplicaciones Híbridas', color: '#E11D48' },
];

const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

function CarouselCard({ item, index, scrollX }) {
  const animatedCardStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.82, 1, 0.82],
      Extrapolation.CLAMP
    );

    const rotateZ = interpolate(
      scrollX.value,
      inputRange,
      [-8, 0, 8],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }, { rotateZ: `${rotateZ}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.carouselCard,
        { backgroundColor: item.color },
        animatedCardStyle,
      ]}
    >
      <Text style={styles.carouselNumber}>0{index + 1}</Text>
      <Text style={styles.carouselTitle}>{item.title}</Text>
      <Text style={styles.carouselDesc}>{item.desc}</Text>
    </Animated.View>
  );
}

function CarouselScreen() {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>5. Carrusel Animado</Text>
      <Text style={styles.subtitle}>
        Desliza horizontalmente para observar los efectos de escala, rotación y opacidad.
      </Text>

      <View style={styles.arena}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: CARD_SPACING, alignItems: 'center' }}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {CAROUSEL_ITEMS.map((item, index) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={index}
              scrollX={scrollX}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

// ============================================================================
// 6. ACCELEROMETER ANIMATION (SHAKE DEVICE TO SHAKE SHAPE)
// ============================================================================
function AccelerometerScreen() {
  const shakeX = useSharedValue(0);
  const shakeRotate = useSharedValue(0);
  const [sensorData, setSensorData] = useState({ x: 0, y: 0, z: 0 });
  const [shakeCount, setShakeCount] = useState(0);

  const triggerShakeAnimation = () => {
    setShakeCount((prev) => prev + 1);
    shakeX.value = withSequence(
      withTiming(-20, { duration: 45 }),
      withRepeat(withTiming(20, { duration: 90 }), 5, true),
      withTiming(0, { duration: 45 })
    );
    shakeRotate.value = withSequence(
      withTiming(-12, { duration: 45 }),
      withRepeat(withTiming(12, { duration: 90 }), 5, true),
      withTiming(0, { duration: 45 })
    );
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(120);
    let lastShakeTime = 0;

    const subscription = Accelerometer.addListener((data) => {
      setSensorData(data);
      const totalAcceleration = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z
      );

      const now = Date.now();
      // Umbral de sacudida (~1.75g) con enfriamiento de 700ms
      if (totalAcceleration > 1.75 && now - lastShakeTime > 700) {
        lastShakeTime = now;
        triggerShakeAnimation();
      }
    });

    return () => subscription && subscription.remove();
  }, []);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { rotateZ: `${shakeRotate.value}deg` },
    ],
  }));

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>6. Animación con Acelerómetro</Text>
      <Text style={styles.subtitle}>
        Sacude físicamente tu teléfono para activar la animación de vibración en la figura.
      </Text>

      <View style={styles.arena}>
        <Animated.View style={[styles.shakeBox, animatedShakeStyle]}>
          <Text style={styles.boxText}>¡Sacúdeme!</Text>
          <Text style={styles.sensorText}>Sacudidas: {shakeCount}</Text>
        </Animated.View>

        <Text style={styles.coordsText}>
          X: {sensorData.x.toFixed(2)} | Y: {sensorData.y.toFixed(2)} | Z:{' '}
          {sensorData.z.toFixed(2)}
        </Text>
      </View>

      <Pressable style={styles.button} onPress={triggerShakeAnimation}>
        <Text style={styles.buttonText}>Simular Sacudida (Emulador)</Text>
      </Pressable>
    </View>
  );
}

// ============================================================================
// 7. DRAWER NAVIGATION INTEGRATING ALL EXERCISES
// ============================================================================
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="1. Drag & Rotate"
          screenOptions={{
            headerStyle: { backgroundColor: '#1E1B4B' },
            headerTintColor: '#FFFFFF',
            drawerActiveTintColor: '#4F46E5',
            drawerInactiveTintColor: '#334155',
          }}
        >
          <Drawer.Screen name="1. Drag & Rotate" component={DragRotateScreen} />
          <Drawer.Screen name="2. Loading & Progress" component={LoadingAnimationScreen} />
          <Drawer.Screen name="3. Multitouch Gestures" component={MultitouchScreen} />
          <Drawer.Screen name="4. Bounce Animation" component={BounceScreen} />
          <Drawer.Screen name="5. Animated Carousel" component={CarouselScreen} />
          <Drawer.Screen name="6. Accelerometer Shake" component={AccelerometerScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 10,
  },
  arena: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggableBox: {
    width: 135,
    height: 135,
    borderRadius: 24,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  boxText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  spinner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: '#E2E8F0',
    borderTopColor: '#4F46E5',
    marginBottom: 20,
  },
  loadingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  progressTrack: {
    width: '85%',
    height: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  multitouchImage: {
    width: 240,
    height: 240,
    borderRadius: 20,
  },
  bounceCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  carouselCard: {
    width: CARD_WIDTH,
    height: 270,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  carouselNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 8,
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  carouselDesc: {
    fontSize: 14,
    color: '#F1F5F9',
    textAlign: 'center',
    lineHeight: 20,
  },
  shakeBox: {
    width: 160,
    height: 160,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    marginBottom: 20,
  },
  sensorText: {
    color: '#FFFBEB',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
  coordsText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
