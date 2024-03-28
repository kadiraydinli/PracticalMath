import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation/types';
import { useIsFocused } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [highScore, setHighScore] = useState<string>('');

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const score = await AsyncStorage.getItem('score');
      setHighScore(score || '0');
    })();
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.name}>Pratik Matematik</Text>
          <Text style={styles.highScoreText}>En Yüksek Skor: {highScore}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.push('Choice');
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>Toplama için Başla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
  highScoreText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    top: 70,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: '70%',
    height: 56,
    backgroundColor: '#565695',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default HomeScreen;
