# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-24 13:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('booking', '0002_auto_20161124_1304'),
    ]

    operations = [
        migrations.AddField(
            model_name='conference',
            name='lat',
            field=models.FloatField(null=True),
        ),
        migrations.AddField(
            model_name='conference',
            name='lng',
            field=models.FloatField(null=True),
        ),
    ]
