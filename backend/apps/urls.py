from django.urls import path, include
from .views import SignUpView, LoginView, DepartmentListCreateView
from .views import chatbot_view


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),
    path('chatbot/', chatbot_view, name='chatbot'),

    
]
