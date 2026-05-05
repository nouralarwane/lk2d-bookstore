from django.db import models
from django.contrib.auth import get_user_model
from django.forms import ValidationError
from datetime import datetime, timedelta
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

# Create your models here.

User = get_user_model()


# La classe Auteur
class Auteur(models.Model):
    nom = models.CharField(max_length=200)
    date_naissance = models.DateField()


    def __str__(self):
        return f"{self.nom}"


# La classe Livre
class Book(models.Model):

    TYPE_CHOICES = [
        ('HIST', 'Histoire'),
        ('COME', 'Comédie'),
        ('RELI', 'Religion'),
        ('ROM', 'Roman'),
        ('CL', 'Classique'),
        ('ST', 'Satire'),
        ('FICT', 'Fiction Contemporaine'),
    ]


    title = models.CharField(max_length=100)
    date_publication = models.DateField()
    auteur = models.ForeignKey(Auteur, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.FloatField()
    image = models.TextField(default="")
    details = models.TextField(default="")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="HIST")
    description = models.CharField(max_length=200, default="")
    rating = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    null=True,
    blank=True,
    default=0
)
    


    def __str__(self):
        return f"{self.title} - {self.auteur.nom}- {self.id}"



# La classe Profile

class Profile(models.Model):
    TYPE_CHOICES = [
        ('ADMIN', 'Administrateur'),
        ('CUSTOMER', 'Client'),
       
    ]
     
    profile = models.ImageField(upload_to="./images/", blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=TYPE_CHOICES, default="CUSTOMER")

    # Création automatique d'un profil pour un utilisateur 
    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)
        
       


#Les emprunts

class Emprunt(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'En cours'),
        ('RETURNED', 'Rendu'),
        ('OVERDUE', 'En retard'),
    ]
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_emprunt = models.DateField(auto_now_add=True)
    date_retour = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')

    class Meta:
        unique_together = ('user', 'book')
        # indexes = [models.Index(fields=['status', 'date_retour'])]

    # def __str__(self):
    #     return f"{self.user.username} - {self.book.title}"

    def clean(self):
        if self.date_retour and self.date_retour < self.date_emprunt:
            raise ValidationError("La date de retour doit être après l'emprunt.")
        if Emprunt.objects.filter(book=self.book, status='PENDING').count() >= self.book.quantity:
            raise ValidationError("Tous les exemplaires sont déjà empruntés.")

    def save(self, *args, **kwargs):
        if not self.id:
            self.date_retour = datetime.now().date() + timedelta(weeks=3)
        super().save(*args, **kwargs)

    def is_overdue(self):
        return self.date_retour < datetime.now().date() and self.status != 'RETURNED'
    


class Panier(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'book')



class Notification(models.Model):
    message = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    emprunt = models.ForeignKey(Emprunt, on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together = ('user', 'emprunt')
    # emprunt = models.ForeignKey(Emprunt, on_delete=models.CASCADE)
    
    
