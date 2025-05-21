from rest_framework import serializers
from .models import Department, Petition
from .models import OfficerProfile

class OfficerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    department = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model = OfficerProfile
        fields = ['id', 'username', 'email', 'department']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'image_url']

class PetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Petition
        fields = "__all__"
