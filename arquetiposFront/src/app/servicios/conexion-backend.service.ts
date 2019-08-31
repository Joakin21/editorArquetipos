import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConexionBackendService {

  constructor() { }

  enviarArchivo(archivo:string){

    console.log(archivo);
  }
}
