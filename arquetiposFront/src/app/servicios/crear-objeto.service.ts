import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrearObjetoService {

  constructor() { }

  crearItem(id_item, x:number, y:number):any{
    var left = x.toString()
    var top = y.toString()
    var newItem = document.createElement("div"); 
    newItem.style.backgroundColor="white";
    newItem.style.border="1px solid #346789";
    newItem.style.textAlign="center";
    newItem.style.zIndex = "24";
    newItem.style.cursor = "pointer";
    newItem.style.boxShadow = "2px 2px 19px #aaa";
    /*newItem.style.
    newItem.style.
    newItem.style.
    newItem.style.*/
    newItem.style.borderRadius = "0.5em";
    newItem.style.position = "absolute";
    newItem.style.color = "black";
    newItem.style.padding = "0.5em";
   
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

}
