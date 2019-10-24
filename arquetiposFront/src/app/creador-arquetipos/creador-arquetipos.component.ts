import { Component, OnInit, AfterViewInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import {NgForm} from '@angular/forms';
import { CrearObjetoService } from '../servicios/crear-objeto.service'
declare var $:any;

@Component({
  selector: 'app-creador-arquetipos',
  templateUrl: './creador-arquetipos.component.html',
  styleUrls: ['./creador-arquetipos.component.css']
})
export class CreadorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private crearObjeto: CrearObjetoService) { }
  nombre_arquetipo = "Nuevo Diagrama"

  myJsPlumb = jsPlumb
  jsPlumbInstance:any = null
  contador_nodos= 0

  ngOnInit() { 
  }
  allowDrop(ev:any) {
    ev.preventDefault();
  }
  drag(ev:any) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  drop(ev:any) {//suelta la figura
    
    ev.preventDefault();
    var tipoFigura = ev.dataTransfer.getData("text");
    //coordenadas del muse respecto al div
    var offset = $("#canvas").offset();
    //se tiene en cuenta el scrollo dentro del div
    var topScroll = $("#canvas").scrollTop();
    var leftScroll = $("#canvas").scrollLeft();

    var xPos = ev.clientX - offset.left + leftScroll
    var yPos = ev.clientY - offset.top + topScroll

    this.agregarNodo(jsPlumb,tipoFigura,xPos, yPos)

  }
  nombreNodo:string
  id_nodo:string
  openModal(id_nodo:string){
    //cambiar nombre de un nodo aqui
    var nodo = document.getElementById(id_nodo)
    this.nombreNodo = nodo.textContent
    this.id_nodo = id_nodo
    //nodo.innerHTML = "watever xd";
    console.log(this.nombreNodo)
    
    $('#modalNodos').modal('show');
  }
  //f2: NgForm
  cambiarNombre(f1: NgForm){
    console.log(f1.value["nuevoNombre"])
    var nodo = document.getElementById(this.id_nodo)
    nodo.innerHTML = f1.value["nuevoNombre"]
  }
  convertPixelToEm(pixel):number{
    var em = pixel/16
    return em
  }
  agregarNodo(myJsPlumb,tipoFigura,xPos, yPos){//solucionado el jsplumb
    //se convierten las coordenadas
    var x = this.convertPixelToEm(xPos)
    var y = this.convertPixelToEm(yPos)
    
    var numeroNodo = this.contador_nodos + 1
    let nombreNodo = "nuevo nodo "+numeroNodo
    //Se dibuja el div
    var myContainer = document.getElementById("canvas");

    var divn = this.crearObjeto.crearNodo("chartWindow"+(numeroNodo).toString(),x,y,tipoFigura)
    
    var divn_titulo = document.createTextNode(nombreNodo);
    divn.appendChild(divn_titulo)
    myContainer.appendChild(divn)
    this.contador_nodos = numeroNodo  
    //doble click a la escucha
    divn.addEventListener("dblclick", (evt) => this.openModal("chartWindow"+(numeroNodo).toString()));
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

  ngAfterViewInit(){
    
    this.jsPlumbInstance = jsPlumb.getInstance();
    var color = "gray";
    this.jsPlumbInstance.connect({
        Connector: [ "Bezier", { curviness: 50 } ],
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        PaintStyle: { stroke: color, strokeWidth: 2 },
        EndpointStyle: { radius: 9, fill: color },
        HoverPaintStyle: {stroke: "#ec9f2e" },
        EndpointHoverStyle: {fill: "#ec9f2e" },
        Container: "canvas"
        
      });

  }
}
