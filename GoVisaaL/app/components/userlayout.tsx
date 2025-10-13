import React, { useState, useEffect } from 'react';
import { Animated, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RouteNames = 'applied' | 'bill-list' | 'logout';

interface MenuItem {
  name: string;
  route: RouteNames;
  icon: string;
  description: string;
}

export default function UserLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [headerAnimation] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true);

  const menuItems: MenuItem[] = [
    {
      name: 'Applied Visa',
      route: 'applied',
      icon: '📋',
      description: 'View your visa applications',
    },
    {
      name: 'Invoices & Bills',
      route: 'bill-list',
      icon: '💳',
      description: 'Payment history and billing',
    },
  ];

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.replace('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const animation = Animated.timing(headerAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [headerAnimation]);

  const handleNavigation = async (routeName: RouteNames) => {
    if (routeName === 'logout') {
      try {
        // Clear all authentication data
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // Redirect to login screen
        router.replace('/');
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect even if storage clearing fails
        router.replace('/');
      }
    } else {
      router.push(`../components/${routeName}`);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Animated.View 
        className="w-full pt-20 pb-6 px-6"
        style={{
          transform: [{
            translateY: headerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
          opacity: headerAnimation
        }}
      >
        <View className="items-center">
          <View className="flex-row items-baseline">
            <Text className="text-4xl font-extrabold text-blue-600">Go</Text>
            <Text className="text-4xl font-extrabold text-blue-800">Vissa</Text>
          </View>
          <View className="h-[3px] w-20 bg-blue-400 rounded-full mt-3 mb-4 opacity-90" />
          <Text className="text-sm text-gray-500 tracking-wider">YOUR GATEWAY TO THE WORLD</Text>
        </View>
      </Animated.View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {children || (
          <View className="pt-2">
            <View className="items-center mb-14">
              <Text className="text-2xl font-light text-gray-900 mb-3">Welcome Back</Text>
              <Text className="text-[15px] text-gray-500 text-center px-6 leading-6">
                Ready to explore the world? Your visa journey starts here.
              </Text>
            </View>
            
            <View className="mb-16">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="mb-5 p-6 rounded-2xl bg-white flex-row items-center border border-gray-100"
                  activeOpacity={0.92}
                  onPress={() => handleNavigation(item.route)}
                  style={{
                    shadowColor: '#0001',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.03,
                    shadowRadius: 6,
                    elevation: 2
                  }}
                >
                  <View className="w-12 h-12 rounded-xl bg-gray-50 items-center justify-center mr-5">
                    <Text className="text-2xl">{item.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-[17px] font-medium text-gray-900 mb-1">{item.name}</Text>
                    <Text className="text-sm text-gray-500">{item.description}</Text>
                  </View>
                  <Text className="text-xl text-gray-300 ml-2">→</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View className="mb-14">
              <Text className="text-[17px] font-medium text-gray-900 mb-7 text-center">QUICK TIPS</Text>
              
              <View className="space-y-4 px-1">
                <View className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <Text className="text-gray-700 text-[15px] leading-[22px]">
                    <Text className="text-lg mr-3">💡</Text>
                    Prepare all required documents before starting your application to avoid delays
                  </Text>
                </View>
                
                <View className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <Text className="text-gray-700 text-[15px] leading-[22px]">
                    <Text className="text-lg mr-3">⚡</Text>
                    Processing times range from 3-15 business days depending on destination
                  </Text>
                </View>
                
                <View className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <Text className="text-gray-700 text-[15px] leading-[22px]">
                    <Text className="text-lg mr-3">🔒</Text>
                    Bank-grade encryption protects all your personal information
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="mb-12 p-5 rounded-xl items-center border border-gray-200 bg-white"
              onPress={() => handleNavigation('logout')}
              activeOpacity={0.9}
              style={{
                shadowColor: '#0001',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 6,
              }}
            >
              <Text className="text-gray-600 font-medium tracking-wider">LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}