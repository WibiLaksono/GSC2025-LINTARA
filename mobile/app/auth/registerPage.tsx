import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { registerUser } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Register() {
    const router = useRouter();
    const [form, setForm] = useState<{
        email: string;
        firstName: string;
        lastName: string;
        username:string;
        birthDate: string;
        password: string;
        confirmPassword: string;
        gender: 'LK' | 'PR';
    }>({
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
        gender: 'LK',
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };

    const validateForm = () => {
        const { email, firstName, lastName, username, birthDate, password, confirmPassword } = form;
        if (!email || !firstName || !lastName || !username || !birthDate || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required.');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);

        try {
            const { token } = await registerUser({
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                username :form.username,
                birthDate: form.birthDate,
                password: form.password,
                gender: form.gender,
            });

            // Save token to AsyncStorage
            await AsyncStorage.setItem('jwtToken', token);

            // Navigate to ./action/index
            Alert.alert('Success', 'Registration successful!');
            router.push('/action');
        } catch (error) {
            console.error('Error registering user:', error);
            Alert.alert('Error', 'Registration failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white px-6 pt-12">
            <Text className="text-xl font-semibold text-green-700 text-center mb-6">
                Tell us who you are
            </Text>

            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                placeholder="E-mail"
                value={form.email}
                onChangeText={(v) => handleChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password */}
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 mb-3">
                <TextInput
                    className="flex-1"
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={form.password}
                    onChangeText={(v) => handleChange('password', v)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
                </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 mb-3">
                <TextInput
                    className="flex-1"
                    placeholder="Confirm password"
                    secureTextEntry={!showConfirmPassword}
                    value={form.confirmPassword}
                    onChangeText={(v) => handleChange('confirmPassword', v)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} size={18} color="#888" />
                </TouchableOpacity>
            </View>

            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                placeholder="First name"
                value={form.firstName}
                onChangeText={(v) => handleChange('firstName', v)}
            />

            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                placeholder="Last name"
                value={form.lastName}
                onChangeText={(v) => handleChange('lastName', v)}
            />
            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                placeholder="Username"
                value={form.username}
                onChangeText={(v) => handleChange('username', v)}
            />

            {/* Birthdate */}
            <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                placeholder="dd/mm/yyyy"
                value={form.birthDate}
                onChangeText={(v) => handleChange('birthDate', v)}
            />

            {/* Gender Selection */}
            <View className="flex-row justify-between mb-5">
                <TouchableOpacity
                    onPress={() => handleChange('gender', 'LK')}
                    className={`flex-row items-center justify-center border rounded-lg px-4 py-3 flex-1 mr-2 ${
                        form.gender === 'LK' ? 'bg-green-700 border-green-700' : 'border-gray-300'
                    }`}
                >
                    <Icon name="mars" size={20} color={form.gender === 'LK' ? '#fff' : '#555'} />
                    <Text
                        className={`ml-2 ${form.gender === 'LK' ? 'text-white font-bold' : 'text-gray-700'}`}
                    >
                        Male
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleChange('gender', 'PR')}
                    className={`flex-row items-center justify-center border rounded-lg px-4 py-3 flex-1 ml-2 ${
                        form.gender === 'PR' ? 'bg-green-700 border-green-700' : 'border-gray-300'
                    }`}
                >
                    <Icon name="venus" size={20} color={form.gender === 'PR' ? '#fff' : '#555'} />
                    <Text
                        className={`ml-2 ${form.gender === 'PR' ? 'text-white font-bold' : 'text-gray-700'}`}
                    >
                        Female
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-green-700 rounded-lg py-4"
                disabled={loading}
            >
                <Text className="text-white text-center font-semibold text-base">
                    {loading ? 'Registering...' : 'Sign up'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
