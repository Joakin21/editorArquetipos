import { Component, OnInit } from '@angular/core';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import { from } from 'rxjs';
import {Router} from '@angular/router';


var routerLink
@Component({
  selector: 'app-lista-arquetipos',
  templateUrl: './lista-arquetipos.component.html',
  styleUrls: ['./lista-arquetipos.component.css']
})
export class ListaArquetiposComponent implements OnInit {

  constructor(private router: Router,private conexBack: ConexionBackendService) { }

  arquetipos: string[] = []

  ngOnInit() {
    
    /*var newArquetipoDiv = document.createElement("div"); 
    newArquetipoDiv.className += "d-inline bg-success mr-1"
    var newContent = document.createTextNode("Hola!¿Qué tal?"); 
    newArquetipoDiv.appendChild(newContent); 
    var padreDiv = document.getElementById("listaArqueripos"); 
    padreDiv.appendChild(newArquetipoDiv);*/
    
    //document.body.insertBefore(newArquetipoDiv, currentDiv);
  
  }

  fileToUpload: File = null;

  importarArchivo(files: FileList) {
    this.fileToUpload = files.item(0);
    if(this.fileToUpload)
      this.conexBack.enviarArchivo(this.fileToUpload).subscribe(data => this.agregarArquetipoDiv(data));

  }
  saludar(){
    this.router.navigateByUrl('/editor');
  }
  agregarArquetipoDiv(titulo){
    var newArquetipoDiv = document.createElement("div"); 
    newArquetipoDiv.style.backgroundColor="white";
    newArquetipoDiv.style.width="200px";
    newArquetipoDiv.style.height="100px";
    newArquetipoDiv.style.margin="1em";
    newArquetipoDiv.style.display="inline-block";
    newArquetipoDiv.style.textAlign="center";
    //newArquetipoDiv.className += "h-75 d-inline bg-info mr-1"    
    var arqTitulo = document.createTextNode(titulo); 
    //<a routerLink="/editor"><button > Nuevo Arquetipor</button></a>

    var editorButton = document.createElement("BUTTON");
    editorButton.innerHTML = "Editar";
    editorButton.addEventListener ("click", (evt) => this.saludar());
    editorButton.style.padding="5px 24px";

    var padreDiv = document.getElementById("listaArqueripos"); 


    newArquetipoDiv.appendChild(arqTitulo); 
    newArquetipoDiv.appendChild(editorButton);
    padreDiv.appendChild(newArquetipoDiv);
  }

}
