from rest_framework import serializers # type: ignore
from .models import User_tab, Friendship
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()

class FriendshipSerializer(serializers.ModelSerializer):
    # Affiche les usernames au lieu des ids
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Friendship
        fields = ['sender_username', 'receiver_username', 'status', 'created_at']

