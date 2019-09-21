import { Component, OnInit, AfterViewInit } from '@angular/core';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
import { jsPlumb } from 'jsplumb';
import { CrearObjetoService } from '../servicios/crear-objeto.service'

@Component({
  selector: 'app-editor-arquetipos',
  templateUrl: './editor-arquetipos.component.html',
  styleUrls: ['./editor-arquetipos.component.css']
})
export class EditorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService) { }

  arquetipo:any;
  nombre_arquetipo:string;
  
  dibujarItems(arquetipo){
    //console.log(arquetipo["items"])
    var nombre_items = []
    var espacio_entre_items=0
    var myContainer = document.getElementById("canvas");
    for (var i=1; i< arquetipo["items"].length; i++){
      //console.log(arquetipo["items"][i][0])
      var newItem = this.crearObjeto.crearItem("chartWindow"+(i+2).toString(),5,1+espacio_entre_items)
      espacio_entre_items += 10
      var item_titulo = document.createTextNode(arquetipo["items"][i][0]);
      newItem.appendChild(item_titulo)
      myContainer.appendChild(newItem)
    }
 
  }
  
  ngOnInit() {
    this.elegirArquetipo.currentArquetipo.subscribe(data => this.arquetipo = data)
    this.nombre_arquetipo = this.arquetipo["items"][0][0]
    
  }
  ngAfterViewInit(){
    this.dibujarItems(this.arquetipo)
    var jsPlumbInstance = jsPlumb.getInstance();
    this.connectSourceToTargetUsingJSPlumb(jsPlumb,jsPlumbInstance,this.arquetipo)
    
  }

  connectSourceToTargetUsingJSPlumb(jsPlumb, jsPlumbInstance, arquetipo) {
    
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
        // declare some common values:
        var arrowCommon = { foldback: 0.7, fill: color, width: 14 },
        // use three-arg spec to create two different arrows with the common values:
            overlays = [
                [ "Arrow", { location: 0.7 }, arrowCommon ],
                [ "Arrow", { location: 0.3, direction: -1 }, arrowCommon ]
            ];

        // add endpoints, giving them a UUID.
        // you DO NOT NEED to use this method. You can use your library's selector method.
        // the jsPlumb demos use it so that the code can be shared between all three libraries.
        var windows = jsPlumb.getSelector(".chart-demo .window");
        for (var i = 0; i < windows.length; i++) {
          //console.log(i)
          jsPlumbInstance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-left",
                anchor: "Left",
                maxConnections: -1
            });
            jsPlumbInstance.addEndpoint(windows[i], {
                uuid: windows[i].getAttribute("id") + "-right",
                anchor: "Right",
                maxConnections: -1
            });
        }

       
        jsPlumbInstance.connect({uuids: ["chartWindow1-left", "chartWindow2-right" ], overlays: overlays});
        //jsPlumbInstance.connect({uuids: ["chartWindow2-left", "chartWindow3-right" ], overlays: overlays});
        for (var i=1; i< arquetipo["items"].length; i++){
          //console.log(arquetipo["items"][i][0])
          jsPlumbInstance.connect({uuids: ["chartWindow2-left", "chartWindow"+(i+2).toString()+"-right" ], overlays: overlays});
        }
        jsPlumbInstance.draggable(windows);

    });
    
    

  }

}
