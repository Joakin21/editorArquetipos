import { Component, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
//import { jsPlumb } from 'jsplumb';
import { MindMapMain } from 'jsmind';
import { CrearObjetoService } from '../servicios/crear-objeto.service'
import { AlertPromise } from 'selenium-webdriver';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import {NgForm, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
//import { timeStamp } from 'console';
//import { log } from 'console';

declare var $:any;
declare var jsMind:any

@Component({
  selector: 'app-editor-arquetipos',
  templateUrl: './editor-arquetipos.component.html',
  styleUrls: ['./editor-arquetipos.component.css']
})
export class EditorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService,private conexBack: ConexionBackendService,private router: Router, private formBuilder: FormBuilder) { }
  
  createNewArchetypeForm:FormGroup
  createNewNodoForm:FormGroup
  
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

  usuario_logeado:string = ""
  //show_form_new_archetype:boolean = false
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
              var color 
              if(obj[k]["tipo"] == "estructural")
                color = "#A4A4A4"//gis normal
              else
                color = "#D8D8D8"//gis claro
              obj[k]["id_nodo"] = jsMind.util.uuid.newid();//"nodo"+this.id_nodo
              this.myData.push({"id":obj[k]["id_nodo"], "parentid":obj["id_nodo"],"direction":direction, "topic":obj[k]["text"], "background-color":color, "foreground-color":"black"})
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
    else 
      this.tipo = ""
    if (nodo["text"])
      this.text = nodo["text"]
    else 
      this.text = ""
    if (nodo["description"])
      this.description = nodo["description"]
    else
      this.description = ""
    if (nodo["comment"])
      this.comment = nodo["comment"]
    else 
      this.comment = ""
    if (nodo["source"])
      this.source = nodo["source"]
    else
      this.source = ""

    /*console.log(this.tipo)
    console.log(this.text)
    console.log(this.description)
    console.log(this.comment)
    console.log(this.source)*/

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
        if (id_nodo == arquetipo[k]["id_nodo"]){ //si encuentra el nodo y no es de tipo estructural ya que esos no contienen datos
              //console.log("id: ",id_nodo)
              if (arquetipo[k]["tipo"] != "estructural"){
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
              }
              else {//Si es un estructural
                this.limpiarAtributosNodos()
                this.id_nodo_editar = id_nodo
                this.LLenarModalDatosBase(arquetipo[k])

                //alert("intento abrir un estructural")
                $('#modalTipoEstructural').modal('show');
                
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
      //si el nodo es base 
      if (id_nodo == "nodo1"){
        //alert("ya csm..")
        this.limpiarAtributosNodos()
        this.id_nodo_editar = id_nodo
        this.text = this.nombre_arquetipo
        this._jm.select_clear()
                //alert("intento abrir un estructural")
        $('#modalTipoEstructural').modal('show');
      }
      else{
        this.insertarDatosNodoModal(this.arquetipo,id_nodo)
      }
      


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
    console.log(this.id_nodo_editar)
    if(this.id_nodo_editar == "nodo1"){
      arquetipo["text"] = nuevo_data_nodo["nombre"]
      this.nombre_arquetipo = arquetipo["text"]
      this._jm.update_node(this.id_nodo_editar, arquetipo["text"]);
    }
    else{

    
      for (var k in arquetipo){
        if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
          if (this.id_nodo_editar == arquetipo[k]["id_nodo"]){ //si encuentra el nodo
            //console.log(nuevo_data_nodo)
            if (nuevo_data_nodo["nombre"])
            { 
              arquetipo[k]["text"] = nuevo_data_nodo["nombre"]
              
              
            }else{
              arquetipo[k]["tipo"] = nuevo_data_nodo["tipo"]
              arquetipo[k]["text"] = nuevo_data_nodo["text"]
              arquetipo[k]["description"] = nuevo_data_nodo["description"]
              arquetipo[k]["comment"] = nuevo_data_nodo["comment"]
              arquetipo[k]["source"] = nuevo_data_nodo["source"]

              arquetipo[k]["contenido"] = nuevo_data_nodo["contenido"]//this.contenido
              
            }

            this._jm.update_node(this.id_nodo_editar, arquetipo[k]["text"]);

            

              
            //abrir modal

          }
          this.BuscarEditarNodo(arquetipo[k],nuevo_data_nodo);
        }
      }
    }
    return arquetipo

  }
  //Se obtienen los principales datos del modal: name, description, comment y source. (todos los nodos los tienen)
  agrgarNodoToContenido(){
    if(this.tipo_nodo_elegido == "DV_ORDINAL"){
      this.contenido.push({"text":"", "description":"", "numero":""})
    }
    else{
      this.contenido.push({"text":"", "description":""})
    }
  }
  deleteContenidoNodo(indice:number){
    this.contenido.splice(indice, 1)
    //console.log(this.contenido)
  }
  public trackItem (index: number, item) {
    return index;
  }
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

    var contenido = []
    for(let i = 0; i < this.contenido.length; i++){
      //console.log(datos_modal.value["contenido_description"+i.toString()])
      let contenido_text = datos_modal.value["contenido_text"+i.toString()]
      let contenido_description = datos_modal.value["contenido_description"+i.toString()]
      
      if(this.tipo_nodo_elegido == "DV_ORDINAL"){
        let contenido_numero = datos_modal.value["contenido_numero"+i.toString()]
        contenido.push({"text":contenido_text, "description":contenido_description, "numero":contenido_numero})
      }
      else {
        contenido.push({"text":contenido_text, "description":contenido_description})
      }
      //this.contenido[i]["description"] = contenido_description
      
    }
    console.log(this.tipo_nodo_elegido)
    //console.log(contenido)
    var nuevo_data_nodo = {"tipo":tipo,"text":text,  "description":description, "comment":comment, "source":source, "contenido":contenido}
    
    return nuevo_data_nodo
  }
  
  //cuando hace clic en editar en el modal, esta funcion toma y procesa los nuevos datos y llama
  // a BuscarEditarNodo que buscara nuevamente el nodo y lo editara con los nuevos datos

  editarNodoEstructural(datos_modal_3: NgForm){
    console.log("editaremos un estructural!")
    //console.log(datos_modal_3.value)
    this.arquetipo = this.BuscarEditarNodo(this.arquetipo, datos_modal_3.value);
  }
  editarNodoTipo2(datos_modal_2: NgForm){
    //console.log("Modal tipo dos: coded text")
    console.log("datos_modal_2!!!:")
    console.log(datos_modal_2.value)
    //console.log(this.contenido)
    
    //Si es de tipo uno (los que solo contienen los datos base)
    
    $('#modalTipo1').modal('toggle');
    
    var nuevo_data_nodo = this.obtenerDatosBase(datos_modal_2)
    //console.log(nuevo_data_nodo)
    this.arquetipo = this.BuscarEditarNodo(this.arquetipo,nuevo_data_nodo);
    //console.log("arquetipo editado")
    //console.log(this.arquetipo)
    datos_modal_2.reset()

    
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
    console.log(arquetipo)
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
    if(selected_node["id"] == "nodo1"){
      this.nuevo_nodo_is_estructural = true
      //this.createNewNodoForm
      this.createNewNodoForm.controls["tipo"].setValue('estructural')
    }
    else{
      this.nuevo_nodo_is_estructural = false
      this.createNewNodoForm.controls["tipo"].setValue('')
    }
      

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
        //console.log(arquetipo[k]["id_nodo"])
        //console.log(arquetipo[k]["text"]+": "+jsMind.util.uuid.newid())
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

          /*this.num_nuevo_nodo = 1
          this.asignarNuevoNumId(this.arquetipo)
          var id_nuevo_nodo = "nodo"+(this.num_nuevo_nodo)*/

          let id_nuevo_nodo = jsMind.util.uuid.newid()

          arquetipo[k][clave_nuevo_nodo]["id_nodo"] = id_nuevo_nodo

          //para el diagrama jsmind
          console.log(this._jm.get_selected_node())
          //var selected_node = this._jm.get_selected_node();
          var color = "#D8D8D8"
          //this.myData.push({"id":obj[k]["id_nodo"], "parentid":obj["id_nodo"],"direction":direction, "topic":obj[k]["text"], "background-color":color, "foreground-color":"black"})
          var node = this._jm.add_node(this.selected_node, id_nuevo_nodo, nuevo_data_nodo["nombre"], {"background-color":color, "foreground-color":"black"});

        }
        this.buscarCrearNodo(arquetipo[k],nuevo_data_nodo);
      }

    }
    return arquetipo
  }

  /*crearNuevoNodo(){
    console.log(this.createNewNodoForm.value)
  }*/
  
  crearNuevoNodo(){
    console.log(this.createNewNodoForm.value)
    $('#modalConfiguracionNuevoNodo').modal('toggle');
    if(this.id_nodo_padre_nuevo == "nodo1"){
      //hago lo mismo de buscarCrearNodo pero teniendo padre al nodo base
      var cantidad_nodos_hijos = (Object.keys(this.arquetipo).length) - 4
      //clave del nuevo nodo
      var num_clave_nuevo_nodo = cantidad_nodos_hijos + 1
      var clave_nuevo_nodo = "estructura" + num_clave_nuevo_nodo
      this.arquetipo[clave_nuevo_nodo] = {}      
      this.arquetipo[clave_nuevo_nodo]["text"] = this.createNewNodoForm.value["nombre"]
      this.arquetipo[clave_nuevo_nodo]["tipo"] = this.createNewNodoForm.value["tipo"]//"estructural"
      this.num_nuevo_nodo = 1
      this.asignarNuevoNumId(this.arquetipo)
      var id_nuevo_nodo = "nodo"+(this.num_nuevo_nodo)
      this.arquetipo[clave_nuevo_nodo]["id_nodo"] = id_nuevo_nodo
      //para el diagrama jsmind
      var color = "#A4A4A4"
      var node = this._jm.add_node(this.selected_node, id_nuevo_nodo, this.createNewNodoForm.value["nombre"],{"background-color":color, "foreground-color":"black"});


    }else{
      this.arquetipo = this.buscarCrearNodo(this.arquetipo, this.createNewNodoForm.value)
    }

    this.mensajeAlerta = "hay nuevos cambios realizados en el diagrama"
  }
  

  nuevoArquetipo(){
    //this.show_form_new_archetype = false
    console.log(this.createNewArchetypeForm.value)
    //crear estructutra base
    this.arquetipo = {}
    //nodo root
    this.arquetipo["text"] = this.createNewArchetypeForm.value["name"]
    this.arquetipo["tipo"] = "base"
    this.arquetipo["id_nodo"] = "nodo1"
    this.arquetipo["tipo_arquetipo"] = this.createNewArchetypeForm.value["type"].toUpperCase()//"OBSERVATION"
    //prueba description
    this.arquetipo["estructura1"] = {}
    //this.arquetipo["estructura1"]["id_nodo"] = "nodo2"
    this.arquetipo["estructura1"]["text"] = "description"
    this.arquetipo["estructura1"]["tipo"] = "estructural"

    this.arquetipo["estructura1"]["nodo1"] = {}
    //this.arquetipo["estructura1"]["nodo1"]["id_nodo"] = "nodo3"
    this.arquetipo["estructura1"]["nodo1"]["text"] = "concept description"
    this.arquetipo["estructura1"]["nodo1"]["tipo"] = "info"
    this.arquetipo["estructura1"]["nodo1"]["value"] = this.createNewArchetypeForm.value["concept_description"]

    this.arquetipo["estructura1"]["nodo2"] = {}
    //this.arquetipo["estructura1"]["nodo2"]["id_nodo"] = "nodo4"
    this.arquetipo["estructura1"]["nodo2"]["text"] = "purpose"
    this.arquetipo["estructura1"]["nodo2"]["tipo"] = "info"
    this.arquetipo["estructura1"]["nodo2"]["value"] = this.createNewArchetypeForm.value["purpose"]

    this.arquetipo["estructura1"]["nodo3"] = {}
    //this.arquetipo["estructura1"]["nodo3"]["id_nodo"] = "nodo5"
    this.arquetipo["estructura1"]["nodo3"]["text"] = "use"
    this.arquetipo["estructura1"]["nodo3"]["tipo"] = "info"
    this.arquetipo["estructura1"]["nodo3"]["value"] = this.createNewArchetypeForm.value["use"]

    this.arquetipo["estructura1"]["nodo4"] = {}
    //this.arquetipo["estructura1"]["nodo4"]["id_nodo"] = "nodo6"
    this.arquetipo["estructura1"]["nodo4"]["text"] = "misuse"
    this.arquetipo["estructura1"]["nodo4"]["tipo"] = "info"
    this.arquetipo["estructura1"]["nodo4"]["value"] = this.createNewArchetypeForm.value["misuse"]

    this.arquetipo["estructura1"]["nodo5"] = {}
    //this.arquetipo["estructura1"]["nodo5"]["id_nodo"] = "nodo7"
    this.arquetipo["estructura1"]["nodo5"]["text"] = "references"
    this.arquetipo["estructura1"]["nodo5"]["tipo"] = "info"
    this.arquetipo["estructura1"]["nodo5"]["value"] = this.createNewArchetypeForm.value["references"]

    this.arquetipo["estructura2"] = {}
    //this.arquetipo["estructura2"]["id_nodo"] = "nodo8"
    this.arquetipo["estructura2"]["text"] = "attribution"
    this.arquetipo["estructura2"]["tipo"] = "estructural"

    this.arquetipo["estructura2"]["nodo1"] = {}
    //this.arquetipo["estructura2"]["nodo1"]["id_nodo"] = "nodo9"
    this.arquetipo["estructura2"]["nodo1"]["text"] = "original author"
    this.arquetipo["estructura2"]["nodo1"]["tipo"] = "info"
    this.arquetipo["estructura2"]["nodo1"]["value"] = this.createNewArchetypeForm.value["original_author"]

    //inserto el nodo root
    this.myData.push({"id":this.arquetipo["id_nodo"], "isroot":true, "topic":this.arquetipo["text"]})
    
    this.crearData(this.arquetipo)
    this.configurarJsMind()

    this.conexBack.postArquetipo(this.arquetipo).subscribe(
      data => {
        this.arquetipo["_id"] = data["_id"]
        console.log( this.arquetipo)
      },
      error => {
        console.log('error', error)
      }
    );
    
    $('#modalCrearArquetipo').modal('toggle');
    
  }
  

  crearArchivoJson(){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.arquetipo));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", this.nombre_arquetipo+".json");
  }
  
  ngOnInit() {
    //se usa si quiere crear un nuevo arquetipo
    this.createNewArchetypeForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['',Validators.required],
      concept_description: ['', Validators.required],
      purpose: ['', Validators.required],
      use: ['', Validators.required],
      misuse: ['', Validators.required],
      references: ['', Validators.required],
      original_author: ['', Validators.required],
    })
    this.createNewNodoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      tipo: ['estructural',Validators.required],
    })
    //createNewNodoForm
    //obtener usuario logeado
    this.conexBack.getUser(parseInt(this.conexBack.getIdUser())).subscribe(
      data => {
        this.usuario_logeado = data.username
        //alert(data.user.username)
        //var id_profesional = data.user.id
      },
      error => {
        console.log('error', error)
      }
    );
    //Obtengo id del arquetipo importado
    this.elegirArquetipo.currentArquetipo.subscribe(id_arq => {
      this.arquetipo_id = id_arq
    })
    console.log("id: ",this.arquetipo_id)
    //this.jsPlumbInstance = jsPlumb.getInstance();
    if(this.arquetipo_id==null){
      //volver a inicio
      this.router.navigateByUrl('/visualizador')
    }
    else if(this.arquetipo_id=="nuevo arquetipo"){

      console.log(this.arquetipo_id)
      $('#modalCrearArquetipo').modal('show');
      //this.show_form_new_archetype = true
      
    }
    else{
      this.conexBack.getArquetipoById(this.arquetipo_id).subscribe(arquetipo =>{
        this.dibujarArquetipoImportado(arquetipo),
        this.nombre_arquetipo = arquetipo["text"]
        //this.conexionesDiagramaImportado(jsPlumb,this.jsPlumbInstance,arquetipo,this.contador_nodos)
      })
    }
  }

  ngAfterViewInit(){
    

  }




}
