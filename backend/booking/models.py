from django.db import models


class Conference(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, blank=False, null=False)
    url = models.CharField(max_length=500, blank=False, null=False)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    cfp_date = models.DateField(null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    topics = models.CharField(max_length=500, blank=True, null=True)
    languages = models.CharField(max_length=100, blank=True, null=True)
    code_of_conduct = models.CharField(max_length=500, blank=True, null=True)
    twitter = models.CharField(max_length=100, blank=True, null=True)
    facebook = models.CharField(max_length=100, blank=True, null=True)
    accessibility = models.CharField(max_length=100, blank=True, null=True)
    diversity_tickets = models.IntegerField(null=True)
    youtube = models.CharField(max_length=100, blank=True, null=True)
    


