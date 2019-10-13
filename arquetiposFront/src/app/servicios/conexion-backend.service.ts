import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexionBackendService {

  url_import = 'http://127.0.0.1:8000/';

  constructor(private httpClient:HttpClient) { }

  enviarArchivo(fileToUpload: File){

    const formData: FormData = new FormData();
    formData.append('xml', fileToUpload, fileToUpload.name);
    
    return this.httpClient.post<any>(this.url_import+"paraListaArquetipos/",formData);
  }

  getArquetipos() : Observable<any[]>{
    return this.httpClient.get<any[]>(this.url_import+"paraListaArquetipos/");
  }

  getArquetipoById(id_arq:string): Observable<any>{
    return this.httpClient.get<any>(this.url_import+"paraEditorArquetipos/"+id_arq+"/");
  }

}
