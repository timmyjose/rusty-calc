/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet, StatusBar } from 'react-native'
import { execute } from 'react-native-rust-bridge'

const App = () => {
 const [x, setX] = useState(0)
 const [y, setY] = useState(0)
 const [result, setResult] = useState(0)

 const handleAdd = async () => {
   const add_cmd = JSON.stringify({
     Add: {
      x,
      y
     }
   })

   const sum = JSON.parse(await execute(add_cmd))
   setResult(sum.res)
 }

 const handleSub = async () => {
   const sub_cmd = JSON.stringify({
     Sub: {
      x,
      y
     }
   })

   const diff = JSON.parse(await execute(sub_cmd))
   setResult(diff.res)
 }
 const handleMul = async () => {
   const mul_cmd = JSON.stringify({
     Mul: {
      x,
      y
     }
   })

   const prod = JSON.parse(await execute(mul_cmd))
   setResult(prod.res)
 }
 const handleDiv = async () => {
   const div_cmd = JSON.stringify({
     Div: {
      x,
      y
     }
   })

   const quot = JSON.parse(await execute(div_cmd))
   setResult(quot.res)
 }


 return (
   <View style={styles.container}>
     <TextInput
       style={styles.input}
       placeholder="Enter first number"
       keyboardType='numeric'
       value={x.toString()}
       onChangeText={(text: string) => setX(parseFloat(text))}
     />

     <TextInput
       style={styles.input}
       placeholder="Enter second number"
       value={y.toString()}
       onChangeText={(text: string) => setY(parseFloat(text))}
     />

     <View style={styles.buttonContainer}>
       <Button title="Add" onPress={async() => await handleAdd()} />
       <Button title="Subtract" onPress={async() => await handleSub()} />
       <Button title="Multiply" onPress={async() => await handleMul()} />
       <Button title="Divide" onPress={async() => await handleDiv()} />
     </View>

     <Text style={styles.resultText}>Result: {result}</Text>
   </View>
 )
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 resultText: {
   fontSize: 20,
   marginBottom: 10,
 },
 input: {
   height: 40,
   width: '80%',
   borderColor: 'gray',
   borderWidth: 1,
   marginBottom: 10,
   paddingHorizontal: 10,
 },
 buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   width: '80%',
 },
})

export default App