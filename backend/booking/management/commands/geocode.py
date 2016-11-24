from time import sleep
from django.core.management.base import BaseCommand, CommandError
from geopy.geocoders import Nominatim
from booking.models import Conference


class Command(BaseCommand):
    help = 'Adds lat and lng coordinates to Conferences.'

    def handle(self, *args, **kwargs):
        geolocator = Nominatim()
        for conf in Conference.objects.filter(lat__isnull=True).iterator():
            address = ','.join([conf.city, conf.state, conf.country])
            print(address)
            location = geolocator.geocode(address)
            if location:
                conf.lat = location.raw['lat']
                conf.lng = location.raw['lon']
                conf.save()
                print(conf.lat, conf.lng)
            sleep(3)
            
