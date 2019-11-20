from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
from editor.fileXmlManager import procesarXML

from pymongo import MongoClient
from bson.objectid import ObjectId
import pprint

client = MongoClient()
db = client['proyecto4']
arq_collection = db["arquetipos"]

def listaArquetipos():
    aArquetipos = []
    arquetipo = {}
    for arq in arq_collection.find():
        arq["_id"] = str(arq["_id"])
        arquetipo["id"] = arq["_id"]
        arquetipo["nombre"] = arq["text"]
        #arquetipo["tipo"] = arq["tipo"]
        aArquetipos.append(arquetipo)
        arquetipo = {}
    return aArquetipos

@api_view(['GET', 'POST'])
def paraListaArquetipos(request):
    if request.method == 'POST':
        archivoProcesado = procesarXML(arq_collection,request.FILES["xml"])
        return Response(archivoProcesado)
    if request.method == 'GET':
        #obtenerArquetipo()
        return Response(listaArquetipos())

@api_view(['GET', 'PUT'])
def paraEditorArquetipos(request, question_id):
    if request.method == 'GET':


        try:
            arquetipoSolicitado = arq_collection.find_one({"_id": ObjectId(question_id)})
            arquetipoSolicitado["_id"]= str(arquetipoSolicitado["_id"])
        except:
            arquetipoSolicitado = arq_collection.find_one({"_id": question_id})
            arquetipoSolicitado["_id"]= str(arquetipoSolicitado["_id"])

        return Response(arquetipoSolicitado)

    if request.method == 'PUT':
        #print (request.data)
        
        #borro el arquetipo en la db
        try:
            arq_collection.remove({'_id':ObjectId(question_id)})
            resultado = arq_collection.insert_one(request.data)
        except:
            arq_collection.remove({'_id':question_id})
            resultado = arq_collection.insert_one(request.data)

        #inserto el nuevo arquetipo
        

        #print("id con el que viene: ",question_id)
        
        return Response({"respuestra":True})

