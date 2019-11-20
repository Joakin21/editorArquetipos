import { Component, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
//import { jsPlumb } from 'jsplumb';
import { MindMapMain } from 'jsmind';
import { CrearObjetoService } from '../servicios/crear-objeto.service'
import { AlertPromise } from 'selenium-webdriver';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import {NgForm, FormGroup} from '@angular/forms';

declare var $:any;
declare var jsMind:any

@Component({
  selector: 'app-editor-arquetipos',
  templateUrl: './editor-arquetipos.component.html',
  styleUrls: ['./editor-arquetipos.component.css']
})
export class EditorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService,private conexBack: ConexionBackendService) { }
  datos_modal_1: FormGroup
  arquetipo_id:string
  myContainer:any
  
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
    //Se deselecciona el nodo del jsmind para no tener problemas en el modal
    this._jm.select_clear()

  }
  mensajeContenido:string = ""
  mensajeEdicion:string = ""
  tipo_nodo_elegido:string

  insertarDatosNodoModal(arquetipo,id_nodo){//luego intentar mejorar num iteraciones 
    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
        if (id_nodo == arquetipo[k]["id_nodo"]){ //si encuentra el nodo
          this.limpiarAtributosNodos()
          //this.contenido = []
          this.id_nodo_editar = id_nodo
          this.tipo_nodo_elegido = arquetipo[k]["contenido"]
          
          this.LLenarModalDatosBase(arquetipo[k])
          this.contenido = arquetipo[k]["contenido"]

          if(arquetipo[k]["tipo"] == "CHOICE"){
            this.mensajeContenido = "Choice of"
            this.mensajeEdicion = "Editar opciones disponibles"
            $('#modalTipoDos').modal('show');
          }
          else if(arquetipo[k]["tipo"] == "DV_CODED_TEXT"){
            this.mensajeContenido = "Contenido"
            this.mensajeEdicion = "Editar contenido"
            $('#modalTipoDos').modal('show');

          }
          else if(arquetipo[k]["tipo"] == "DV_ORDINAL"){
            alert("no para DV_ORDINAL")
          }
          else if(arquetipo[k]["tipo"] == "careflow_step"){
            alert("no para careflow_step")
          }
          
          else{
            //this.LLenarModalDatosBase(arquetipo[k])
            $('#modalTipoUno').modal('show');

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


  BuscarEditarNodo(arquetipo,nuevo_data_nodo){//luego intentar mejorar num iteraciones 
    for (var k in arquetipo){
      if (typeof arquetipo[k] == "object" && arquetipo[k] !== null && !Array.isArray(arquetipo[k])){
        if (this.id_nodo_editar == arquetipo[k]["id_nodo"]){ //si encuentra el nodo

          /*if(arquetipo[k]["tipo"] == "CHOICE"){
            alert("no para CHOICE")
          }
          else if(arquetipo[k]["tipo"] == "DV_CODED_TEXT"){
            alert("no para DV_CODED_TEXT")
          }
          else if(arquetipo[k]["tipo"] == "DV_ORDINAL"){
            alert("no para DV_ORDINAL")
          }
          else if(arquetipo[k]["tipo"] == "careflow_step"){
            alert("no para careflow_step")
          }
          
          else{
            arquetipo[k]["tipo"] = nuevo_data_nodo["tipo"]
            arquetipo[k]["text"] = nuevo_data_nodo["text"]
            arquetipo[k]["description"] = nuevo_data_nodo["description"]
            arquetipo[k]["comment"] = nuevo_data_nodo["comment"]
            arquetipo[k]["source"] = nuevo_data_nodo["source"]

            this._jm.update_node(this.id_nodo_editar, nuevo_data_nodo["text"]);

            
          }*/
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
  editarNodoTipo1(datos_modal_1: NgForm){

    $('#modalTipoUno').modal('toggle');
    
    var nuevo_data_nodo = this.obtenerDatosBase(datos_modal_1)
    this.arquetipo = this.BuscarEditarNodo(this.arquetipo,nuevo_data_nodo);
    console.log("arquetipo editado")
    console.log(this.arquetipo)
    datos_modal_1.reset()

    
  }
  editarNodoTipo2(datos_modal_2: NgForm){
    //console.log("Modal tipo dos: coded text")
    var opcion_elegida_contenido = datos_modal_2.value["optradio"]
    console.log(opcion_elegida_contenido)
    if(opcion_elegida_contenido!= "noCambiar"){
      var nombre_nodo = datos_modal_2.value["nombre_nodo_contenido"]
      var description_nodo = datos_modal_2.value["description_nodo_contenido"]
      if(opcion_elegida_contenido!= "nuevo"){//Si quiere cambiar el contenido de uno de los nodos
        for (var i=0; i< this.contenido.length; i++){
          if(this.contenido[i]["text"] == opcion_elegida_contenido){
            this.contenido[i]["text"] = nombre_nodo
            this.contenido[i]["description"] = description_nodo
          }
        }
      }
      else{//Si va por crear nuevo
        this.contenido.push({"text":nombre_nodo, "description":description_nodo})
      }
    }
    else{//si no cambia en contenido, cierro el modal
      $('#modalTipoDos').modal('toggle');

      var nuevo_data_nodo = this.obtenerDatosBase(datos_modal_2)
      this.arquetipo = this.BuscarEditarNodo(this.arquetipo,nuevo_data_nodo);
      console.log("arquetipo editado")
      console.log(this.arquetipo)
      datos_modal_2.reset()
      
    }
  }
  dibujarArquetipoImportado(arquetipo){
    var estructuras = Object.keys(arquetipo)
    
    //delete arquetipo[estructuras[estructuras.length-1]];
    
    //delete arquetipo[estructuras[estructuras.length-2]];
    
    arquetipo["id_nodo"] ="nodo1"
    this.myData.push({"id":arquetipo["id_nodo"], "isroot":true, "topic":arquetipo["text"]})
    this.crearData(arquetipo)
    console.log(arquetipo)
    this.arquetipo = arquetipo

    //prueba jsmind
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

  guardarArquetipo(){
    this.conexBack.updateArquetipo(this.arquetipo).subscribe(result => console.log(result))
  }
  
  ngOnInit() {
    //Obtengo id del arquetipo importado
    this.elegirArquetipo.currentArquetipo.subscribe(id_arq => {
      this.arquetipo_id = id_arq
    })
    
  }

  ngAfterViewInit(){
    this.myContainer = document.getElementById("canvas");
    //this.jsPlumbInstance = jsPlumb.getInstance();
    this.conexBack.getArquetipoById(this.arquetipo_id).subscribe(arquetipo =>{
      this.dibujarArquetipoImportado(arquetipo)
      //this.conexionesDiagramaImportado(jsPlumb,this.jsPlumbInstance,arquetipo,this.contador_nodos)
    })

  }




}
