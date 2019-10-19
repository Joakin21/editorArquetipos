import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  item_seleccionado_titulo:string
  item_seleccionado_detalles:string 
  
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
    var data = ev.dataTransfer.getData("text");//drag1 (id)
    ev.target.appendChild(document.getElementById(data));

    //le asigno el mismo elemento al panel de figuras
    var panelFiguras = document.getElementById("panelFiguras");//obtengo panel
    var figura = document.createElement("IMG");
    figura.setAttribute("src", "assets/circuloPrueba.jpg");
    figura.setAttribute("width", "50");
    figura.setAttribute("height", "50");
    panelFiguras.appendChild(figura)
    /*
    var x = ev.clientX;
    var y = ev.clientY;
    console.log("mouse x: "+x)
    console.log("mouse y: "+y)
    */
  }
  
  dibujarItems(arquetipo){
    //console.log(arquetipo["items"])
    var nombre_items = []
    var espacio_entre_items=0
    var myContainer = document.getElementById("canvas");
    //creo divs base del arquetipo (en este caso los divs union items y nombre)
    var div1 = this.crearObjeto.crearItem("chartWindow2",35,20)//union items
    var div1_titulo = document.createTextNode("items");
    div1.appendChild(div1_titulo)
    myContainer.appendChild(div1)
    this.contador_nodos = this.contador_nodos +1
    //div nombre
    var div2 = this.crearObjeto.crearItem("chartWindow1",50,20)
    var div2_titulo = document.createTextNode(arquetipo["nombre"]);
    div2.appendChild(div2_titulo)
    myContainer.appendChild(div2)
    this.contador_nodos = this.contador_nodos +1
    //crea todos los div de items
    for (let i=1; i< arquetipo["items"].length; i++){
      //console.log(arquetipo["items"][i][0])
      var newItem = this.crearObjeto.crearItem("chartWindow"+(i+2).toString(),5,1+espacio_entre_items)
      espacio_entre_items += 10
      var item_titulo = document.createTextNode(arquetipo["items"][i][0]);
      
      newItem.addEventListener("dblclick", (evt) => this.openModal(i,arquetipo));

      newItem.appendChild(item_titulo)
      myContainer.appendChild(newItem)
      this.contador_nodos = this.contador_nodos +1
    }
    
 
  }
  openModal(posicion_item,arquetipo){
    //alert("Se abrira modal para el item "+ posicion_item)
    this.item_seleccionado_titulo = arquetipo["items"][posicion_item][0]
    this.item_seleccionado_detalles = arquetipo["items"][posicion_item][1]
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
      this.dibujarItems(arquetipo),
      this.conexionesDiagramaImportado(jsPlumb,this.jsPlumbInstance,arquetipo)
    })

  }
  test:number = 7
  agregarNodo(f2: NgForm, myJsPlumb){//solucionado el jsplumb
    var nombreNodo = f2.value["nodo"]
    var numeroNodo = this.contador_nodos + 1
    //Se dibuja el div
    var myContainer = document.getElementById("canvas");
    var divn = this.crearObjeto.crearItem("chartWindow"+(numeroNodo).toString(),30,10)//union items
    var divn_titulo = document.createTextNode(nombreNodo);
    divn.appendChild(divn_titulo)
    myContainer.appendChild(divn)
    this.contador_nodos = numeroNodo  
    //se le dan propiedades de jsplum
    var windows = myJsPlumb.getSelector(".chart-demo .window");

    console.log(windows[windows.length-1])
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

  conexionesDiagramaImportado(jsPlumb, jsPlumbInstance, arquetipo) {
    var color = "gray";
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
        jsPlumbInstance.connect({uuids: ["chartWindow1-left", "chartWindow2-right" ]});
        //conecta div de union de items con todos los items
        for (var i=1; i< arquetipo["items"].length; i++){
          jsPlumbInstance.connect({uuids: ["chartWindow2-left", "chartWindow"+(i+2).toString()+"-right" ]});
        }

        jsPlumbInstance.draggable(windows);

    });
    this.jsPlumbInstance = jsPlumbInstance
    

  }

}
