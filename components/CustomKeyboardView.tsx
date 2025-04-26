import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { ReactNode } from 'react';

const ios = Platform.OS == "ios";

interface CustomKeyboardViewProps {
  children: ReactNode;
}

export default function CustomKeyboardView({ children }: CustomKeyboardViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={ios ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}