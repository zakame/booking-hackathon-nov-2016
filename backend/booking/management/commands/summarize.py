from time import sleep
from datetime import datetime
import requests
from django.core.management.base import BaseCommand, CommandError
from booking.models import Conference


class Command(BaseCommand):
    help = 'Gets a summary description for each conference.'

    def handle(self, *args, **kwargs):
        for conf in Conference.objects.filter(start_date__gte=datetime.now(), summary__isnull=True).iterator():
            summ = requests.post('http://api.smmry.com/&SM_API_KEY=F60EC4301B&SM_LENGTH=5&SM_URL={}'.format(conf.url))
            if summ.status_code == 200:
                try:
                    conf.summary = summ.json()['sm_api_content']
                    conf.save()
                    print(conf.summary)
                except KeyError:
                    print(conf.id)
                    conf.summary = ''
                    conf.save()
            sleep(12)
