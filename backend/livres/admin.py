from django.contrib import admin
from .models import Auteur, Book, Emprunt, Profile, Panier, Notification
# Register your models here.


admin.site.register(Auteur)
admin.site.register(Profile)
admin.site.register(Book)
admin.site.register(Panier)
admin.site.register(Emprunt)
admin.site.register(Notification)


class BookAdmin(admin.AdminSite):
    pass

