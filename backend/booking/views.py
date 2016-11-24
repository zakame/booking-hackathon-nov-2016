from rest_framework import generics
from datetime import datetime
from .models import Conference
from .serializers import ConferenceSerializer


class ConferenceListView(generics.ListAPIView):
    queryset = Conference.objects.filter(start_date__gte=datetime.now()).order_by('start_date')
    serializer_class = ConferenceSerializer


class ConferenceDetailView(generics.RetrieveAPIView):
    queryset = Conference.objects.all()
    serializer_class = ConferenceSerializer
