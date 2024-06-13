import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native'
import { isEmulator } from 'react-native-device-info'

export default function EmulatorCheck() {
  const navigation = useNavigation()

  const [isEmulatorOrSimulator, setIsEmulatorOrSimulator] = useState<boolean>(false)

  useEffect(() => {
    async function checkWhetherEmulatorOrSimulator() {
      setIsEmulatorOrSimulator(await isEmulator())
    }

    checkWhetherEmulatorOrSimulator()
  }, [])

  return (
    <View>
      <Button title='Go Back' onPress={() => navigation.goBack()} />
      <Text>Are we running in an Emulator/Simulator? {isEmulatorOrSimulator.toString()}</Text>
    </View>
  )
}