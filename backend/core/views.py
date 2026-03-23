from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ContactSerializer
from django_ratelimit.decorators import ratelimit
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='3/h', method='POST', block=True)
def contact_view(request):
    try:
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            contact_message = serializer.save()
            
            # Send Email
            try:
                subject = f"New Contact Request from {contact_message.name} - {contact_message.subject}"
                email_body = f"Name: {contact_message.name}\nEmail: {contact_message.email}\n\nMessage:\n{contact_message.message}"
                send_mail(
                    subject,
                    email_body,
                    settings.EMAIL_HOST_USER,
                    [settings.EMAIL_HOST_USER], # send to self
                    fail_silently=False,
                )
            except Exception as e:
                logger.error(f"Failed to send email: {e}")
                pass

            return Response({
                "success": True, 
                "message": "Message sent successfully! I will get back to you within 24 hours."
            })
            
        return Response({
            "success": False, 
            "message": "Invalid data provided.",
            "errors": serializer.errors
        }, status=400)
    except Exception as e:
        logger.error(f"Error in contact_view: {e}")
        return Response({
            "success": False, 
            "message": "An internal server error occurred."
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok", "version": "1.0"})
