#from xml.etree import ElementTree
import xml.etree.ElementTree as ET

#etiquetas
DEFINITION = '{http://schemas.openehr.org/v1}definition'
ATTRIBUTES = '{http://schemas.openehr.org/v1}attributes'
RM_ATTRIBUTE_NAME = '{http://schemas.openehr.org/v1}rm_attribute_name'
ONTOLOGY = '{http://schemas.openehr.org/v1}ontology'
TERM_DEFINITIONS = '{http://schemas.openehr.org/v1}term_definitions'
ITEMS = '{http://schemas.openehr.org/v1}items'
CHILDREN = '{http://schemas.openehr.org/v1}children'
NODE_ID = '{http://schemas.openehr.org/v1}node_id'
RM_TYPE_NAME = '{http://schemas.openehr.org/v1}rm_type_name'
DESCRIPTION = '{http://schemas.openehr.org/v1}description'
DETAILS = '{http://schemas.openehr.org/v1}details'
PURPOSE= '{http://schemas.openehr.org/v1}purpose'
KEYWORDS = '{http://schemas.openehr.org/v1}keywords'
USE = '{http://schemas.openehr.org/v1}use'
MISUSE ='{http://schemas.openehr.org/v1}misuse'
ARCHETYPE_ID = '{http://schemas.openehr.org/v1}archetype_id'
VALUE = '{http://schemas.openehr.org/v1}value'
ORIGINAL_AUTHOR = '{http://schemas.openehr.org/v1}original_author'
OTHER_CONTRIBUTORS = '{http://schemas.openehr.org/v1}other_contributors'
OTHER_DETAILS = '{http://schemas.openehr.org/v1}other_details'
AUTHOR = '{http://schemas.openehr.org/v1}author'
TRANSLATIONS = '{http://schemas.openehr.org/v1}translations'

#atributos de etiquetas
XSI_TYPE = '{http://www.w3.org/2001/XMLSchema-instance}type'

#funciones
def obtenerNombreArquetipo(root):
    nombre = root.find(ONTOLOGY).find(TERM_DEFINITIONS).find(ITEMS).find(ITEMS).text
    return nombre

def obtenerNombreEstructuras(estructurasPrincipales):
    nombre_estructuras = []
    for estructura in estructurasPrincipales:
        nombre_estructuras.append(estructura.find(RM_ATTRIBUTE_NAME).text)
    return nombre_estructuras

#mientras (atributos_nodo_hijo.attrib[XSI_TYPE] == "C_MULTIPLE_ATTRIBUTE") then
def solucion(nodos_en_la_estructura, actual_dic, nodos_term_definitions):
    cont = 1
    #LO MISMO QUE ARRIBA
    for nodox in nodos_en_la_estructura:
        actual_dic["nodo"+str(cont)] = {}
        id_nodox = nodox.find(NODE_ID).text

        atributos_nodox = nodox.find(ATTRIBUTES)
        if(atributos_nodox):#si tiene atributos
            if(atributos_nodox.attrib[XSI_TYPE] == "C_MULTIPLE_ATTRIBUTE"):
                nodos_en_la_estructura = nodox.find(ATTRIBUTES).findall(CHILDREN)
                solucion(nodos_en_la_estructura,actual_dic["nodo"+str(cont)],nodos_term_definitions)

        for nodox2 in nodos_term_definitions:
            if id_nodox == nodox2.attrib["code"]:
                actual_dic["nodo"+str(cont)]["text"] = nodox2.find(ITEMS).text
                #actual_dic["nodo"+str(cont)]["X"] = cont - 1
                cont += 1



