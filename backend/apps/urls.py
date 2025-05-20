from django.urls import path, include
from .views import SignUpView, LoginView, UserListView, ProfileView, DepartmentListCreateView
from .views import chatbot_view


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),
    path('chatbot/', chatbot_view, name='chatbot'),
    path('users/', UserListView.as_view()),  # Changed from login to users
    path('profile/', ProfileView.as_view(), name='profile'),
    
]
