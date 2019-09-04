from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework.response import Response
import xml.etree.ElementTree as ET


def importoCluster (file):
    pass
def procesarArchivoImportado(file):
    tree = ET.parse(file)
    root = tree.getroot()
    estructuraProcesada = {}
    
    tipo_arquetipo = ''
    for etiqueta in root.findall('{http://schemas.openehr.org/v1}definition'):
        tipo_arquetipo = etiqueta.find('{http://schemas.openehr.org/v1}rm_type_name').text
        #print(tipo_arquetipo)
    
    for etiqueta in root.findall('{http://schemas.openehr.org/v1}description'):    
       autores = etiqueta.findall('{http://schemas.openehr.org/v1}original_author') #atribution    
       contribuidores = etiqueta.findall('{http://schemas.openehr.org/v1}other_contributors') #atribution  
       otros_detalles = etiqueta.findall('{http://schemas.openehr.org/v1}other_details')#atribution
       proposito = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}purpose').text#description
       palabras_clave = etiqueta.find('{http://schemas.openehr.org/v1}details').findall('{http://schemas.openehr.org/v1}keywords')#description
       uso = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}use').text#description

    id_arquetipo = root.findall('{http://schemas.openehr.org/v1}archetype_id')[0].find('{http://schemas.openehr.org/v1}value').text#atribution
    #Estructura atribucion
    atribution = {}
    atribution["id_arquetipo"] = id_arquetipo
    atributos_autores = []
    for atrib in autores:
        atributos_autores.append(atrib.text)
    atributos_contribuidores = []
    for atrib in contribuidores:
        atributos_contribuidores.append(atrib.text)
    atributos_otrosDetalles = []
    for atrib in otros_detalles:
        atributos_otrosDetalles.append(atrib.text)
    atribution["autores"] = atributos_autores
    atribution["contribuidores"] = atributos_contribuidores
    atribution["otros_detalles"] = atributos_otrosDetalles
    

    #Estructura description
    description = {}
    atributos_palabras_clave = []
    for atrib in palabras_clave:
        atributos_palabras_clave.append(atrib.text)
    description["proposito"] = proposito
    description["palabras_clave"] = atributos_palabras_clave
    description["uso"] = uso

    #Extrae y estructura items
    before_items = root.find('{http://schemas.openehr.org/v1}ontology').find('{http://schemas.openehr.org/v1}term_definitions')
    items = before_items.findall('{http://schemas.openehr.org/v1}items')
    all_items = []
    atributos_item = []
    for item in items:
        myItem = item.findall('{http://schemas.openehr.org/v1}items')
        for atributos in myItem:
            atributos_item.append(atributos.text)
        all_items.append(atributos_item)
        atributos_item = []

    #Estructura completa 
    estructuraProcesada["atribution"] = atribution
    estructuraProcesada["description"] = description
    estructuraProcesada["items"] = all_items  
    
    return estructuraProcesada

@api_view(['GET', 'POST'])
def mensajesList(request):
    if request.method == 'POST':
        #print(request.FILES["fileKey"].read())
        archivoProcesado = procesarArchivoImportado(request.FILES["fileKey"])

        return Response(archivoProcesado)

    return Response({"message": "Hello, world!"})
