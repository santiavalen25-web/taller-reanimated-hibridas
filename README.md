# Taller de Animaciones y Gestos — React Native Reanimated & Expo (Visual Studio Code)

Proyecto académico para la asignatura **Desarrollo de Aplicaciones Híbridas** en la Fundación Universitaria Compensar (UCompensar), desarrollado en **Visual Studio Code** con [Expo](https://docs.expo.dev/), [React Native Reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/), [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/getting-started/), [Expo Accelerometer (`expo-sensors`)](https://docs.expo.dev/versions/latest/sdk/accelerometer/) y [React Navigation Drawer](https://reactnavigation.org/docs/drawer-navigator/).

## Ejercicios Implementados

| # | Actividad | Descripción Técnica | Documentación Base |
| :--- | :--- | :--- | :--- |
| 1 | **Drag and Drop con Rotación** | Figura arrastrable con `Gesture.Pan()` que interpola su rotación hacia la izquierda o derecha según el desplazamiento horizontal. | [GestureDetector](https://docs.swmansion.com/react-native-gesture-handler/docs/2.x/gestures/gesture-detector/) |
| 2 | **Loading Animation** | Spinner infinito con `withRepeat` y `withTiming` que inicia automáticamente al montar el componente junto a una barra de progreso animada. | [useAnimatedStyle](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle/) |
| 3 | **Multitouch Gestures** | Imagen interactiva con `Gesture.Simultaneous(pan, pinch, rotation)` para hacer zoom, mover y rotar con múltiples dedos. | [Transformations](https://docs.swmansion.com/react-native-gesture-handler/docs/guides/transformations/) |
| 4 | **Bounce Animation** | Círculo interactivo que reduce su escala al presionar (`withTiming`) y rebota a su tamaño original al soltar (`withSpring`). | [useSharedValue](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/) |
| 5 | **Animated Carousel** | Carrusel horizontal con `useAnimatedScrollHandler` e `interpolate` aplicando escala, rotación y transición de opacidad entre tarjetas. | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| 6 | **Accelerometer Animation** | Figura que detecta sacudidas físicas mediante `Accelerometer.addListener` de `expo-sensors` y ejecuta una secuencia `withSequence` de vibración. | [Expo Accelerometer](https://docs.expo.dev/versions/latest/sdk/accelerometer/) |
| 7 | **Drawer Navigation** | Menú lateral configurado con `createDrawerNavigator()` para acceder de forma independiente a cada uno de los 6 ejercicios. | [Drawer Navigator](https://reactnavigation.org/docs/drawer-navigator/) |

## Cómo Abrir y Ejecutar en Visual Studio Code

### Opción A: Usando el proyecto listo (`taller-reanimated-hibridas.zip`)

1. Descarga y descomprime el archivo `taller-reanimated-hibridas.zip` en tu computador.
2. Abre **Visual Studio Code**, ve a **Archivo > Abrir carpeta...** (`File > Open Folder...`) y selecciona la carpeta `taller-reanimated-hibridas`.
3. Abre la terminal integrada de Visual Studio Code con `Ctrl + Ñ` (o en el menú **Terminal > New Terminal**) y ejecuta:

```bash
npm install
npx expo install react-native-reanimated react-native-gesture-handler expo-sensors @react-navigation/native @react-navigation/drawer react-native-screens react-native-safe-area-context
npx expo start -c
```

### Opción B: Creándolo desde cero en la terminal de Visual Studio Code

1. Abre **Visual Studio Code** en una carpeta vacía y abre la terminal integrada (`Ctrl + Ñ`).
2. Ejecuta los siguientes comandos basados en la guía oficial de [Create a project - Expo](https://docs.expo.dev/get-started/create-a-project/):

```bash
npx create-expo-app@latest taller-reanimated-hibridas --template blank
cd taller-reanimated-hibridas
npx expo install react-native-reanimated react-native-gesture-handler expo-sensors @react-navigation/native @react-navigation/drawer react-native-screens react-native-safe-area-context
```

3. En el explorador de archivos de **Visual Studio Code**, reemplaza el contenido de `App.js` con el código incluido en este proyecto y verifica que `babel.config.js` tenga el plugin de Reanimated:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

4. Ejecuta en la terminal de Visual Studio Code:

```bash
npx expo start -c
```

5. Escanea el código QR que aparece en la terminal de Visual Studio Code con la app **Expo Go** en tu celular Android/iOS (o presiona `w` en la terminal para previsualizar en el navegador). Opcionalmente puedes instalar la extensión oficial [Expo Tools para VS Code](https://docs.expo.dev/develop/tools/) desde el panel de extensiones (`Ctrl + Shift + X`).

## Cómo Subir a GitHub desde Visual Studio Code

1. **Desde el botón gráfico de VS Code (más rápido)**:
   - Haz clic en el ícono de **Control de código fuente** (`Source Control` / `Ctrl + Shift + G`) en la barra lateral izquierda de Visual Studio Code.
   - Haz clic en **Publish to GitHub** (Publicar en GitHub) y elige **Publish to GitHub public repository** para que quede público y el docente pueda revisarlo.
2. **O desde la terminal de VS Code**:

```bash
git init
git add .
git commit -m "Implementación completa de los 7 ejercicios con React Native Reanimated y Expo"
git branch -M main
git remote add origin https://github.com/santiavalen25-web/taller-reanimated-hibridas.git
git push -u origin main
```