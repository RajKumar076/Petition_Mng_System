from django.contrib import admin
from .models import Profile, Department, Petition, AIAnalysedPetition, OfficerProfile
from django.contrib.auth.models import User

#from django.contrib.auth.models import User

admin.site.register(Profile)
admin.site.register(Department)
admin.site.register(Petition)
admin.site.register(AIAnalysedPetition)
admin.site.register(OfficerProfile)
#admin.site.register(User)