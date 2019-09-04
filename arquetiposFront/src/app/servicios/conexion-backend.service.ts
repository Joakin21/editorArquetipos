import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConexionBackendService {

  url_import = 'http://127.0.0.1:8000/import/';

  constructor(private httpClient:HttpClient) { }

  enviarArchivo(fileToUpload: File){

    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    
    return this.httpClient.post<any>(this.url_import,formData);
  }
}
