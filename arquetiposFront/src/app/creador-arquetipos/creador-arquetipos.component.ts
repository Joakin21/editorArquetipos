import { Component, OnInit, AfterViewInit } from '@angular/core';
import { jsPlumb } from 'jsplumb';
import {NgForm} from '@angular/forms';
import { CrearObjetoService } from '../servicios/crear-objeto.service'

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
