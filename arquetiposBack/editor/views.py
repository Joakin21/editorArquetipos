from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from editor.fileXmlManager import procesarXML

@api_view(['GET', 'POST'])
def mensajesList(request):
    if request.method == 'POST':
        #print(request.FILES["fileKey"].read())
        archivoProcesado = procesarXML(request.FILES["xml"])
        #print(procesarXML(request.FILES["fileKey"]))
        return Response(archivoProcesado)

    return Response({"message": "Hello, world!"})
