import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function Calculator() {
  const [currentValue, setCurrentValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (error) setError(null);
    setCurrentValue(prev => 
      prev === '0' || (operator && previousValue === null) ? num : prev + num
    );
    if (operator && previousValue === null) {
      setPreviousValue(currentValue);
    }
  };

  const handleOperator = (op: string) => {
    if (currentValue === '') return;
    if (operator !== null && previousValue !== null) {
      const result = calculate();
      if (result === null) return;
      setPreviousValue(result);
    } else {
      setPreviousValue(currentValue);
    }
    setOperator(op);
    setCurrentValue('');
  };

  const calculate = () => {
    if (previousValue === null || operator === null) return null;
    
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);
    
    if (isNaN(prev)) return null;
    if (isNaN(current)) return null;

    let result: number;
    switch (operator) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/':
        if (current === 0) {
          setError('Cannot divide by zero');
          return null;
        }
        result = prev / current;
        break;
      default: return null;
    }
    return result.toString();
  };

  const handleEquals = () => {
    if (operator === null || previousValue === null) return;
    
    const result = calculate();
    if (result === null) return;

    setCurrentValue(result);
    setPreviousValue(null);
    setOperator(null);
  };

  const handleClear = () => {
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
    setError(null);
  };

  const handleBackspace = () => {
    setCurrentValue(prev => {
      if (error) return '0';
      return prev.length > 1 ? prev.slice(0, -1) : '0';
    });
  };

  const handleDecimal = () => {
    if (error) return;
    if (!currentValue.includes('.')) {
      setCurrentValue(prev => prev + '.');
    }
  };

  const displayValue = error || currentValue;

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{displayValue}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <View style={styles.row}>
          <Button label="C" isOperator onPress={handleClear} />
          <Button label="←" isOperator onPress={handleBackspace} />
          <Button label="/" isOperator onPress={() => handleOperator('/')} />
          <Button label="*" isOperator onPress={() => handleOperator('*')} />
        </View>
        <View style={styles.row}>
          <Button label="7" onPress={() => handleNumber('7')} />
          <Button label="8" onPress={() => handleNumber('8')} />
          <Button label="9" onPress={() => handleNumber('9')} />
          <Button label="-" isOperator onPress={() => handleOperator('-')} />
        </View>
        <View style={styles.row}>
          <Button label="4" onPress={() => handleNumber('4')} />
          <Button label="5" onPress={() => handleNumber('5')} />
          <Button label="6" onPress={() => handleNumber('6')} />
          <Button label="+" isOperator onPress={() => handleOperator('+')} />
        </View>
        <View style={styles.row}>
          <Button label="1" onPress={() => handleNumber('1')} />
          <Button label="2" onPress={() => handleNumber('2')} />
          <Button label="3" onPress={() => handleNumber('3')} />
          <Button label="=" isOperator onPress={handleEquals} />
        </View>
        <View style={styles.row}>
          <Button label="0" wide onPress={() => handleNumber('0')} />
          <Button label="." onPress={handleDecimal} />
        </View>
      </View>
    </View>
  );
}

const Button = ({ label, wide, isOperator, onPress }: any) => (
  <TouchableOpacity
    style={[
      styles.button,
      wide && styles.wideButton,
      isOperator ? styles.operatorButton : styles.numberButton,
    ]}
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    justifyContent: 'flex-end',
  },
  display: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  displayText: {
    color: 'white',
    fontSize: 60,
    minHeight: 80,
  },
  buttonsContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wideButton: {
    flex: 2,
    aspectRatio: undefined,
  },
  numberButton: {
    backgroundColor: '#333',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 32,
  },
});