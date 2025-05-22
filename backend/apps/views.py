from django.shortcuts import render, redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets

from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework import generics


from .models import Department, Profile, Petition, OfficerProfile, AIAnalysedPetition
from .serializers import DepartmentSerializer, PetitionSerializer, OfficerProfileSerializer
from .petition_analysis import PetitionAnalyzer 
from django.shortcuts import get_object_or_404
from django.utils import timezone

from django.db.models import Count
from django.db.models import Case, When, Value, IntegerField
from django.utils import timezone
from datetime import timedelta

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
        
        print(username, password)   
        if not username or not password:
            return Response({"error": "Both username and password are required!"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        print(user)
        if user is not None:
            # Generate tokens
            refresh = RefreshToken.for_user(user)

            if user.is_superuser:
                role = "admin"
            # elif hasattr(user, 'officerprofile'):
            elif OfficerProfile.objects.filter(user=user).exists():
                role = "officer" 
            else:
                role = "user"  # Default if no role field

            return JsonResponse({
                "message": f"Login successful as {role}",
                "role": role,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=200)
        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

class DepartmentListCreateView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only allow admin to add officer
def add_officer(request):
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        department_id = request.data.get('department')

        if not all([name, email, password, department_id]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=name, email=email).exists():
            return Response({"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=name, email=email, password=password, first_name=name)
        department = Department.objects.get(id=department_id)

        OfficerProfile.objects.create(user=user, department=department)

        Profile.objects.create(user=user, role='officer', department=department)

        return Response({'message': 'Officer created'}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
# @permission_classes([AllowAny])
def submit_petition(request, department_name):
    
    user = request.user
    department = get_object_or_404(Department, name=department_name)

    data = request.data.copy()

    data["user"] = user.id
    data["department"] = department.id


    serializer = PetitionSerializer(data=data)
    
    if serializer.is_valid():
        petition = serializer.save()

        # Analyze petition automatically

        analyzer = PetitionAnalyzer()
        description = petition.description

        # Get existing petition descriptions (excluding the current one to avoid self-match)
        existing_texts = list(
            Petition.objects.exclude(id=petition.id).values_list('description', flat=True)
        )

        sentiment = analyzer.analyze_sentiment(description)
        priority = analyzer.prioritize_petition(description)
        is_spam = analyzer.is_duplicate(description, existing_texts)

        #To mark it as per the sentiment of the text
        sentiment = (
            'Positive' if sentiment == 'POSITIVE' else
            'Negative' if sentiment == 'NEGATIVE' else
            'Neutral'
        )

        # Save to AnalysedPetition table
        AIAnalysedPetition.objects.create(
            petition=petition,
            priority=priority,
            sentiment=sentiment,
            is_spam=is_spam
        )

        # Auto-reject if duplicate
        if is_spam:
            petition.status = 'rejected'
            petition.remarks = 'Duplicate Petition'
            petition.save()

        return Response({
            "message": "Petition submitted and analyzed successfully.",
            "analysis": {
                "priority": priority,
                "sentiment": sentiment,
                "is_spam": is_spam
            }
        }, status=201)
    
    print(serializer.errors)  # Added for debugging
    return Response(serializer.errors, status=400)

# Officer view to fetch 5 high-priority petitions
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def officer_pending_petitions(request):
    officer = request.user
    department = officer.officerprofile.department

    petitions = Petition.objects.filter(
        department=department,
        status='pending',
        aianalysedpetition__priority='High',
        aianalysedpetition__is_spam=False
    ).order_by('date_submitted')[:5]

    data = []
    for petition in petitions:
        ai = petition.aianalysedpetition
        data.append({
            "id": petition.id,
            "title": petition.title,
            "description": petition.description,
            "proof_file": petition.proof_file.url if petition.proof_file else None,
            "date_submitted": petition.date_submitted,
            "priority": ai.priority,
            "sentiment": ai.sentiment,
            "status": petition.status,
            "remarks": petition.remarks,
        })

    return Response(data)

# Officer updates petition status and remarks
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def officer_update_petition(request, petition_id):
    try:
        petition = Petition.objects.get(id=petition_id)
    except Petition.DoesNotExist:
        return Response({"error": "Petition not found"}, status=404)

    status = request.data.get("status")
    remarks = request.data.get("remarks", "")

    if status not in ["resolved", "rejected"]:
        return Response({"error": "Invalid status"}, status=400)

    petition.status = status
    petition.remarks = remarks
    petition.date_resolved = timezone.now()
    petition.save()

    return Response({"message": f"Petition marked as {status}."})

@api_view(['GET'])
def get_departments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

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

# Use a smaller conversational model
# chatbot_pipeline = pipeline("text-generation", model="microsoft/DialoGPT-small")

# @api_view(['POST'])
# def chatbot_view(request):
#     user_message = request.data.get('message', '')
#     # DialoGPT expects a prompt and returns generated text
#     result = chatbot_pipeline(user_message, max_length=100, pad_token_id=50256)
#     reply = result[0]['generated_text']
#     keywords = []
#     return Response({'reply': reply, 'keywords': keywords})


@api_view(['POST'])
def chatbot_view(request):
    user_message = request.data.get('message', '').lower().strip()
    keywords = []

    # Category-wise keyword responses
    keyword_responses = [
        # --- Greetings & Politeness ---
        (["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "hai", "hii", "helo"], 
         "Hello! How may I assist you today with your grievance or any information regarding the system?"),
        (["good night"], "Good night! If you have any questions, feel free to ask anytime."),
        (["thank you", "thanks", "thankyou", "thx", "appreciate", "thank u", "thank-you"], "You're welcome! If you need further assistance, just ask."),
        (["how are you", "how r u", "how's it going", "how do you do", "how are u", "how are you doing"], "I'm here to help you with your grievances. How can I help you today?"),
        (["who are you", "what are you", "your name", "about you", "who is this", "who am i chatting with"], "I am your Petition Assistant, here to help you with the grievance management system."),
        (["help", "assist", "support", "need help", "can you help", "i need help", "help me", "assistance"], "Sure! Please tell me your issue or question regarding the grievance system."),

        # --- System Working & Flow ---
        (["how does the system work", "system working", "how it works", "explain system", "system flow", "how does this work", "how does this site work", "how does this application work", "how does this portal work"], 
         "Our Grievance Management System allows you to submit complaints, track their status, and receive updates. After you submit a complaint, it is assigned to the relevant department and officer for resolution. You can monitor progress and provide feedback after resolution."),
        (["process flow", "complaint flow", "steps involved", "complaint process", "how to use", "how to proceed", "how to start", "how to raise issue", "how to raise complaint", "how to file complaint", "how to register complaint", "how to submit complaint"], 
         "The typical flow: 1) Submit your complaint, 2) It is assigned to a department/officer, 3) Officer reviews and resolves, 4) You receive updates, 5) You can provide feedback or escalate if not resolved."),
        (["how is my problem solved", "how do you solve", "resolution process", "how will you resolve", "how will my complaint be solved", "how will my issue be resolved", "how do you handle complaints", "how do you handle issues"], 
         "Once you submit a complaint, the assigned officer investigates and takes necessary action. You will be notified about every update. If the issue is not resolved, you can escalate it for higher attention."),
        (["how long to solve", "time taken", "resolution time", "how much time", "when will it be solved", "how long does it take", "how many days", "how many hours", "how fast", "how soon", "expected time", "expected resolution"], 
         "Most complaints are resolved within 7 working days. Urgent issues are prioritized and may be resolved sooner. You can track the status anytime in your dashboard."),

        # --- Navigation ---
        (["home", "homepage", "main page", "landing", "go home", "go to home", "go to homepage"], "Click the 'Home' button in the navigation bar to return to the homepage."),
        (["dashboard", "my dashboard", "user dashboard", "go to dashboard", "open dashboard"], "Access your dashboard by clicking your username at the top right and selecting 'Dashboard'."),
        (["profile", "my profile", "edit profile", "update profile", "user profile", "profile page", "profile section"], "To view or edit your profile, click your username at the top right and select 'Profile'."),
        (["settings", "account settings", "preferences", "account preferences", "settings page"], "Account settings and preferences are available in your profile section."),
        (["notifications", "alerts", "email notifications", "notification settings", "manage notifications", "notification preference"], "Manage your notification preferences in your profile settings."),
        (["logout", "log out", "sign out", "log me out", "exit", "end session"], "To log out, click the 'Logout' button on the top right of your dashboard."),
        (["login", "log in", "sign in", "log into account", "login page", "login section"], "Click the 'Login' button and enter your credentials."),
        (["register", "sign up", "signup", "create account", "new account", "registration", "register account"], "Click 'Sign Up' on the homepage and fill in your details to register."),
        (["delete account", "remove account", "close account", "delete my account", "remove my account", "close my account"], "Please contact support to request account deletion."),
        (["language", "change language", "language support", "switch language", "select language"], "Currently, the system supports English language only."),
        (["browser", "supported browser", "browser support", "which browser", "browser compatibility"], "Our system works best on the latest versions of Chrome, Firefox, or Edge."),
        (["app", "mobile app", "android", "ios", "is there an app", "mobile application"], "Currently, our service is available through the website only."),

        # --- Authentication & Profile ---
        (["change password", "update password", "reset password", "forgot password", "password change", "password reset", "forgot my password", "lost password"], "Go to your profile and select 'Change Password' or use 'Forgot Password' on the login page."),
        (["change email", "update email", "edit email", "email address", "change my email", "update my email", "edit my email"], "You can update your email address in your profile section."),
        (["change phone", "update phone", "edit phone", "mobile number", "phone number", "change my phone", "update my phone", "edit my phone"], "You can update your phone number in your profile section."),
        (["change address", "update address", "edit address", "address", "change my address", "update my address", "edit my address"], "Update your address in the 'Profile' section."),
        (["change username", "edit username", "username", "change my username", "update my username"], "Username cannot be changed. Please contact support for special requests."),
        (["profile picture", "change photo", "update photo", "change profile picture", "update profile picture", "edit profile picture"], "You can update your profile picture in the profile section."),

        # --- Complaint/Grievance Process ---
        (["submit complaint", "file complaint", "register complaint", "new complaint", "raise issue", "how to complain", "how to submit a complaint", "how to file a complaint", "how to register a complaint", "complain", "complaint", "raise complaint", "submit a complaint", "file a complaint", "register a complaint"], 
         "To submit a complaint, log in and go to the 'Complain' section. Fill out the form and submit."),
        (["track complaint", "complaint status", "check complaint", "track grievance", "my complaints", "complaint progress", "track my complaint", "track my issue", "track status", "check status", "status of complaint", "status of my complaint"], 
         "Track your complaint in the 'Track Grievance' section of your dashboard."),
        (["edit complaint", "modify complaint", "update complaint", "edit my complaint", "modify my complaint", "update my complaint"], 
         "Edit your complaint before it is processed by going to 'Track Grievance' and selecting 'Edit'."),
        (["withdraw complaint", "cancel complaint", "remove complaint", "withdraw my complaint", "cancel my complaint", "remove my complaint"], 
         "Withdraw your complaint from the 'Track Grievance' section if it is not yet resolved."),
        (["escalate complaint", "not resolved", "pending complaint", "complaint not solved", "escalate my complaint", "escalate issue", "not solved", "not fixed", "not resolved yet"], 
         "If your complaint is not resolved, escalate it from the 'Track Grievance' section."),
        (["complaint history", "previous complaints", "old complaints", "my complaint history", "my previous complaints"], 
         "Your complaint history is available in the 'Track Grievance' section."),
        (["complaint feedback", "give feedback", "rate complaint", "feedback on complaint", "feedback for complaint"], 
         "Provide feedback after your complaint is resolved or through the 'Contact Us' page."),
        (["complaint survey", "survey link", "survey for complaint", "feedback survey"], "Survey links are sent after complaint resolution."),
        (["complaint analytics", "complaint statistics", "complaint trends", "analytics", "statistics", "trends"], 
         "Analytics, statistics, and trends are available in your dashboard."),
        (["complaint summary", "complaint details", "complaint info", "summary of complaint", "details of complaint"], 
         "View all details and summary of your complaint in the 'Track Grievance' section."),
        (["complaint id", "complaint reference", "reference number", "complaint number", "complaint code"], 
         "Your complaint ID/reference number is shown in the complaint details and confirmation page."),
        (["complaint date", "complaint time", "date of complaint", "time of complaint"], 
         "Date and time of submission are shown in the complaint details."),
        (["complaint type", "select type", "type of complaint", "choose type"], 
         "Select the complaint type when submitting your complaint."),
        (["complaint department", "assign department", "department for complaint", "choose department"], 
         "Select the department most relevant to your issue. If unsure, contact support."),
        (["complaint officer", "assigned officer", "officer contact", "officer for complaint"], 
         "Officer details are shown in the complaint details page."),
        (["complaint location", "update location", "location of complaint", "location issue"], 
         "Update your location in your profile or specify it in your complaint."),
        (["complaint status history", "status history", "history of status"], 
         "Status history is available in the complaint details."),
        (["pending actions", "completed actions", "actions taken", "pending steps", "completed steps"], 
         "Pending and completed actions are listed in the complaint details."),
        (["complaint closure", "close complaint", "close my complaint", "complaint closed"], 
         "Closure information is available in the complaint details. You can close your complaint after resolution."),
        (["reopen complaint", "open closed complaint", "reopen my complaint", "open my closed complaint"], 
         "Contact support to request reopening a closed complaint."),
        (["duplicate complaint", "same complaint", "duplicate issue", "already complained"], 
         "If you think your complaint is a duplicate, check your complaint history."),
        (["suggestion", "give suggestion", "feedback", "suggestion for system", "suggestion for improvement"], 
         "We welcome your suggestions! Please use the 'Feedback' or 'Contact Us' page."),
        (["urgent complaint", "high priority", "immediate attention", "urgent issue", "urgent problem"], 
         "Select 'High Priority' when submitting your complaint for urgent issues."),
        (["slow response", "delay", "late response", "slow reply", "delayed response"], 
         "We apologize for the delay. You can escalate your complaint if it is taking too long."),
        (["fast response", "quick response", "immediate response", "fast reply", "quick reply"], 
         "We aim to resolve your complaints as quickly as possible. For urgent issues, mark as 'High Priority'."),
        (["attach document", "upload file", "add photo", "add image", "add picture", "attach file", "upload document", "add attachment"], 
         "Upload supporting documents such as photos or receipts in the complaint form."),
        (["video upload", "add video", "upload video", "attach video"], 
         "Currently, video uploads are not supported."),
        (["download receipt", "print receipt", "get receipt", "download my receipt", "print my receipt"], 
         "After submitting, download or print your complaint receipt from the confirmation page."),
        (["download complaint", "get complaint copy", "print complaint", "download my complaint", "print my complaint"], 
         "Download or print your complaint details from the complaint page."),
        (["open complaint", "my open complaints", "list open complaints"], "Open complaints are listed in your 'Track Grievance' section."),
        (["closed complaint", "my closed complaints", "list closed complaints"], "Closed complaints are archived in your 'Track Grievance' section."),
        (["pending", "pending complaint", "pending issue"], "If your complaint is pending, please wait for the officer to review it or escalate if needed."),
        (["resolved", "solved", "fixed", "complaint resolved", "issue resolved", "problem solved"], "If your complaint is resolved, you can close it or provide feedback."),
        (["logs", "complaint logs", "system logs"], "Logs are available in the complaint details page."),
        (["remarks", "complaint remarks", "remarks for complaint"], "Remarks are visible in the complaint details page."),
        (["timeline", "complaint timeline", "timeline of complaint"], "Timeline is shown in the complaint details page."),
        (["actions", "complaint actions", "actions for complaint"], "Actions taken are listed in the complaint details."),
        (["assigned date", "assigned time", "date assigned", "time assigned"], "Assigned date and time are shown in the complaint details."),
        (["assigned status"], "Assigned status is shown in the complaint details."),
        (["assigned remarks"], "Assigned remarks are shown in the complaint details."),
        (["assigned actions"], "Assigned actions are listed in the complaint details."),
        (["assigned progress"], "Assigned progress is shown in the complaint details."),
        (["assigned feedback"], "Assigned feedback is shown in the complaint details."),
        (["assigned survey"], "Assigned survey is shown in the complaint details."),
        (["assigned analytics"], "Assigned analytics are shown in the complaint details."),
        (["assigned statistics"], "Assigned statistics are shown in the complaint details."),
        (["assigned trends"], "Assigned trends are shown in the complaint details."),
        (["assigned summary"], "Assigned summary is shown in the complaint details."),

        # --- Issue Categories ---
        (["water issue", "water supply", "no water", "water leakage", "water problem", "water complaint"], 
         "For water-related grievances, please select 'Water Supply' as the department when submitting your complaint."),
        (["electricity issue", "power cut", "no electricity", "electric problem", "electricity complaint", "electricity problem"], 
         "For electricity issues, select 'Electricity' as the department. Provide details and upload any relevant photos."),
        (["garbage", "waste", "garbage not collected", "waste management", "garbage issue", "garbage complaint"], 
         "For garbage or waste management issues, select 'Sanitation' as the department."),
        (["road", "pothole", "damaged road", "road repair", "road issue", "road complaint"], 
         "For road-related issues, select 'Public Works' as the department."),
        (["street light", "light not working", "streetlight", "street light issue", "street light complaint"], 
         "For street light issues, select 'Electricity' or 'Street Lighting' as the department."),
        (["sewage", "drain", "sewage overflow", "blocked drain", "sewage issue", "drainage problem"], 
         "For sewage or drainage issues, select 'Sanitation' or 'Drainage' as the department."),
        (["health", "hospital", "medical", "healthcare", "health issue", "hospital complaint"], 
         "For health or hospital-related grievances, select 'Health' as the department."),
        (["public transport", "bus", "transport", "bus stop", "transport issue", "bus complaint"], 
         "For public transport issues, select 'Transport' as the department."),
        (["park", "garden", "playground", "park issue", "garden complaint"], 
         "For park or playground issues, select 'Parks & Recreation' as the department."),
        (["noise", "pollution", "noise pollution", "air pollution", "pollution complaint", "noise issue"], 
         "For noise or pollution complaints, select 'Environment' as the department."),
        (["other issue", "miscellaneous", "not listed", "other complaint", "other problem"], 
         "For issues not listed, select 'Other' as the department and describe your problem in detail."),

        # --- Contact & Support ---
        (["contact support", "contact us", "helpdesk", "customer care", "support team", "support contact", "get help", "reach support"], 
         "Contact support using the 'Contact Us' page or our helpline number 1800-123-4567."),
        (["helpline", "phone number", "call support", "customer care number", "support number", "contact number"], 
         "Our helpline number is 1800-123-4567."),
        (["email not received", "no email", "missing email", "email issue", "did not get email", "email problem"], 
         "Check your spam folder or update your email in your profile."),
        (["email verification", "verify email", "email verification link", "verification email"], 
         "After registration, check your inbox for a verification email. If not received, use 'Resend Verification' in your profile."),
        (["forgot email", "lost email", "forgot my email", "lost my email"], 
         "If you lost access to your email, please contact support for assistance."),
        (["change notification", "notification settings", "update notification", "edit notification"], 
         "You can change your notification preferences in your profile settings."),
        (["feedback form", "feedback page", "feedback section"], 
         "You can provide feedback using the 'Feedback' page in the navigation bar."),
        (["faq", "frequently asked questions", "faq section", "faq page"], 
         "Visit the FAQ section from the main menu for answers to common questions."),
        (["about", "about us", "about system", "about page"], 
         "Visit the 'About Us' page to learn more about the Grievance Management System."),
        (["contact department", "department contact", "department phone", "department email"], 
         "Department contact details are available on the 'Contact Us' page."),
        (["privacy policy", "terms", "terms and conditions", "privacy", "policy", "terms page"], 
         "You can read our Privacy Policy and Terms & Conditions at the bottom of the homepage."),
    ]

    reply = None
    for keywords_list, response in keyword_responses:
        if any(word in user_message for word in keywords_list):
            reply = response
            break

    if not reply:
        reply = (
            "Sorry, I can help with navigation, submitting and tracking complaints, login issues, "
            "profile updates, how the system works, and general queries about the grievance system. Please ask a specific question or say 'help' for guidance."
        )

    return Response({'reply': reply, 'keywords': keywords})

# User List API View in Admin Dashboard Page
class UserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        from .models import Petition  # Import here to avoid circular import
        users = User.objects.all()
        user_list = []
        for user in users:
            profile = getattr(user, "profile", None)
            role = getattr(profile, "role", "user") if profile else "user"
            if user.is_superuser or role in ["officer", "admin"]:
                continue
            petitions = Petition.objects.filter(user=user)
            petition_count = petitions.count()
            petitions_solved = petitions.filter(status="solved").count()
            user_list.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": role,
                "petition_count": petition_count,
                "petitions_solved": petitions_solved,
            })
        return Response(user_list)
    
@permission_classes([IsAuthenticated])
class ProfileView(APIView):

    def get(self, request):
        # Get username or email from query params
        username = request.GET.get("username")
        email = request.GET.get("email")

        user = None
        if username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        elif email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)
        else:
            return Response({"error": "Username or email required"}, status=400)

        # Fetch from the Profile model
        profile = getattr(user, "profile", None)
        data = {
            "username": user.username,
            "email": user.email,
            "role": None,
            "department": None,
        }
        if profile:
            data["role"] = getattr(profile, "role", None)
            department = getattr(profile, "department", None)
            if department:
                data["department"] = getattr(department, "name", str(department))
        else:
            data["role"] = "user"

        return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def department_complaints(request):
    """
    Fetch all grievances (petitions) for a department.
    Use ?department=DepartmentName in the query params.
    This can be used for the PieChart or department table on click.
    """
    department_name = request.GET.get("department")
    if not department_name:
        return Response({"error": "Department name is required."}, status=400)

    try:
        department = Department.objects.get(name__iexact=department_name)
    except Department.DoesNotExist:
        return Response([], status=200)

    complaints = Petition.objects.filter(department=department)
    serializer = PetitionSerializer(complaints, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_complaint_status(request, pk):
    user = request.user
    if hasattr(user, "profile") and user.profile.role == "officer":
        try:
            petition = Petition.objects.get(pk=pk)
            new_status = request.data.get("status")
            date_resolved = request.data.get("date_resolved")
            if new_status in ["solved", "rejected"]:
                petition.status = new_status
                if date_resolved:
                    petition.date_resolved = date_resolved
                petition.save()
                return Response({"success": True})
            return Response({"error": "Invalid status"}, status=400)
        except Petition.DoesNotExist:
            return Response({"error": "Not found"}, status=404)
    return Response({"error": "Forbidden"}, status=403)

@api_view(['GET'])
def user_complaint_history(request):
    username = request.GET.get('username')
    if not username:
        return Response({"detail": "Username is required."}, status=status.HTTP_400_BAD_REQUEST)
    petitions = Petition.objects.filter(user__username=username).order_by('-id')
    serializer = PetitionSerializer(petitions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_officers(request):
    officers = OfficerProfile.objects.select_related('user', 'department').all()
    data = [
        {
            "id": officer.user.id,
            "username": officer.user.username,
            "email": officer.user.email,
            "department": officer.department.name if officer.department else "",
        }
        for officer in officers
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])  # Or [IsAuthenticated] if you want to restrict
def all_grievances(request):
    petitions = Petition.objects.select_related('department').all().order_by('-id')
    data = [
        {
            "id": petition.id,
            "title": petition.title,
            "description": petition.description,
            "status": petition.status,
            "department": petition.department.name if petition.department else "",
        }
        for petition in petitions
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_departments(request):
    departments = Department.objects.all()
    data = [{"name": dept.name} for dept in departments]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def department_stats(request, department_name=None):
    """
    Returns stats for all departments or a specific department.
    If department_name is None or "all", returns stats for all departments.
    """
    if department_name is None or department_name.lower() == "all":
        petitions = Petition.objects.all()
    else:
        petitions = Petition.objects.filter(department__name__iexact=department_name)

    total = petitions.count()
    solved = petitions.filter(status="solved").count()
    pending = petitions.filter(status="pending").count()
    rejected = petitions.filter(status="rejected").count()

    return Response({
        "total": total,
        "solved": solved,
        "pending": pending,
        "rejected": rejected,
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def department_pie_data(request, department_name):
    """
    Returns counts for each status for the given department.
    Used for PieChart in the frontend.
    """
    if department_name.lower() == "all":
        petitions = Petition.objects.all()
    else:
        try:
            department = Department.objects.get(name__iexact=department_name)
            petitions = Petition.objects.filter(department=department)
        except Department.DoesNotExist:
            return Response({"error": "Department not found."}, status=404)

    solved = petitions.filter(status__iexact="solved").count()
    pending = petitions.filter(status__iexact="pending").count()
    rejected = petitions.filter(status__iexact="rejected").count()
    unsolved = petitions.exclude(status__iexact="solved").exclude(status__iexact="pending").exclude(status__iexact="rejected").count()

    data = [
        {"name": "Solved", "value": solved},
        {"name": "Pending", "value": pending},
        {"name": "Rejected", "value": rejected},
        {"name": "Unsolved", "value": unsolved},
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def line_graph_data(request):
    """
    Returns weekly insight for solved and unsolved petitions.
    - Admin/User: all departments
    - Officer: only their department
    """
    user = request.user
    role = getattr(getattr(user, "profile", None), "role", None)
    department_name = request.GET.get("department")  # for officer dashboard

    today = timezone.now().date()
    start_date = today - timedelta(days=6)  # last 7 days including today

    if role == "officer":
        # Officer: only their department
        department = getattr(getattr(user, "profile", None), "department", None)
        if not department:
            return Response({"error": "No department assigned."}, status=400)
        petitions = Petition.objects.filter(department=department, date_resolved__date__gte=start_date)
    else:
        # Admin/User: all departments
        petitions = Petition.objects.filter(date_resolved__date__gte=start_date)

    # Prepare data for each day
    result = []
    for i in range(7):
        day = start_date + timedelta(days=i)
        solved_count = petitions.filter(status="solved", date_resolved__date=day).count()
        unsolved_count = petitions.exclude(status="solved").filter(date_submitted__date=day).count()
        result.append({
            "date": day.strftime("%Y-%m-%d"),
            "solved": solved_count,
            "unsolved": unsolved_count,
        })
    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bar_graph_data(request):
    """
    Returns monthly trends for rejected and pending petitions.
    - Admin/User: all departments
    - Officer: only their department
    """
    user = request.user
    role = getattr(getattr(user, "profile", None), "role", None)
    department_name = request.GET.get("department")  # for officer dashboard

    today = timezone.now().date()
    start_month = today.replace(day=1) - timedelta(days=30*5)  # last 6 months

    if role == "officer":
        department = getattr(getattr(user, "profile", None), "department", None)
        if not department:
            return Response({"error": "No department assigned."}, status=400)
        petitions = Petition.objects.filter(department=department, date_submitted__date__gte=start_month)
    else:
        petitions = Petition.objects.filter(date_submitted__date__gte=start_month)

    # Prepare data for each month
    result = []
    for i in range(6):
        month_start = (today.replace(day=1) - timedelta(days=30*i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        rejected_count = petitions.filter(status="rejected", date_resolved__date__gte=month_start, date_resolved__date__lte=month_end).count()
        pending_count = petitions.filter(status="pending", date_submitted__date__gte=month_start, date_submitted__date__lte=month_end).count()
        result.append({
            "month": month_start.strftime("%Y-%m"),
            "rejected": rejected_count,
            "pending": pending_count,
        })
    result.reverse()  # So the earliest month is first
    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stats_view(request):
    """
    Returns stats for all complaints (admin/user) or for officer's department.
    - If ?department=DeptName is provided, filter by department.
    - If officer, always filter by their department.
    """
    user = request.user
    role = getattr(getattr(user, "profile", None), "role", None)
    department_name = request.GET.get("department")

    if role == "officer":
        department = getattr(getattr(user, "profile", None), "department", None)
        if not department:
            return Response({"error": "No department assigned."}, status=400)
        petitions = Petition.objects.filter(department=department)
    elif department_name:
        try:
            department = Department.objects.get(name__iexact=department_name)
            petitions = Petition.objects.filter(department=department)
        except Department.DoesNotExist:
            return Response({
                "total_complaints": 0,
                "solved_complaints": 0,
                "pending_complaints": 0,
                "rejected_complaints": 0,
            })
    else:
        petitions = Petition.objects.all()

    total = petitions.count()
    solved = petitions.filter(status__iexact="solved").count()
    pending = petitions.filter(status__iexact="pending").count()
    rejected = petitions.filter(status__iexact="rejected").count()

    return Response({
        "total_complaints": total,
        "solved_complaints": solved,
        "pending_complaints": pending,
        "rejected_complaints": rejected,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def officer_petitions(request):
    user = request.user
    profile = getattr(user, "profile", None)
    if not profile or profile.role != "officer":
        return Response({"error": "Forbidden"}, status=403)
    department = profile.department
    if not department:
        return Response({"error": "No department assigned."}, status=400)

    # Annotate petitions with priority value for ordering
    petitions = (
        Petition.objects.filter(department=department)
        .select_related('aianalysedpetition')
        .annotate(
            priority_order=Case(
                When(aianalysedpetition__priority="High", then=Value(1)),
                When(aianalysedpetition__priority="Medium", then=Value(2)),
                When(aianalysedpetition__priority="Low", then=Value(3)),
                default=Value(4),
                output_field=IntegerField(),
            )
        )
        .order_by('priority_order', '-date_submitted')
    )

    data = []
    for p in petitions:
        ai = getattr(p, "aianalysedpetition", None)
        data.append({
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "proof_file": p.proof_file.url if p.proof_file else None,
            "date_submitted": p.date_submitted,
            "priority": ai.priority if ai else "",
            "sentiment": ai.sentiment if ai else "",
            "status": p.status,
            "remarks": p.remarks,
        })

    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def officer_petition_update(request, id):
    user = request.user
    profile = getattr(user, "profile", None)
    if not profile or profile.role != "officer":
        return Response({"error": "Forbidden"}, status=403)

    try:
        petition = Petition.objects.get(pk=id, department=profile.department)
    except Petition.DoesNotExist:
        return Response({"error": "Petition not found"}, status=404)

    status = request.data.get("status")
    remarks = request.data.get("remarks", "")

    if status not in ["solved", "rejected"]:
        return Response({"error": "Invalid status"}, status=400)

    petition.status = status
    petition.remarks = remarks
    petition.date_resolved = timezone.now()
    petition.save()

    return Response({"success": True})