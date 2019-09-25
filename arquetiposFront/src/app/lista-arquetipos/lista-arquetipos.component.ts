import { Component, OnInit } from '@angular/core';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import {Router} from '@angular/router';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
import { CrearObjetoService } from '../servicios/crear-objeto.service'

var routerLink
@Component({
  selector: 'app-lista-arquetipos',
  templateUrl: './lista-arquetipos.component.html',
  styleUrls: ['./lista-arquetipos.component.css']
})
export class ListaArquetiposComponent implements OnInit {

  constructor(private router: Router,private conexBack: ConexionBackendService, private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService) { }

  arquetipos: string[] = []

  ngOnInit() {
  
  }

  fileToUpload: File = null;

  importarArchivo(files: FileList) {
    this.fileToUpload = files.item(0);
    if(this.fileToUpload)
      this.conexBack.enviarArchivo(this.fileToUpload).subscribe(data => this.agregarArquetipoDiv(data));

  }
  seleccionarArquetipo(arquetipo:any){
    this.elegirArquetipo.asignar(arquetipo)
  }
  agregarArquetipoDiv(arquetipo: any){

    var titulo = arquetipo["items"][0][0];
    var newArquetipoDiv = this.crearObjeto.crearArquetipoDiv(titulo)
    var editorButton = this.crearObjeto.crearBotonArquetipoDiv()
    editorButton.addEventListener ("click", (evt) => this.seleccionarArquetipo(arquetipo));
    editorButton.addEventListener ("click", (evt) => this.router.navigateByUrl('/editor'));
    
    
    var padreDiv = document.getElementById("listaArqueripos"); 
    newArquetipoDiv.appendChild(editorButton);
    padreDiv.appendChild(newArquetipoDiv);
  }

}
