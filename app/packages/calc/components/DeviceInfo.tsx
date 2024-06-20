import { useNavigation } from '@react-navigation/native'
import { Button, useWindowDimensions, PixelRatio, Platform, StyleSheet, Text, View } from 'react-native'
import * as Application from 'expo-application'

export default function DeviceInfo() {
  const navigation = useNavigation()

  const { height, width, scale, fontScale } = useWindowDimensions()

  return (
    <View style={styles.container}>
      <Text>Screen width: {width}</Text>
      <Text>Screen height: {height}</Text>
      <Text>Screen scale: {scale}</Text>
      <Text>Screen pixel ratio: {fontScale}</Text>
      <Text>PixelRatio screen width: {PixelRatio.getPixelSizeForLayoutSize(width)}</Text>
      <Text>PixelRatio screen height: {PixelRatio.getPixelSizeForLayoutSize(height)}</Text>
      { Platform.OS === 'android' && <Text>Manufacturer: {Platform.constants.Manufacturer} </Text>}
      { Platform.OS === 'android' && <Text>Brand: {Platform.constants.Brand} </Text>}
      { Platform.OS === 'android' && <Text>Model: {Platform.constants.Model} </Text>}
      { Platform.OS === 'android' && <Text>Release: {Platform.constants.Release} </Text>}
      { Platform.OS === 'android' && <Text>Version: {Platform.constants.Version} </Text>}
      <Text>Native Build Version: {Application.nativeBuildVersion}</Text>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
