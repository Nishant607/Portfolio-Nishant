from django.urls import path
from .views import contact_view, health_check

urlpatterns = [
    path('contact/', contact_view, name='contact'),
    path('health/', health_check, name='health_check'),
]
