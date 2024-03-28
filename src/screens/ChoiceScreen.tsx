import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Choice'>;

type ChooseType = { value: number; answer: boolean; index?: number };
type ChooseTypeArray = ChooseType[];

const ChoiceScreen: React.FC<Props> = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState<ChooseTypeArray>([]);
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<ChooseType | null>(null);

  const animatedBorder = useRef(new Animated.Value(0)).current;

  const playAnimation = () => {
    Animated.timing(animatedBorder, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(animatedBorder, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setSelectedChoice(null);
        });
      }, 100);
    });
  };

  // Fonksiyon: Doğru ve yanlış sayıları rastgele sırala
  function shuffleChoices(numbers: ChooseTypeArray) {
    for (let i = numbers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = numbers[i];
      numbers[i] = numbers[j];
      numbers[j] = temp;
    }
    return numbers;
  }

  function generateRandomChoice(mainNumber: number, range: number) {
    var numbers: ChooseTypeArray = [];
    for (let i = 0; i < 3; i++) {
      let random =
        Math.floor(Math.random() * range) +
        (mainNumber - Math.floor(range / 2));
      numbers.push({
        value: random === mainNumber ? random + 5 : random,
        answer: false,
      });
    }
    return numbers;
  }

  const questionGenerator = () => {
    const random1 = Math.floor(Math.random() * 100);
    const random2 = Math.floor(Math.random() * 100);
    const answer = random1 + random2;

    setQuestion(`${random1} + ${random2}`);

    const incorrectAnswers = generateRandomChoice(answer, 50);
    const answers = shuffleChoices([
      ...incorrectAnswers,
      { value: answer, answer: true },
    ]);

    setChoices(answers);
  };

  useEffect(() => {
    questionGenerator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChoose = (index: number) => {
    const selectedAnswer = choices[index];
    setSelectedChoice({ ...selectedAnswer, index });
    if (selectedAnswer.answer) {
      // Alert.alert('DOĞRU');
      setScore(score + 1);
    } else {
      // Alert.alert('YANLIŞ');
      if (score > 0) {
        setScore(score - 1);
      }
    }
    playAnimation();
    questionGenerator();
  };

  const onDone = async () => {
    const totalScore = await AsyncStorage.getItem('score');
    const newScore = Number(totalScore) > score ? Number(totalScore) : score;
    AsyncStorage.setItem('score', newScore.toString());

    navigation.goBack();
  };

  const animatedBorderStyle = {
    borderColor: animatedBorder.interpolate({
      inputRange: [0, 1],
      outputRange: ['#565695', selectedChoice?.answer ? 'green' : 'red'],
    }),
  };

  const button = (index: number) => (
    <Animated.View
      style={[
        styles.buttonView,
        selectedChoice?.index === index ? animatedBorderStyle : {},
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChoose(index)}
        style={styles.button}>
        <Text style={styles.buttonText}>{choices[index]?.value}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Skor: {score}</Text>
        <Text onPress={onDone} style={styles.scoreText}>
          Bitir
        </Text>
      </View>
      <View style={styles.questionView}>
        <Text style={styles.questionText}>{question}</Text>
      </View>
      <View style={styles.choicesView}>
        <View style={styles.choiceRow}>
          {button(0)}
          {button(1)}
        </View>
        <View style={styles.choiceRow}>
          {button(2)}
          {button(3)}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#343477',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  scoreText: {
    fontSize: 20,
    color: 'white',
  },
  questionView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 60,
    color: '#8080B3',
  },
  choicesView: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  choiceRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  buttonView: {
    flex: 1,
    backgroundColor: '#565695',
    borderRadius: 8,
    borderWidth: 6,
    borderColor: '#565695',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default ChoiceScreen;
