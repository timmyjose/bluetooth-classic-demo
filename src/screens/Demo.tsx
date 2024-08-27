import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { View, Text, StyleSheet, Button, PermissionsAndroid, Alert, ScrollView, FlatList } from 'react-native'
import { RootStackParamsList } from '../App'
import React, { useEffect, useState } from 'react'
import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic'

type ItemProps = { title: any}

const Item = ({ title }: ItemProps) => {
  return (<View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>)
}

const Demo = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  const [hasBluetooth, setHasBluetooth] = useState<boolean>(false)
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>(false)
  const [discovering, setDiscovering] = useState<boolean>(false)
  const [devices, setDevices] = useState<BluetoothDevice[] | null>(null)

  useEffect(() => {
    const checkIfBlueTooth = async () => {
      const available = await RNBluetoothClassic.isBluetoothAvailable()
      setHasBluetooth(available)
    }
    checkIfBlueTooth()
  }, [])

  useEffect(() => {
    const checkIfBluetoothEnabled = async () => {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled()
      setBluetoothEnabled(enabled)
    }
    checkIfBluetoothEnabled()
  }, [])

  const requestAccessFineLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Access fine location required for discovery',
        message:
          'In order to perform discovery, you must enable/allow ' +
          'fine location access.',
        buttonNeutral: 'Ask Me Later"',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED
  };
  
  const startDiscovery = async () => {
    try {
      const granted = await requestAccessFineLocationPermission()
  
      if (!granted) {
        throw new Error(`Access fine location was not granted`)
      }

      setDiscovering(true)
  
      try {
        const unpaired = await RNBluetoothClassic.startDiscovery()
        Alert.alert(`Found ${unpaired.length} unpaired devices.`)
        console.log(JSON.stringify(unpaired))
        setDevices(unpaired)
      } finally {
        setDiscovering(false)
      }      
    } catch (err: any) {
      Alert.alert(err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Button title='Home' onPress={() => navigation.goBack()} />
      <Text>Is Bluetooth available? {hasBluetooth.toString()}</Text>
      <Text>Is Bluetooth enabled? {bluetoothEnabled.toString()}</Text>
      <Button title='Discover' onPress={() => startDiscovery()} />
      {discovering && (<Text>Discovering devices...</Text>)}
      {!discovering && (
        <FlatList
          data={devices}
          renderItem={({ item }) => <Item title={item.name} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20
  }
})

export default Demo
