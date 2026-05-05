from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


Bookrouter = DefaultRouter()
Bookrouter.register("books",views.BookViewSet, basename="books")

Auteurrouter = DefaultRouter()
Auteurrouter.register("auteur",views.AuteurViewSet, basename="auteur")



EmpruntRouter = DefaultRouter()
EmpruntRouter.register("emprunt", views.EmpruntView, basename="emprunt")

ProfileRouter = DefaultRouter()
ProfileRouter.register("profile", views.ProfileView, basename="profile")


RegisterRouter = DefaultRouter()
RegisterRouter.register("register", views.RegisterViewSet, basename="register")



NotificationRouter = DefaultRouter()
NotificationRouter.register("notification", views.NotificationView, basename="notification")





urlpatterns = [
    # path("books/", views.BookView.as_view()),
    # path("books/<int:pk>", views.bookDetailsView),
    

    path("", include(Bookrouter.urls)),

    path("", include(Auteurrouter.urls)),


    path("", include(EmpruntRouter.urls)),

    path("", include(ProfileRouter.urls)),

    path("", include(RegisterRouter.urls)),

    path("", include(NotificationRouter.urls)),


 


    path("login/", views.LoginView.as_view()),

   
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    
    path("token/refresh", TokenRefreshView.as_view(), name='token_refresh'),

    path("protected/", views.ProtectedView.as_view()),

    path("panier/", views.panierView),

    path("panier/<int:pk>/", views.panierDetails),

    path("emprunter/", views.emprunt),

    path("emprunter/<int:pk>/", views.empruntDetails),

] 