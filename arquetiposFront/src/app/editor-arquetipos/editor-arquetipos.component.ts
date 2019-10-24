import { Component, OnInit, AfterViewInit, ɵConsole } from '@angular/core';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
import { jsPlumb } from 'jsplumb';
import { CrearObjetoService } from '../servicios/crear-objeto.service'
import { AlertPromise } from 'selenium-webdriver';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import {NgForm} from '@angular/forms';

declare var $:any;

@Component({
  selector: 'app-editor-arquetipos',
  templateUrl: './editor-arquetipos.component.html',
  styleUrls: ['./editor-arquetipos.component.css']
})
export class EditorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService,private conexBack: ConexionBackendService) { }

  myJsPlumb = jsPlumb

  arquetipo_id:string
  nombre_arquetipo:string
  nodo_seleccionado_titulo:string
  nodo_seleccionado_detalles:string 
  
  contador_nodos= 0
  jsPlumbInstance:any = null
  
  allowDrop(ev:any) {
    ev.preventDefault();
  }
  drag(ev:any) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  drop(ev:any) {
    ev.preventDefault();
    var tipoFigura = ev.dataTransfer.getData("text");
    //this.agregarNodo(jsPlumb,tipoFigura)

     //coordenadas del muse respecto al div
     var offset = $("#canvas").offset();
     //se tiene en cuenta el scrollo dentro del div
     var topScroll = $("#canvas").scrollTop();
     var leftScroll = $("#canvas").scrollLeft();
 
     var xPos = ev.clientX - offset.left + leftScroll
     var yPos = ev.clientY - offset.top + topScroll
     this.agregarNodo(jsPlumb,tipoFigura,xPos, yPos)
  }
  convertPixelToEm(pixel):number{
    var em = pixel/16
    return em
  }
  dibujarNodo(container, obj_div:any, obj_titulo:any){
    obj_div.appendChild(obj_titulo)
    container.appendChild(obj_div)
    this.contador_nodos = this.contador_nodos +1
  }
  calcularEspacio(estructura:any):number{
    var espacio_entre_nodos = 10
    var espacio_total = espacio_entre_nodos*estructura.length
    return espacio_total
  }
  /*dibujarNodosEnLista(estructura,xInicio,yInicio){

  }*/
  dibujarArquetipoImportado(arquetipo){
    //console.log(arquetipo["items"])
    console.log(arquetipo)
    var espacio_entre_nodos=0
    var myContainer = document.getElementById("canvas");
    //div nombre (todos lo tienen)
    var div1 = this.crearObjeto.crearNodo("chartWindow1",50,30,"figura1")
    var div1_titulo = document.createTextNode(arquetipo["nombre"]);
    this.dibujarNodo(myContainer,div1,div1_titulo)
    if(arquetipo["tipo"]=="CLUSTER"){
      //Se dibuja estructura items
      var div2 = this.crearObjeto.crearNodo("chartWindow2",35,20,"figura2")
      var div2_titulo = document.createTextNode("items");
      this.dibujarNodo(myContainer,div2,div2_titulo)
      //Se dibuja estructura description
      var estructura2 = this.crearObjeto.crearNodo("chartWindow3",50,20,"figura2")
      var estructura2_titulo = document.createTextNode("description");
      this.dibujarNodo(myContainer,estructura2,estructura2_titulo)
      console.log("espacio puto: "+this.calcularEspacio(Object.keys(arquetipo["description"])))
      //Se dibuja estructura attribution
      var yEstructura3 = this.calcularEspacio(Object.keys(arquetipo["description"])) +  this.calcularEspacio(Object.keys(arquetipo["atribution"])) - ((this.calcularEspacio(Object.keys(arquetipo["atribution"]))/2))
      console.log("y: "+yEstructura3)
      var estructura3 = this.crearObjeto.crearNodo("chartWindow4",50,yEstructura3,"figura2")
      var estructura3_titulo = document.createTextNode("atribution");
      this.dibujarNodo(myContainer,estructura3,estructura3_titulo)

      var comenzar_desde = this.contador_nodos
      //se dibujan todos los items
      for (let i=1; i< arquetipo["items"].length; i++){//parte de 1 porque el primero es el nombre
        var newItem = this.crearObjeto.crearNodo("chartWindow"+(i+comenzar_desde).toString(),5,espacio_entre_nodos,"figura3")
        espacio_entre_nodos += 5
        var item_titulo = document.createTextNode(arquetipo["items"][i][0]);
        //console.log("items: "+(i+3))
        newItem.addEventListener("dblclick", (evt) => this.openModal(arquetipo["items"], i, 2));

        this.dibujarNodo(myContainer, newItem, item_titulo)
      }

      espacio_entre_nodos = 0
      var comenzar_desde = this.contador_nodos
      var keys_description = Object.keys(arquetipo["description"]);
      for (let i=0; i< keys_description.length; i++){
        var newItem = this.crearObjeto.crearNodo("chartWindow"+(i+comenzar_desde+1).toString(),80,espacio_entre_nodos,"figura3")
        espacio_entre_nodos += 5
        var item_titulo = document.createTextNode(keys_description[i]);

        newItem.addEventListener("dblclick", (evt) => this.openModal(arquetipo["description"],i,1));

        this.dibujarNodo(myContainer, newItem, item_titulo)

      }


      var comenzar_desde = this.contador_nodos
      var keys_atribution = Object.keys(arquetipo["atribution"]);
      for (let i=0; i< keys_atribution.length; i++){
        var newItem = this.crearObjeto.crearNodo("chartWindow"+(i+comenzar_desde+1).toString(),80,espacio_entre_nodos,"figura3")
        espacio_entre_nodos += 5
        var item_titulo = document.createTextNode(keys_atribution[i]);

        newItem.addEventListener("dblclick", (evt) => this.openModal(arquetipo["atribution"],i,1));

        this.dibujarNodo(myContainer, newItem, item_titulo)
      }

    }
    
 
  }
  /*openModal(posicion_item,arquetipo){
    //alert("Se abrira modal para el item "+ posicion_item)
    this.nodo_seleccionado_titulo = arquetipo["items"][posicion_item][0]
    this.nodo_seleccionado_detalles = arquetipo["items"][posicion_item][1]
    $('#modalItems').modal('show');

  }*/
  openModal(estructura:any, posicion:number, tipo_estructura:number){
    if(tipo_estructura==1){//json
      var claves = Object.keys(estructura)
      this.nodo_seleccionado_titulo = claves[posicion]
      this.nodo_seleccionado_detalles =estructura[claves[posicion]]
    }
    if(tipo_estructura==2){//aray 2d
      this.nodo_seleccionado_titulo = estructura[posicion][0]
      this.nodo_seleccionado_detalles =  estructura[posicion][1]
    }
    $('#modalItems').modal('show');
  }
  
  ngOnInit() {
    //Obtengo id del arquetipo importado
    this.elegirArquetipo.currentArquetipo.subscribe(id_arq => {
      this.arquetipo_id = id_arq
    })
    
  }

  ngAfterViewInit(){
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.conexBack.getArquetipoById(this.arquetipo_id).subscribe(arquetipo =>{
      this.nombre_arquetipo = arquetipo["nombre"]
      this.dibujarArquetipoImportado(arquetipo),
      this.conexionesDiagramaImportado(jsPlumb,this.jsPlumbInstance,arquetipo,this.contador_nodos)
    })

  }
  test:number = 7
  agregarNodo(myJsPlumb,tipoFigura, xPos, yPos){//solucionado el jsplumb
    
    var x = this.convertPixelToEm(xPos)
    var y = this.convertPixelToEm(yPos)

    var numeroNodo = this.contador_nodos + 1
    var nombreNodo = "nuevo nodo "+numeroNodo
    //Se dibuja el div
    var myContainer = document.getElementById("canvas");

    var divn = this.crearObjeto.crearNodo("chartWindow"+(numeroNodo).toString(),x,y,tipoFigura)
    
    var divn_titulo = document.createTextNode(nombreNodo);
    divn.appendChild(divn_titulo)
    myContainer.appendChild(divn)
    this.contador_nodos = numeroNodo  
    //se le dan propiedades de jsplum
    var windows = myJsPlumb.getSelector(".chart-demo .window");

    //console.log(windows[windows.length-1])
    var endpointOptions = { isSource:true, isTarget:true };
      this.jsPlumbInstance.addEndpoint(windows[windows.length-1], {
        uuid: windows[windows.length-1].getAttribute("id") + "-left",
        anchor: "Left",
        maxConnections: -1,
        
    },endpointOptions);
    this.jsPlumbInstance.addEndpoint(windows[windows.length-1], {
        uuid: windows[windows.length-1].getAttribute("id") + "-right",
        anchor: "Right",
        maxConnections: -1,
        
    },endpointOptions);
    this.jsPlumbInstance.draggable(windows[windows.length-1]);

  }

  conexionesDiagramaImportado(jsPlumb, jsPlumbInstance, arquetipo, contador_nodos:number) {
    var color = "gray";
    function unirListaNodos(num_estructura, desde, hasta) {
      for (var i=desde; i > hasta; i--){
        jsPlumbInstance.connect({uuids: ["chartWindow"+num_estructura.toString()+"-right", "chartWindow"+(i).toString()+"-left" ]});
      }
    }
    jsPlumbInstance.connect({
        Connector: [ "Bezier", { curviness: 50 } ],
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        PaintStyle: { stroke: color, strokeWidth: 2 },
        EndpointStyle: { radius: 9, fill: color },
        HoverPaintStyle: {stroke: "#ec9f2e" },
        EndpointHoverStyle: {fill: "#ec9f2e" },
        Container: "canvas"
        
      });
      jsPlumbInstance.batch(function () {

        var windows = jsPlumb.getSelector(".chart-demo .window");
        //console.log(windows[1])
        var endpointOptions = { isSource:true, isTarget:true }; 
        for (var i = 0; i < windows.length; i++) {
          //console.log(i)
          jsPlumbInstance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-left",
                anchor: "Left",
                maxConnections: -1,
                
            },endpointOptions);
            jsPlumbInstance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-right",
                anchor: "Right",
                maxConnections: -1,
                
            },endpointOptions);
        }

        //conecta div de union de items con div root (que dice el nombre del arquetipo)
        if(arquetipo["tipo"]=="CLUSTER"){
          //nombre con item
          jsPlumbInstance.connect({uuids: ["chartWindow1-left", "chartWindow2-right" ]});
          //nombre con description
          jsPlumbInstance.connect({uuids: ["chartWindow1-right", "chartWindow3-left" ]});
          //nombre con atribution
          jsPlumbInstance.connect({uuids: ["chartWindow1-right", "chartWindow4-left" ]});
          //conecta div de union de items con todos los items
          for (var i=1; i< arquetipo["items"].length; i++){
            jsPlumbInstance.connect({uuids: ["chartWindow2-left", "chartWindow"+(i+4).toString()+"-right" ]});
          }

          var hasta = contador_nodos-Object.keys(arquetipo["atribution"]).length
          var desde = contador_nodos
          
          unirListaNodos(4, desde, hasta)//4=atribution
          desde = hasta
          hasta = desde -Object.keys(arquetipo["description"]).length
          unirListaNodos(3, desde, hasta)//4=atribution
        }

        jsPlumbInstance.draggable(windows);

    });
    this.jsPlumbInstance = jsPlumbInstance
    

  }

}
