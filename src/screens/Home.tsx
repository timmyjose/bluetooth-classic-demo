import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { View, StyleSheet, Button } from 'react-native'
import { RootStackParamsList } from '../App'

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamsList>>()

  return (
    <View style={styles.container}>
      <Button title='Demo' onPress={() => navigation.navigate('Demo')} />
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

export default Home
