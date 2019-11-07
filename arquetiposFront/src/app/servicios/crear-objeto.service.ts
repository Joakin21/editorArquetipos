import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrearObjetoService {

  constructor() { }



  crearNodo(id_item, x:number, y:number,tipoFigura:string):any{//PARA LOS TERMINALES (CAMBIAR NOBRE DE LA FUNCION)
    var left = x.toString()
    var top = y.toString()
    var newItem = document.createElement("div"); 
    newItem.style.border="1px solid #346789";
    newItem.style.textAlign="center";
    newItem.style.zIndex = "24";
    newItem.style.cursor = "pointer";
    newItem.style.boxShadow = "2px 2px 19px #aaa";
    newItem.style.position = "absolute";
    newItem.style.borderRadius = "0.5em";

    //para base
    if(tipoFigura=="figura1"){
      newItem.style.backgroundColor="#0174DF";
      newItem.style.color = "white";
      newItem.style.paddingTop = "1.3em";
      newItem.style.paddingBottom = "1.3em";
      //newItem.style.width ="150px"
      newItem.style.height = "3em"
    }
    //para terminales
    if(tipoFigura=="figura3"){
      newItem.style.backgroundColor="white";
      newItem.style.color = "black";
      newItem.style.padding = "0.5em";
      newItem.style.height = "3em"
      //newItem.style.width ="100px"
    }
    //para estructurales
    if(tipoFigura=="figura2"){
      console.log(tipoFigura)
      newItem.style.backgroundColor="#D8D8D8";
      newItem.style.color = "black";
      newItem.style.padding = "0.5em";
      //newItem.style.height = "3em"
      newItem.style.width ="100px"

    }
   
    newItem.style.display = "flex";
    newItem.style.alignItems = "center";
    newItem.style.justifyContent = "center";
    newItem.style.webkitTransition = "-webkit-box-shadow 0.15s ease-in";
    newItem.style.transition = "box-shadow 0.15s ease-in";
    newItem.style.left = left+"em";
    newItem.style.top = top+"em";
    newItem.setAttribute("id",id_item)
    newItem.setAttribute("class","window")
    return newItem
  }

  crearArquetipoDiv(titulo:string):any{

    //Creacion del div arquetipo
    var newArquetipoDiv = document.createElement("div"); 
    newArquetipoDiv.style.backgroundColor="white";
    
    newArquetipoDiv.style.margin="1em";
    newArquetipoDiv.style.padding="1em";
    newArquetipoDiv.style.display="inline-block";
    newArquetipoDiv.style.textAlign="center";
    //Creacion del titulo del div arquetipo
    newArquetipoDiv.innerHTML=titulo

    /*var arqTitulo = document.createTextNode(titulo);
    var myTitle = document.createElement("p");
    myTitle.appendChild(arqTitulo);
    //Creacion de espacio*/
    var espacio = document.createElement("br");
    //newArquetipoDiv.appendChild(myTitle); 
    newArquetipoDiv.appendChild(espacio);

    return newArquetipoDiv
  }

  crearBotonArquetipoDiv():any{
    var editorButton = document.createElement("BUTTON");
    editorButton.innerHTML = "Editar";
    editorButton.style.width="10em";
    editorButton.style.marginTop="2em";
    return editorButton
  }

}
