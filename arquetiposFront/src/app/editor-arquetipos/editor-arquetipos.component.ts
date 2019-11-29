import { Component, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
//import { jsPlumb } from 'jsplumb';
import { MindMapMain } from 'jsmind';
import { CrearObjetoService } from '../servicios/crear-objeto.service'
import { AlertPromise } from 'selenium-webdriver';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import {NgForm, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

declare var $:any;
declare var jsMind:any

@Component({
  selector: 'app-editor-arquetipos',
  templateUrl: './editor-arquetipos.component.html',
  styleUrls: ['./editor-arquetipos.component.css']
})
export class EditorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService,private conexBack: ConexionBackendService,private router: Router) { }
  datos_modal_1: FormGroup
  arquetipo_id:string
  nombre_arquetipo:string
  
  myData: any[] = []

  id_nodo = 2
  _jm:any
  arquetipo:any

  tipo:string = ""
  text:string = ""
  description:string = ""
  comment:string = ""
  source:string = ""
  contenido:any[] = []

  id_nodo_editar:string

  id_nodo_padre_nuevo:string
  nuevo_nodo_is_estructural:boolean = true

  selected_node:any
  
  mensajeAlerta:string 
  //set myData para mostrar los nodos con jsmind inicialmente
  crearData(obj){ 
    for (var k in obj)
    {
        
        if (typeof obj[k] == "object" && obj[k] !== null && !Array.isArray(obj[k])){

              var direction = "left"
              if(obj[k]["text"] == "description" || obj[k]["text"] == "attribution"){
                direction = "right"
              }else{
                direction = "left"
              }

              obj[k]["id_nodo"] = "nodo"+this.id_nodo
              this.myData.push({"id":obj[k]["id_nodo"], "parentid":obj["id_nodo"],"direction":direction, "topic":obj[k]["text"]})
              this.id_nodo = this.id_nodo + 1
            this.crearData(obj[k]);
        }

    }

  }

  

  limpiarAtributosNodos(){
    this.tipo = ""
    this.text = ""
    this.description = ""
    this.comment = ""
    this.source = ""
  }
  LLenarModalDatosBase(nodo:any){
    if (nodo["tipo"])
      this.tipo = nodo["tipo"] 
    if (nodo["text"])
      this.text = nodo["text"]
    if (nodo["description"])
      this.description = nodo["description"]
    if (nodo["comment"])
      this.comment = nodo["comment"]
    if (nodo["source"])
      this.source = nodo["source"]

    console.log(this.tipo)
    console.log(this.text)
    console.log(this.description)
    console.log(this.comment)
    console.log(this.source)
    //Se deselecciona el nodo del jsmind para no tener problemas en el modal
    this._jm.select_clear()

  }
  mensajeContenido:string = ""
  mensajeEdicion:string = ""
  tipo_nodo_elegido:string
  mostrar_contenido:boolean

  info_text:string = ""
  info_value:any
  info_is_lista:boolean = false


  insertarDatosNodoModal(arquetipo,id_nodo){//luego intentar mejorar num iteraciones 
    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
        if (id_nodo == arquetipo[k]["id_nodo"] && arquetipo[k]["tipo"] != "estructural"){ //si encuentra el nodo y no es de tipo estructural ya que esos no contienen datos
          //console.log("tipo:",arquetipo[k]["tipo"])
          if(arquetipo[k]["tipo"] != "info"){
            this.limpiarAtributosNodos()
            //this.contenido = []
            this.id_nodo_editar = id_nodo
            this.tipo_nodo_elegido = arquetipo[k]["tipo"]
            this.mostrar_contenido = true
            
            this.LLenarModalDatosBase(arquetipo[k])
            this.contenido = arquetipo[k]["contenido"]
            //Mensaje por defecto para el contenido de la mayoria de los nodos
            this.mensajeContenido = "Contenido"
            this.mensajeEdicion = "Editar contenido"

            $('#modalTipo1').modal('show');

            if(arquetipo[k]["tipo"] == "CHOICE"){
              this.mensajeContenido = "Choice of"
              this.mensajeEdicion = "Editar opciones disponibles"
            }
            else if(arquetipo[k]["tipo"] == "DV_CODED_TEXT"){

            }
            else if(arquetipo[k]["tipo"] == "DV_ORDINAL"){

            }
            /*else if(arquetipo[k]["tipo"] == "careflow_step"){
              $('#modalTipo1').modal('toggle');
              alert("no para careflow_step")
            }*/
            
            else{
              this.mostrar_contenido = false

            }
          }
          else{
            this.info_text = arquetipo[k]["text"]
            this.info_value = arquetipo[k]["value"]
            this.info_is_lista = Array.isArray(arquetipo[k]["value"]) 
       
            $('#modalTipoInfo').modal('show');

          }

            
          //abrir modal

        }
        this.insertarDatosNodoModal(arquetipo[k],id_nodo);
      }
    }

  }
  //cuando abre un nodo para editarlo, esta funcion llama a insertarDatosNodoModal para que configure el modal con los datos del nodo seleccionado
  mostrarNodo(){
    var selected_node = this._jm.get_selected_node();
    if(!!selected_node){//Si selecciono un nodo
      var id_nodo = selected_node.id
      //realizar busqueda
      this.insertarDatosNodoModal(this.arquetipo,id_nodo)


    }else{
      alert('Debe seleccionar un nodo primero');
    }
  }
  num_nuevo_nodo:number
  asignarNuevoNumId(arquetipo){

    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){

        this.num_nuevo_nodo = this.num_nuevo_nodo + 1
        this.asignarNuevoNumId(arquetipo[k]);
      }
    }

  }
 
  BuscarEditarNodo(arquetipo,nuevo_data_nodo){//luego intentar mejorar num iteraciones 
    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
        if (this.id_nodo_editar == arquetipo[k]["id_nodo"]){ //si encuentra el nodo

          arquetipo[k]["tipo"] = nuevo_data_nodo["tipo"]
          arquetipo[k]["text"] = nuevo_data_nodo["text"]
          arquetipo[k]["description"] = nuevo_data_nodo["description"]
          arquetipo[k]["comment"] = nuevo_data_nodo["comment"]
          arquetipo[k]["source"] = nuevo_data_nodo["source"]

          arquetipo[k]["contenido"] = this.contenido

          this._jm.update_node(this.id_nodo_editar, nuevo_data_nodo["text"]);

          

            
          //abrir modal

        }
        this.BuscarEditarNodo(arquetipo[k],nuevo_data_nodo);
      }
    }
    return arquetipo

  }
  //Se obtienen los principales datos del modal: name, description, comment y source. (todos los nodos los tienen)
  obtenerDatosBase(datos_modal:any):any{
    var tipo = datos_modal.value["tipo_nodo"]
    if(tipo == "" || tipo == null)
      tipo = this.tipo

    var text = datos_modal.value["nombre"]
    //console.log("text antes: ",text)
    if(text == "" || text == null)
      text = this.text

    var description = datos_modal.value["description_nodo"]
    if(description == "" || description == null)
      description = this.description

    var comment = datos_modal.value["comment_nodo"]
    if(comment == "" || comment == null)
      comment = this.comment

    var source = datos_modal.value["source_nodo"]
    if(source == "" || source == null)
      source = this.source

    var nuevo_data_nodo = {"tipo":tipo,"text":text,  "description":description, "comment":comment, "source":source}
    
    return nuevo_data_nodo
  }
  
  //cuando hace clic en editar en el modal, esta funcion toma y procesa los nuevos datos y llama
  // a BuscarEditarNodo que buscara nuevamente el nodo y lo editara con los nuevos datos

  editarNodoTipo2(datos_modal_2: NgForm){
    //console.log("Modal tipo dos: coded text")
    if(this.tipo_nodo_elegido == "CHOICE" || this.tipo_nodo_elegido == "DV_CODED_TEXT" || this.tipo_nodo_elegido == "DV_ORDINAL"){
      var opcion_elegida_contenido = datos_modal_2.value["optradio"]
      console.log("tipo nodo: ",this.tipo_nodo_elegido)
      if(opcion_elegida_contenido!= "noCambiar"){
        var nombre_nodo = datos_modal_2.value["nombre_nodo_contenido"]
        var description_nodo = datos_modal_2.value["description_nodo_contenido"]
        if(this.tipo_nodo_elegido == "DV_ORDINAL"){
          var numero_nodo = datos_modal_2.value["numero_nodo_contenido"]
        }
        if(opcion_elegida_contenido!= "nuevo"){//Si quiere cambiar el contenido de uno de los nodos
          for (var i=0; i< this.contenido.length; i++){
            if(this.contenido[i]["text"] == opcion_elegida_contenido){
              this.contenido[i]["text"] = nombre_nodo
              this.contenido[i]["description"] = description_nodo
              if(this.tipo_nodo_elegido == "DV_ORDINAL"){
                this.contenido[i]["numero"] = numero_nodo
              }
            }
          }
        }
        else{//Si va por crear nuevo
          
          if(this.tipo_nodo_elegido == "DV_ORDINAL"){
            this.contenido.push({"text":nombre_nodo, "description":description_nodo, "numero":numero_nodo})
            
          }else{
            this.contenido.push({"text":nombre_nodo, "description":description_nodo})
          }
        }
      }
      else{//si no cambia en contenido, cierro el modal
        $('#modalTipo1').modal('toggle');

        var nuevo_data_nodo = this.obtenerDatosBase(datos_modal_2)
        this.arquetipo = this.BuscarEditarNodo(this.arquetipo,nuevo_data_nodo);
        console.log("arquetipo editado")
        console.log(this.arquetipo)
        datos_modal_2.reset()
        
      }
      
    }
    //Si es de tipo uno (los que solo contienen los datos base)
    else{
      $('#modalTipo1').modal('toggle');

      var nuevo_data_nodo = this.obtenerDatosBase(datos_modal_2)
      this.arquetipo = this.BuscarEditarNodo(this.arquetipo,nuevo_data_nodo);
      console.log("arquetipo editado")
      console.log(this.arquetipo)
      datos_modal_2.reset()

    }
    this.mensajeAlerta = "hay nuevos cambios realizados en el diagrama"
    
  }
  configurarJsMind(){
    var mind = {
      "meta":{
          "name":"demo",
          "author":"hizzgdev@163.com",
          "version":"0.2",
      },
      "format":"node_array",
      "data":this.myData

    };
    var options = {
        container:'jsmind_container',
        editable:true,
        theme:'primary'
    }
    this._jm = jsMind.show(options,mind);

  }
  dibujarArquetipoImportado(arquetipo){
    
    arquetipo["id_nodo"] ="nodo1"
    this.myData.push({"id":arquetipo["id_nodo"], "isroot":true, "topic":arquetipo["text"]})
    this.crearData(arquetipo)
    //console.log(arquetipo)
    this.arquetipo = arquetipo

    //prueba jsmind
    this.configurarJsMind()

    
  }

  guardarArquetipo(){
    this.conexBack.updateArquetipo(this.arquetipo).subscribe(result => console.log(result))
    this.mensajeAlerta = "Todos los cambios han sido guardados"
    $('.alert').alert()
  }
  
  
  eliminarNodo(){
    var selected_node = this._jm.get_selected_node()
    var selected_node_id
    if(!!selected_node){
      selected_node_id = selected_node.id;
      //eliminamos de la estructura arquetipo
      this.arquetipo = this.buscarEliminarNodo(this.arquetipo, selected_node_id)
      console.log(this.arquetipo)
      //eliminamos del jsmind
      this._jm.remove_node(selected_node_id);
      this.mensajeAlerta = "hay nuevos cambios realizados en el diagrama"
    }
    else{
      alert("seleccionar nodo primero")
    }

  }
  
  nuevoNodo(){
    var selected_node = this._jm.get_selected_node(); // as parent of new node
    if(!selected_node){alert('please select a node first.');return;}
    this.id_nodo_padre_nuevo = selected_node["id"]
    if(selected_node["id"] == "nodo1")
      this.nuevo_nodo_is_estructural = true
    else
      this.nuevo_nodo_is_estructural = false

    this.selected_node = selected_node
    this._jm.select_clear()
    $('#modalConfiguracionNuevoNodo').modal('show');
    //this.buscarNodoAndEditarModal(this.arquetipo,selected_node["id"])

  }
  buscarEliminarNodo(arquetipo, id_nodo){
    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
        if(id_nodo == arquetipo[k]["id_nodo"]){
          console.log("eliminar ", arquetipo[k]["text"])
          delete arquetipo[k]
          
        }
        this.buscarEliminarNodo(arquetipo[k], id_nodo)
      }

    }
    return arquetipo
  }
   //cuando el usuario quiera crear un nodo, se muestra un modal de opciones segun el nodo padre de este
  buscarCrearNodo(arquetipo,nuevo_data_nodo){
    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
        if(this.id_nodo_padre_nuevo == arquetipo[k]["id_nodo"]){
          
          //Se verifica la cantidad de nodos hijos que tiene
          var cantidad_nodos_hijos = Object.keys(arquetipo[k]).length
          if(arquetipo[k]["tipo"]=="estructural"){
            cantidad_nodos_hijos = (Object.keys(arquetipo[k]).length)-3
            
          }
          else{
            var claves = Object.keys(arquetipo[k])
            for(var clave in claves){
              if(claves[clave]=="tipo" || claves[clave]=="text" || claves[clave]=="description" || claves[clave]=="comment" || claves[clave]=="source" || claves[clave]=="id_nodo" || claves[clave]=="contenido" || claves[clave]=="value")
                cantidad_nodos_hijos = cantidad_nodos_hijos -1
            }
            
          }
          //clave del nuevo nodo
          var num_clave_nuevo_nodo = cantidad_nodos_hijos + 1
          var clave_nuevo_nodo = "nodo" + num_clave_nuevo_nodo
          //crear nuevo nodo y sus atributos, para la estructura arquetipo
          arquetipo[k][clave_nuevo_nodo] = {}
          arquetipo[k][clave_nuevo_nodo]["text"] = nuevo_data_nodo["nombre"]
          arquetipo[k][clave_nuevo_nodo]["tipo"] = nuevo_data_nodo["tipo"]
          arquetipo[k][clave_nuevo_nodo]["description"] = ""
          arquetipo[k][clave_nuevo_nodo]["comment"] = ""
          arquetipo[k][clave_nuevo_nodo]["source"] = ""
          arquetipo[k][clave_nuevo_nodo]["contenido"] = []
          this.num_nuevo_nodo = 1
          this.asignarNuevoNumId(this.arquetipo)
          var id_nuevo_nodo = "nodo"+(this.num_nuevo_nodo)
          arquetipo[k][clave_nuevo_nodo]["id_nodo"] = id_nuevo_nodo

          //para el diagrama jsmind
          console.log(this._jm.get_selected_node())
          //var selected_node = this._jm.get_selected_node();
          var node = this._jm.add_node(this.selected_node, id_nuevo_nodo, nuevo_data_nodo["nombre"]);

        }
        this.buscarCrearNodo(arquetipo[k],nuevo_data_nodo);
      }

    }
    return arquetipo
  }
  crearNuevoNodo(datos_conf_nuevo_nodo: NgForm){
    console.log(datos_conf_nuevo_nodo.value)
    $('#modalConfiguracionNuevoNodo').modal('toggle');
    if(this.id_nodo_padre_nuevo == "nodo1"){
      //hago lo mismo de buscarCrearNodo pero teniendo padre al nodo base
      var cantidad_nodos_hijos = (Object.keys(this.arquetipo).length) - 4
      //clave del nuevo nodo
      var num_clave_nuevo_nodo = cantidad_nodos_hijos + 1
      var clave_nuevo_nodo = "estructura" + num_clave_nuevo_nodo
      this.arquetipo[clave_nuevo_nodo] = {}      
      this.arquetipo[clave_nuevo_nodo]["text"] = datos_conf_nuevo_nodo.value["nombre"]
      this.arquetipo[clave_nuevo_nodo]["tipo"] = "estructural"
      this.num_nuevo_nodo = 1
      this.asignarNuevoNumId(this.arquetipo)
      var id_nuevo_nodo = "nodo"+(this.num_nuevo_nodo)
      this.arquetipo[clave_nuevo_nodo]["id_nodo"] = id_nuevo_nodo
      //para el diagrama jsmind
      var node = this._jm.add_node(this.selected_node, id_nuevo_nodo, datos_conf_nuevo_nodo.value["nombre"]);


    }else{
      this.arquetipo = this.buscarCrearNodo(this.arquetipo, datos_conf_nuevo_nodo.value)
    }

    this.mensajeAlerta = "hay nuevos cambios realizados en el diagrama"
  }

  nuevoArquetipo(datos_nuevo_arquetipo: NgForm){
    console.log(datos_nuevo_arquetipo.value)
    //crear estructutra base
    this.arquetipo = {}
    this.arquetipo["_id"] = "77jajajojojeje99"
    this.arquetipo["text"] = datos_nuevo_arquetipo.value["nuevo_arquetipo"]
    this.arquetipo["tipo"] = "base"
    this.arquetipo["id_nodo"] = "nodo1"

    //limpiar jsmind_container
    document.getElementById("jsmind_container").innerHTML = ""
    //agregar nodo root al jsmind_container
    this.myData.push({"id":this.arquetipo["id_nodo"], "isroot":true, "topic":this.arquetipo["text"]})
    this.configurarJsMind()
    
  }
  
  ngOnInit() {
    //Obtengo id del arquetipo importado
    this.elegirArquetipo.currentArquetipo.subscribe(id_arq => {
      this.arquetipo_id = id_arq
    })
    
  }

  ngAfterViewInit(){
    console.log("id: ",this.arquetipo_id)
    //this.jsPlumbInstance = jsPlumb.getInstance();
    if(this.arquetipo_id==null){
      //volver a inicio
      this.router.navigateByUrl('/visualizador')
    }
    else if(this.arquetipo_id=="nuevo arquetipo"){
      console.log(this.arquetipo_id)
      
    }
    else{
      this.conexBack.getArquetipoById(this.arquetipo_id).subscribe(arquetipo =>{
        this.dibujarArquetipoImportado(arquetipo),
        this.nombre_arquetipo = arquetipo["text"]
        //this.conexionesDiagramaImportado(jsPlumb,this.jsPlumbInstance,arquetipo,this.contador_nodos)
      })
    }

  }




}
