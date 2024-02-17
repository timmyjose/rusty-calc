import { Alert, Button, Text, TextInput, View } from "react-native"
import { CloudStorage, CloudStorageScope, useIsCloudAvailable } from "react-native-cloud-storage"
import { useNavigation } from '@react-navigation/native'
import { useState } from "react";

export default function CloudStore() {
    const cloudAvailable = useIsCloudAvailable()
    const [contents, setContents] = useState<string>('')
    const [outputFile, setOutputFile] = useState<string>('')
    const [inputFile, setInputFile] = useState<string>('')

    const navigation = useNavigation()

    const writeToCloud = async () => {
        await CloudStorage.writeFile(outputFile, contents, CloudStorageScope.AppData)
        Alert.alert('Wrote file to cloud')
    }

    const readFromCloud = async () => {
        const contents = await CloudStorage.readFile(inputFile, CloudStorageScope.AppData)
        Alert.alert(`Read file from cloud with contents: ${contents}`)
    }

    return (
        <View>
            {cloudAvailable ? (
                <>
                    <TextInput
                        value={contents}
                        onChangeText={text => setContents(text)}
                        placeholder='Enter some text here'
                    />
                    <TextInput
                        value={outputFile}
                        onChangeText={ofile => setOutputFile(ofile)}
                        placeholder='Enter output file'
                    />
                    <Button onPress={writeToCloud} title='Write file to cloud'/>
                    <TextInput
                        value={inputFile}
                        onChangeText={ifile => setInputFile(ifile)}
                        placeholder='Enter input file'
                    />
                    <Button onPress={readFromCloud} title='Read from cloud'/>
                </>
            ) : (
                <Text>Cloud Storage is not available. Are you logged in?</Text>
            )}
            <Button 
              title='Go back'
              onPress={() => navigation.goBack()}
            />
        </View>
    )
}