def construirArquetipo(root):
    tipo_arquetipo = root.find(DEFINITION).find(RM_TYPE_NAME).text
    nodos_term_definitions = root.find(ONTOLOGY).find(TERM_DEFINITIONS).findall(ITEMS)

    todos_nodos_term_definitions = root.find(ONTOLOGY).findall(TERM_DEFINITIONS)
    for term_definitions in todos_nodos_term_definitions:
        if term_definitions.attrib["language"] == "en":
            nodos_term_definitions = term_definitions

    arquetipo = {}
    arquetipo["nombre_arquetipo"] = obtenerNombreArquetipo(root)

    definition = root.find(DEFINITION)
    estructurasPrincipales = definition.findall(ATTRIBUTES)#2 estructuras


        
    #agrego las estructuras que le faltan a OBSERVATION
    if(tipo_arquetipo=="OBSERVATION"):
        resto_estructuras = definition.find(ATTRIBUTES).find(CHILDREN).find(ATTRIBUTES).find(CHILDREN).findall(ATTRIBUTES)
        print(len(resto_estructuras))
        for estructura in resto_estructuras:
            estructurasPrincipales.append(estructura)

    numero_de_estructuras = len(estructurasPrincipales)
    nombre_estructuras = obtenerNombreEstructuras(estructurasPrincipales) 

    for i in range(len(estructurasPrincipales)):
        arquetipo["estructura"+str(i+1)] = {}
        arquetipo["estructura"+str(i+1)]["text"] = nombre_estructuras[i]
        #arquetipo["estructura"+str(i+1)]["X"] = i

        if(tipo_arquetipo=="ACTION"):
            if(i==0):
                nodos_hijos_definition = estructurasPrincipales[i].findall(CHILDREN)
            else:
                nodos_hijos_definition = estructurasPrincipales[i].find(CHILDREN).find(ATTRIBUTES).findall(CHILDREN)

        if(tipo_arquetipo=="EVALUATION" or tipo_arquetipo=="COMPOSITION" or tipo_arquetipo=="INSTRUCTION" or tipo_arquetipo=="ADMIN_ENTRY" or tipo_arquetipo=="OBSERVATION"):
            nodos_hijos_definition = estructurasPrincipales[i].find(CHILDREN).find(ATTRIBUTES).findall(CHILDREN) # todos los nodos de definition
        if(tipo_arquetipo=="CLUSTER" or tipo_arquetipo=="SECTION"):
            nodos_hijos_definition = estructurasPrincipales[i].findall(CHILDREN)
        cont = 1
        for nodo1 in nodos_hijos_definition:
            arquetipo["estructura"+str(i+1)]["nodo"+str(cont)] = {}
            id_nodo_hijo = nodo1.find(NODE_ID).text
            atributos_nodo_hijo = nodo1.find(ATTRIBUTES)
            if(atributos_nodo_hijo):#si tiene atributos
                if(atributos_nodo_hijo.attrib[XSI_TYPE] == "C_MULTIPLE_ATTRIBUTE"):

                    nodos_en_la_estructura = nodo1.find(ATTRIBUTES).findall(CHILDREN)
                    solucion(nodos_en_la_estructura, arquetipo["estructura"+str(i+1)]["nodo"+str(cont)],nodos_term_definitions)
                    
            
            for nodo2 in nodos_term_definitions:
                if id_nodo_hijo == nodo2.attrib["code"]:
                    #print(id_nodo_hijo)
                    #print(nodo2.find(ITEMS).text)
                    arquetipo["estructura"+str(i+1)]["nodo"+str(cont)]["text"] = nodo2.find(ITEMS).text
                    #arquetipo["estructura"+str(i+1)]["nodo"+str(cont)]["X"] = cont -1 
                    cont += 1

    #estructura description (luego trabajar el idioma)
    concept_description = root.find(ONTOLOGY).find(TERM_DEFINITIONS).find(ITEMS).findall(ITEMS)[1].text
    proposito = root.find(DESCRIPTION).find(DETAILS).find(PURPOSE).text
    palabras_clave = root.find(DESCRIPTION).find(DETAILS).findall(KEYWORDS)
    atributos_palabras_clave = []
    for atrib in palabras_clave:
        atributos_palabras_clave.append(atrib.text)
    uso = root.find(DESCRIPTION).find(DETAILS).find(USE).text
    misuse = root.find(DESCRIPTION).find(DETAILS).find(MISUSE).text
    arquetipo["estructura"+str(numero_de_estructuras+1)] = {}
    arquetipo["estructura"+str(numero_de_estructuras+1)]["nombre_estructura"]="description"
    #arquetipo["estructura"+str(numero_de_estructuras+1)]["X"] = numero_de_estructuras
    arquetipo["estructura"+str(numero_de_estructuras+1)]["concept_description"] = concept_description
    arquetipo["estructura"+str(numero_de_estructuras+1)]["proposito"] = proposito
    arquetipo["estructura"+str(numero_de_estructuras+1)]["palabras_clave"] = atributos_palabras_clave
    arquetipo["estructura"+str(numero_de_estructuras+1)]["uso"] = uso
    arquetipo["estructura"+str(numero_de_estructuras+1)]["misuse"] = misuse

    #estructura attribution
    id_arquetipo = root.findall(ARCHETYPE_ID)[0].find(VALUE).text

    original_author = root.find(DESCRIPTION).findall(ORIGINAL_AUTHOR)
    atributos_originalAuthor= []
    for atrib in original_author:
        atributos_originalAuthor.append(atrib.text) 

    contribuidores = root.find(DESCRIPTION).findall(OTHER_CONTRIBUTORS)
    atributos_contribuidores = []
    for atrib in contribuidores:
        atributos_contribuidores.append(atrib.text)
    
    otros_detalles = root.find(DESCRIPTION).findall(OTHER_DETAILS)
    atributos_otrosDetalles = []
    for atrib in otros_detalles:
        atributos_otrosDetalles.append(atrib.text)

    arquetipo["estructura"+str(numero_de_estructuras+2)] = {}
    arquetipo["estructura"+str(numero_de_estructuras+2)]["nombre_estructura"]="attribution"
    #arquetipo["estructura"+str(numero_de_estructuras+2)]["X"] = numero_de_estructuras+1
    arquetipo["estructura"+str(numero_de_estructuras+2)]["id_arquetipo"] = id_arquetipo
    arquetipo["estructura"+str(numero_de_estructuras+2)]["original_author"] = atributos_originalAuthor
    arquetipo["estructura"+str(numero_de_estructuras+2)]["contribuidores"] = atributos_contribuidores
    arquetipo["estructura"+str(numero_de_estructuras+2)]["otros_detalles"] = atributos_otrosDetalles
    if (root.find(TRANSLATIONS)):
        traductor = root.find(TRANSLATIONS).find(AUTHOR).text
        arquetipo["estructura"+str(numero_de_estructuras+2)]["traductor"] = traductor

    return arquetipo

def procesarXML(arq_collection,file):#Procesa el archivo xml importado
    tree = ET.parse(file)
    root = tree.getroot()
 
    

    estructuraProcesada = construirArquetipo(root)

    #inserto estructura a mongo (para luego obtenerlo desde el editor y creador de arquetipos) y obtengo id
    idArq = arq_collection.insert_one(estructuraProcesada).inserted_id


    #devuelvo nombre del arquetipo, tipo y su id a lista arquetipos component
    return {"id":str(idArq),"nombre":estructuraProcesada["nombre_arquetipo"]} 


