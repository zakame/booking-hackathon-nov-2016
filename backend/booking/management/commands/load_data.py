import glob, os, re
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from booking.models import Conference


class Command(BaseCommand):
    help = 'Loads Conference data from files.'

    def __init__(self):
        self.now = datetime.now().strftime('%Y-%m-%d')

    def handle(self, *args, **kwargs):
        for filename in glob.glob(settings.BASE_DIR+"/data/events/*.txt"):
            conf = {}
            try:
                this = {}
                nickname = os.path.basename(filename)
                nickname = nickname[0:-4]
                with open(filename, encoding="utf-8") as fh:
                    for line in fh:
                        line = line.rstrip('\n')
                        if re.search(r'\A\s*#', line):
                            continue
                        if re.search(r'\A\s*\Z', line):
                            continue
                        line = re.sub(r'\s+\Z', '', line)
                        k,v = re.split(r'\s*:\s*', line, maxsplit=1)
                        if k in this:
                            print("Duplicate field '{}' in {}".format(k, filename))
                        else:
                            this[k] = v
                
                this['start_date'] = datetime.strptime(this['start_date'].replace('-', ''), '%Y%m%d')
                this['end_date'] = datetime.strptime(this['end_date'].replace('-', ''), '%Y%m%d')
                if this.get('diversitytickets') is not None:
                    this['diversity_tickets'] = this.pop('diversitytickets') or None
                if this.get('vimeo'):
                    this.pop('vimeo')
                if this.get('commend'):
                    this.pop('commend')
                if this.get('comment'):
                    this.pop('comment')
                if not this.get('cfp_date'):
                    this['cfp_date'] = None

                if 'city' not in this or not this['city']:
                    exit("City is missing from {}".format(this))

                city_name = '{}, {}'.format(this['city'], this['country'])

                # In some countris we require state:
                if this['country'] in ['Australia', 'Brasil', 'India', 'USA']:
                    if 'state' not in this or not this['state']:
                        exit('State is missing from {}'.format(this))
                    city_name = '{}, {}, {}'.format(this['city'], this['state'], this['country'])
                conf = Conference(**this)
                conf.save()
            except Exception as e:
                exit("ERRORa: {} in file {}".format(e, filename))
        return
