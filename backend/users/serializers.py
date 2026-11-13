"""
Users app serializers.
"""

from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import CustomUser, UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_picture', 'date_of_birth', 'address', 'city', 'state', 'postal_code', 'country']


class CustomUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'is_active', 'profile', 'created_at']
        read_only_fields = ['id', 'created_at', 'role', 'is_active']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm', 'phone_number', 'role']

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})

        role = data.get('role', 'patient')
        if role != 'patient':
            raise serializers.ValidationError({'role': 'Public registration is limited to patient accounts.'})

        data['role'] = 'patient'
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(password=password, **validated_data)
        UserProfile.objects.get_or_create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(request=self.context.get('request'), email=data['email'], password=data['password'])
        if not user or not user.is_active:
            raise serializers.ValidationError('Invalid credentials')
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone_number']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match'})
        return data
