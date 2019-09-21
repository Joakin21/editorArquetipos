import { Component, OnInit, AfterViewInit } from '@angular/core';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
import { jsPlumb } from 'jsplumb';

@Component({
  selector: 'app-editor-arquetipos',
  templateUrl: './editor-arquetipos.component.html',
  styleUrls: ['./editor-arquetipos.component.css']
})
export class EditorArquetiposComponent implements OnInit,AfterViewInit {

  constructor(private elegirArquetipo: SeleccionArquetipoService) { }

  arquetipo:any;
  jsPlumbInstance;

  ngOnInit() {
    this.elegirArquetipo.currentArquetipo.subscribe(data => this.arquetipo = data)
    console.log(this.arquetipo["items"][0][0])
  }
  ngAfterViewInit(){
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.connectSourceToTargetUsingJSPlumb()
    
  }

  connectSourceToTargetUsingJSPlumb() {
    let labelName;
      labelName = 'connection';
      this.jsPlumbInstance.connect({
        connector: ['Flowchart', {stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true}],
        source: 'Source',
        target: 'Target1',
        anchor: ['Right', 'Left'],
        paintStyle: {stroke: '#456', strokeWidth: 4},
        
      });
  }

}
