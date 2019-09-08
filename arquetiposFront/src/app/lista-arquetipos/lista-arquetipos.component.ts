import { Component, OnInit } from '@angular/core';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import { from } from 'rxjs';

@Component({
  selector: 'app-lista-arquetipos',
  templateUrl: './lista-arquetipos.component.html',
  styleUrls: ['./lista-arquetipos.component.css']
})
export class ListaArquetiposComponent implements OnInit {

  constructor( private conexBack: ConexionBackendService) { }

  ngOnInit() {
    //this.conexBack.enviarArchivo("hola qlos");
  }

  fileToUpload: File = null;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if(this.fileToUpload)
      this.conexBack.enviarArchivo(this.fileToUpload).subscribe(data => console.log(data));


  }

}
