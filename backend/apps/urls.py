from django.urls import path, include
from .views import SignUpView, LoginView, DepartmentListCreateView



urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('departments/', DepartmentListCreateView.as_view(), name='department-list-create'),

    
]
