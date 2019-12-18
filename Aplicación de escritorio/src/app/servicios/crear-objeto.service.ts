import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrearObjetoService {

  constructor() { }

  ancho:string = "160px"

  crearArquetipoDiv(titulo:string,id_div:string):any{

    //Creacion del div arquetipo
    var newArquetipoDiv = document.createElement("div"); 
    newArquetipoDiv.style.backgroundColor="white";
    newArquetipoDiv.style.width=this.ancho
    newArquetipoDiv.style.height = "150px"
    newArquetipoDiv.style.margin="1em";
    newArquetipoDiv.style.position = "relative"
    newArquetipoDiv.style.display="inline-block";
    newArquetipoDiv.setAttribute("id",id_div)
    //crear div que contiene el titulo
    var titulo_div = document.createElement("div"); 
    titulo_div.innerHTML=titulo
    //titulo_div.style.backgroundColor="gray"
    titulo_div.style.textAlign="center"
    titulo_div.style.overflow = "hidden"
    titulo_div.style.whiteSpace = "nowrap"
    titulo_div.style.width=this.ancho
    titulo_div.style.height="30px"
    titulo_div.style.paddingLeft = "5px"
    titulo_div.style.paddingRight = "5px"
    titulo_div.style.textOverflow="ellipsis"

    titulo_div.style.top = "50%"
    titulo_div.style.position = "absolute"
    titulo_div.style.transform = "translateY(-50%)"

    newArquetipoDiv.appendChild(titulo_div);

    return newArquetipoDiv
  }

  crearBotonArquetipoDiv(tipo:number):any{//1:editar, 2:eliminar
    var editorButton = document.createElement("BUTTON");
    if(tipo == 1){
      editorButton.innerHTML = "edit";
      editorButton.setAttribute("class","btn btn-secondary btn-sm")
    }
    /*if(tipo == 2){
      editorButton.innerHTML = "export";
      editorButton.setAttribute("class","btn btn-secondary btn-sm")
    }*/
    if(tipo == 2){
      editorButton.innerHTML = "delete";
      editorButton.setAttribute("class","btn btn-danger btn-sm")
    }
    
    editorButton.style.position = "relative"
    editorButton.style.display="inline-block";
    return editorButton
  }
  crearDivContenedorBotones(){
    var contenedorBotones = document.createElement("div")
    contenedorBotones.style.left = "50%"
    contenedorBotones.style.position = "absolute"
    contenedorBotones.style.transform = "translateX(-50%)"
    contenedorBotones.style.top = "75%"
    contenedorBotones.style.width=this.ancho
    contenedorBotones.style.textAlign="center"
    return contenedorBotones
  }

}
