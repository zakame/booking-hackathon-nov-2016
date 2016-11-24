from django.contrib import admin
from booking.models import Conference


#admin.site.register(Conference)
class ConferenceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city')

admin.site.register(Conference, ConferenceAdmin)
