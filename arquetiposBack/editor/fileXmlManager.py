import xml.etree.ElementTree as ET

def obtenerTipo(root):
    tipo_arquetipo = ''
    etiqueta = root.find('{http://schemas.openehr.org/v1}definition')
    tipo_arquetipo = etiqueta.find('{http://schemas.openehr.org/v1}rm_type_name').text
    return tipo_arquetipo

def recolectarAttribution(root):
    for etiqueta in root.findall('{http://schemas.openehr.org/v1}description'):    
       #autores = etiqueta.findall('{http://schemas.openehr.org/v1}original_author') #atribution    
       contribuidores = etiqueta.findall('{http://schemas.openehr.org/v1}other_contributors') #atribution  
       otros_detalles = etiqueta.findall('{http://schemas.openehr.org/v1}other_details')#atribution
       original_author = etiqueta.findall('{http://schemas.openehr.org/v1}original_author')#description
    id_arquetipo = root.findall('{http://schemas.openehr.org/v1}archetype_id')[0].find('{http://schemas.openehr.org/v1}value').text#atribution
    #Estructura atribucion
    atribution = {}
    before_traductor = root.find('{http://schemas.openehr.org/v1}translations')
    traductor = before_traductor.find('{http://schemas.openehr.org/v1}author').text
    """atributos_autores = []
    for atrib in autores:
        atributos_autores.append(atrib.text)"""
    atributos_contribuidores = []
    for atrib in contribuidores:
        atributos_contribuidores.append(atrib.text)
    atributos_otrosDetalles = []
    for atrib in otros_detalles:
        atributos_otrosDetalles.append(atrib.text)
    #original_autor
    atributos_originalAuthor= []
    for atrib in original_author:
        atributos_originalAuthor.append(atrib.text)

    #atribution["autores"] = atributos_autores
    atribution["id_arquetipo"] = id_arquetipo
    atribution["original_author"] = atributos_originalAuthor
    atribution["contribuidores"] = atributos_contribuidores
    atribution["otros_detalles"] = atributos_otrosDetalles
    atribution["traductor"] = traductor
    return atribution

def recolectarDescription(root):
    for etiqueta in root.findall('{http://schemas.openehr.org/v1}description'):    
       proposito = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}purpose').text#description
       palabras_clave = etiqueta.find('{http://schemas.openehr.org/v1}details').findall('{http://schemas.openehr.org/v1}keywords')#description
       uso = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}use').text#description
       
       #otros_detalles = etiqueta.findall('{http://schemas.openehr.org/v1}other_details')#atribution
       misuse = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}misuse').text#description
    
    #Estructura description
    description = {}
    atributos_palabras_clave = []
    for atrib in palabras_clave:
        atributos_palabras_clave.append(atrib.text)
    
    #concept description 
    before_items = root.find('{http://schemas.openehr.org/v1}ontology').find('{http://schemas.openehr.org/v1}term_definitions')
    items = before_items.find('{http://schemas.openehr.org/v1}items')
    concept_description = items.findall('{http://schemas.openehr.org/v1}items')
    

    
    description["concept_description"] = concept_description[1].text
    description["proposito"] = proposito
    description["palabras_clave"] = atributos_palabras_clave
    description["uso"] = uso
    description["misuse"] = misuse
    

    return description
    

def recolectarItems(root):
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
    return all_items

def procesarXML(arq_collection,file):#Procesa el archivo xml importado
    tree = ET.parse(file)
    root = tree.getroot()
    estructuraProcesada = {}
    #a todos les asigna nombre y tipo
    items = recolectarItems(root)
    tipo_arquetipo = obtenerTipo(root)
    estructuraProcesada["nombre"] = items[0][0]
    estructuraProcesada["tipo"] = tipo_arquetipo
    #si es de tipo cluster
    if(tipo_arquetipo=="CLUSTER"):
        estructuraProcesada["atribution"] = recolectarAttribution(root)#atribution
        estructuraProcesada["description"] = recolectarDescription(root)#description
        estructuraProcesada["items"] = recolectarItems(root) #all_items  

    #inserto estructura a mongo (para luego obtenerlo desde el editor y creador de arquetipos) y obtengo id
    idArq = arq_collection.insert_one(estructuraProcesada).inserted_id

    #devuelvo nombre del arquetipo, tipo y su id a lista arquetipos component
    return {"id":str(idArq),"nombre":estructuraProcesada["nombre"],"tipo":estructuraProcesada["tipo"]} 