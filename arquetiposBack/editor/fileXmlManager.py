import xml.etree.ElementTree as ET



def recolectarAttribution(root):
    for etiqueta in root.findall('{http://schemas.openehr.org/v1}description'):    
       autores = etiqueta.findall('{http://schemas.openehr.org/v1}original_author') #atribution    
       contribuidores = etiqueta.findall('{http://schemas.openehr.org/v1}other_contributors') #atribution  
       otros_detalles = etiqueta.findall('{http://schemas.openehr.org/v1}other_details')#atribution
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
    return atribution

def recolectarDescription(root):
    for etiqueta in root.findall('{http://schemas.openehr.org/v1}description'):    
       proposito = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}purpose').text#description
       palabras_clave = etiqueta.find('{http://schemas.openehr.org/v1}details').findall('{http://schemas.openehr.org/v1}keywords')#description
       uso = etiqueta.find('{http://schemas.openehr.org/v1}details').find('{http://schemas.openehr.org/v1}use').text#description
    #Estructura description
    description = {}
    atributos_palabras_clave = []
    for atrib in palabras_clave:
        atributos_palabras_clave.append(atrib.text)
    description["proposito"] = proposito
    description["palabras_clave"] = atributos_palabras_clave
    description["uso"] = uso
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

def procesarXML(arq_collection,file):
    tree = ET.parse(file)
    root = tree.getroot()
    estructuraProcesada = {}
    

    tipo_arquetipo = root.find('{http://schemas.openehr.org/v1}definition').find('{http://schemas.openehr.org/v1}rm_type_name').text

    items = recolectarItems(root)

    estructuraProcesada["nombre"] = items[0][0]
    estructuraProcesada["atribution"] = recolectarAttribution(root)#atribution
    estructuraProcesada["description"] = recolectarDescription(root)#description
    estructuraProcesada["items"] = items #all_items  
    #inserto estructura a mongo y obtengo id
    idArq = arq_collection.insert_one(estructuraProcesada).inserted_id

    #devuelvo nombre del arquetipo y su id
    return {"id":str(idArq),"nombre":estructuraProcesada["nombre"]} 