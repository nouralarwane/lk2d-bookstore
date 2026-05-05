from rest_framework import serializers
from livres.models import Book, Auteur, Emprunt, Profile, Panier, Notification
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from datetime import timedelta

 
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class AuteurSerializer(serializers.ModelSerializer):
     class Meta:
        model = Auteur
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only= True, style={"input_type": "password"})
    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

    def update(self, instance, validated_data):
        username = validated_data.get("username")
        email = validated_data.get("email")
        instance.username = username
        instance.email = email
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        # style={"input_type": "password"},
        # trim_whitespace=False,
        required=True
        )
    password = serializers.CharField(style={"input_style" : "password"},required=True)

    class Meta:
        model = User
        fields = ["username", "password"]
        
    def validate(self, data):
        user = authenticate(username=data['email'], password=data['username'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Identifiants invalides")
    


class EmpruntSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emprunt
        fields = ["id","user", "book","date_emprunt", "date_retour","status"]
        read_only_fields = ["date_emprunt", "date_retour"]

    
    def create(self, validated_data):
        emprunt = Emprunt.objects.create(**validated_data)
        emprunt.date_retour = emprunt.date_emprunt + timedelta(weeks=3)
        emprunt.save()
        return emprunt


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'profile', 'role', 'user']
        extra_kwargs = {
            'profile': {'required': False}  # Rend le champ optionnel
        }
    
    
class Profil(serializers.Serializer):
    username = serializers.CharField()
    profile = serializers.ImageField()
    email = serializers.EmailField()
    password = serializers.CharField()


class PanierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panier
        fields = "__all__"


class NotifificationSeriaizer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
