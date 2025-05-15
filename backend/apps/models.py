from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True)  

    def __str__(self):
        return self.name

class OfficerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.department.name}"

class Profile(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('officer', 'Officer'),
        ('admin', 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)  # Only for officers

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
class Petition(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User who submits the petition
    department = models.ForeignKey(Department, on_delete=models.CASCADE)  # Assigned department
    title = models.CharField(max_length=255)
    description = models.TextField()
    proof_file = models.FileField(upload_to='proofs/', null=True, blank=True)
    date_submitted = models.DateTimeField(auto_now_add=True)
    date_resolved = models.DateTimeField(null=True, blank=True)  # Only for resolved petitions
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.title} - by {self.user.username}"

# AI Analysed Petition Model
class AIAnalysedPetition(models.Model):
    petition = models.OneToOneField(Petition, on_delete=models.CASCADE)
    priority = models.CharField(max_length=10, choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')])
    sentiment = models.CharField(max_length=10, choices=[('Positive', 'Positive'), ('Neutral', 'Neutral'), ('Negative', 'Negative')])
    is_spam = models.BooleanField(default=False)

    def __str__(self):
        return f"AI Analysis - {self.petition.title}"


    # # AI Analysis
    # priority = models.CharField(max_length=10, choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')])
    # sentiment = models.CharField(max_length=10, choices=[('Positive', 'Positive'), ('Negative', 'Negative'), ('Neutral', 'Neutral')])
    # is_spam = models.BooleanField(default=False)

    # def __str__(self):
    #     return self.title
    