from rest_framework import generics
from .models import Conference
from .serializers import ConferenceSerializer


class ConferenceListView(generics.ListAPIView):
    queryset = Conference.objects.all()
    serializer_class = ConferenceSerializer
