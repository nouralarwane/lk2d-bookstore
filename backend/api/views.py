from django.shortcuts import render, get_object_or_404
from .serializers import BookSerializer, AuteurSerializer, RegisterSerializer, LoginSerializer, EmpruntSerializer,ProfileSerializer, Profil, PanierSerializer, NotifificationSeriaizer
from livres.models import Book, Auteur, Emprunt, Profile, Panier, Notification
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes, APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import generics, viewsets
from .pagination import CustomPagination
from livres.filters import BookFilter
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth import login, authenticate
from rest_framework.views import APIView

# Create your views here.

user = get_user_model()

"""@api_view(["GET", "POST"])
def bookView(request):
    if request.method == "GET":
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET", "PUT", "DELETE"])
def bookDetailsView(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = BookSerializer(book)
        return Response(serializer.data, status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serializer = BookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_200_OK)
        else: 
            return Response(status.HTTP_400_BAD_REQUEST)
        
    
    elif request.method == "DELETE":
        book.delete()
        return Response(status.HTTP_200_OK)"""


class BookViewSet(viewsets.ModelViewSet): 
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = CustomPagination
    filterset_class = BookFilter


class AuteurViewSet(viewsets.ModelViewSet):
    queryset = Auteur.objects.all()
    serializer_class = AuteurSerializer
    # pagination_class = CustomPagination

    
class RegisterViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={'request' : request}
        )

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            login(request, user)
            return Response({
                "user": user.username,
                "message" : "Login Successful"
            }, status=status.HTTP_200_OK)
        

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self, request): 
        user = request.user

        response = {
            "status": "It's okay",
            "user_infos": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                
            }
        }

        return Response(response)
     

class EmpruntView(viewsets.ModelViewSet):
    queryset = Emprunt.objects.all()
    serializer_class = EmpruntSerializer


@api_view(["GET", "POST"])
def emprunt(request):
    if request.method == "GET":
        emprunts = Emprunt.objects.all()
        serializer = EmpruntSerializer(emprunts, many=True)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    elif request.method == "POST":
        serializer = EmpruntSerializer(data=request.data)
        if serializer.is_valid():
            book_id = str(serializer.validated_data["book"]).split("-")[2]
            book_emprunte = get_object_or_404(Book, id=book_id)
            book_emprunte.quantity -= 1
            book_emprunte.save()
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def empruntDetails(request, pk):
    try:
        emprunt = Emprunt.objects.get(pk=pk)
        
    except Emprunt.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = EmpruntSerializer(emprunt)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serializer = EmpruntSerializer(emprunt, data=request.data)
        if serializer.is_valid():
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        book_id = str(emprunt.book).split("-")[2]
        book_emprunte = get_object_or_404(Book, id=book_id)
        book_emprunte.quantity += 1
        book_emprunte.save()
        emprunt.delete()
        return Response({"message": "Suppression correcte"},status=status.HTTP_200_OK)



class ProfileView(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    

@api_view([ "POST", "GET"])
def ProfileDetails(request):
    if request.method == "GET":
        
        books = Profile.objects.all()
        serializer = ProfileSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        serializer = ProfileSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["PUT", "GET", "DELETE"])
def ProfileUpdate(request, pk):
    try:
        user = Profile.objects.get(pk=pk)
    except Profile.DoesNotExist:
        return Response(status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = ProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serializer = ProfileSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response( status=status.HTTP_400_BAD_REQUEST)
    

    elif request.method == "DELETE":
        user.delete()
        return Response(status=status.HTTP_200_OK)
 
@api_view([ "POST", "GET"])
# @permission_classes([IsAuthenticated])
def panierView(request):

    if request.method == "GET":
        my_user = request.user 
 
        # panier_user = Panier.objects.filter(user=my_user["id"])
        paniers = Panier.objects.all()
        serializer = PanierSerializer(paniers,many=True)
        return Response(serializer.data)
        
    elif request.method == "POST":
        serializer = PanierSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    


@api_view([ "PUT", "GET", "DELETE"])
def panierDetails(request, pk):
    try:
        panier = Panier.objects.get(pk=pk)
    except Panier.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == "GET":
        serializer = PanierSerializer(panier)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "PUT":
        serializer = PanierSerializer(panier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        panier.delete()
        return Response(status=status.HTTP_200_OK)

           
class NotificationView(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotifificationSeriaizer


