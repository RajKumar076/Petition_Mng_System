from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import JsonResponse

# Initially redirect to the landing page in react
def landing_redirect(request):
    return redirect("http://localhost:3000/")

# Signup API View
class SignUpView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if not username or not password or not email:
            return Response({"error": "All fields are required!"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)  # Store hashed password
        )
        
        user.save()
        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)

# Login API View
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({"error": "Both username and password are required!"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_superuser:
                role = "admin"
            elif hasattr(user, 'profile') and user.profile.role:
                role = user.profile.role  # Assuming a `role` field in profile
            else:
                role = "user"  # Default if no role field

            return JsonResponse({
                "message": f"Login successful as {role}",
                "role": role
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

