from django.urls import path, include 
from .views import SignUpView, LoginView, DepartmentListCreateView, submit_petition, get_departments, add_officer, chatbot_view, UserListView, ProfileView


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),
    path('submit-petition/<str:department_name>/', submit_petition, name='submit-petition'),
    path('add-officer/', add_officer, name='add-officer'),
    path('chatbot/', chatbot_view, name='chatbot'),
    path('users/', UserListView.as_view()),  # Changed from login to users
    path('profile/', ProfileView.as_view(), name='profile'),
    
]
