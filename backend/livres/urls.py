from django.urls import path
from . import views

urlpatterns = [
    path("livres/", views.hello),
]