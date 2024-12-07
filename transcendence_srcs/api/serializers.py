from rest_framework import serializers # type: ignore
from .models import User_tab, Friendship
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()

class FriendshipSerializer(serializers.ModelSerializer):
    # Affiche les usernames au lieu des ids
    username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    sender_avatar = serializers.CharField(source='sender.avatar', read_only=True)
    receiver_avatar = serializers.CharField(source='receiver.avatar', read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'sender_username', 'sender_avatar', 'receiver_username', 'receiver_avatar', 'status', 'created_at']

