from django.shortcuts import render, redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets

from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework import generics
from .models import Department, Profile
from .serializers import DepartmentSerializer

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
        Profile.objects.create(user=user, role="user")
        
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

# class DepartmentListAPIView(APIView):
#     def get(self, request):
#         departments = Department.objects.all()
#         serializer = DepartmentSerializer(departments, many=True)
#         return Response(serializer.data)

class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

# from transformers import pipeline
# import re
# from sentence_transformers import SentenceTransformer, util


# sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# def analyze_sentiment(text):
#     result = sentiment_pipeline(text)[0]
#     return result['label']  # Returns 'POSITIVE' or 'NEGATIVE'


# def prioritize_petition(text):
#     text = text.lower()

#     high_urgency = [
#         "urgent", "immediate", "emergency", "danger", "accident", "life-threatening",
#         "electric shock", "fire", "sewage overflow", "flood", "collapsed"
#     ]

#     medium_urgency = [
#         "not working", "stopped", "pending", "frequent issue", "repeated complaint",
#         "delay", "inconvenient", "power cut", "garbage not collected", "water shortage"
#     ]

#     low_urgency = [
#         "suggestion", "feedback", "small issue", "slow", "not satisfied", "minor"
#     ]

#     def contains_keywords(keywords):
#         return any(re.search(r'\b' + re.escape(word) + r'\b', text) for word in keywords)

#     if contains_keywords(high_urgency):
#         return 'High'
#     elif contains_keywords(medium_urgency):
#         return 'Medium'
#     elif contains_keywords(low_urgency):
#         return 'Low'
#     else:
#         return 'Normal'



# model = SentenceTransformer('all-MiniLM-L6-v2')

# def is_duplicate(new_text, existing_texts, threshold=0.8):
#     if not existing_texts:
#         return False

#     embeddings = model.encode(existing_texts + [new_text], convert_to_tensor=True)
#     cosine_scores = util.pytorch_cos_sim(embeddings[-1], embeddings[:-1])
#     max_score = float(cosine_scores.max())

#     return max_score > threshold

# def process_petition(description, existing_petitions):
#     sentiment = analyze_sentiment(description)
#     priority = prioritize_petition(description)
#     duplicate = is_duplicate(description, existing_petitions)

#     return {
#         'sentiment': sentiment,
#         'priority': priority,
#         'is_duplicate': duplicate
#     }


# description = "There is a sewage overflow near my house and it's causing health hazards. Immediate action required!"
# existing = ["Water tank is leaking in my area.", "Garbage not collected for a week."]

# result = process_petition(description, existing)
# print(result)
