from django.urls import path, include 
from .views import SignUpView, LoginView, DepartmentListCreateView, submit_petition, get_departments, add_officer, chatbot_view, UserListView, ProfileView, department_complaints, update_complaint_status
from . import views

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),
    path('submit-petition/<str:department_name>/', submit_petition, name='submit-petition'),
    path('add-officer/', add_officer, name='add-officer'),
    path('chatbot/', chatbot_view, name='chatbot'),
    path('users/', UserListView.as_view()),  # Changed from login to users
    path('profile/', ProfileView.as_view(), name='profile'),
    path('department-complaints/', department_complaints, name='department-complaints'),
    path('complaints/<int:pk>/update-status/', update_complaint_status, name='update-complaint-status'),
    path('complaints/history/', views.user_complaint_history, name='user-complaint-history'),
    path('officers/', views.get_officers, name='get_officers'),
    path('all-grievances/', views.all_grievances, name='all_grievances'),
    path('departments/', views.get_departments, name='get_departments'),
    path('department-stats/', views.department_stats, name='department_stats_all'),
    path('department-stats/<str:department_name>/', views.department_stats, name='department_stats'),
    path('department-pie/<str:department_name>/', views.department_pie_data, name='department_pie_data'),
    path('line-graph-data/', views.line_graph_data, name='line_graph_data'),
    path('bar-graph-data/', views.bar_graph_data, name='bar_graph_data'),
    path('stats/', views.stats_view, name='stats_view'),
]
