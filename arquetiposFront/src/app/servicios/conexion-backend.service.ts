import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})
export class ConexionBackendService {

  //url_import = 'http://127.0.0.1:8000/';
  url_import = 'http://127.0.0.1:8000/arquetipos/';
  url_users = 'http://127.0.0.1:8000/adminPatientJourney/'

  constructor(private httpClient:HttpClient, private cookies: CookieService) { }

  enviarArchivo(fileToUpload: File, tipo_archivo){

    const formData: FormData = new FormData();
    formData.append(tipo_archivo, fileToUpload, fileToUpload.name);
      
    return this.httpClient.post<any>(this.url_import, formData);

  }

  getArquetipos() : Observable<any[]>{
    return this.httpClient.get<any[]>(this.url_import);
  }

  getArquetipoById(id_arq:string): Observable<any>{
    return this.httpClient.get<any>(this.url_import+id_arq+"/");
  }
  /*
  postPatient(patient_journey:any): Observable<any>{
    httpOptions.headers = httpOptions.headers.set('Authorization', this.getToken());
    return this.httpClient.post(this.url_pacientes + patient_journey["rut"] + "/", patient_journey, httpOptions )
  }
  */
  postArquetipo(arquetipo:any): Observable<any>{
    return this.httpClient.post(this.url_import + "none" + "/", arquetipo)
  }
  updateArquetipo(arquetipo:any): Observable<any>{
    //return this.httpClient.put(this.url_pacientes + patient_journey["rut"] + "/", patient_journey, httpOptions )
    return this.httpClient.put(this.url_import + arquetipo["_id"] + "/", arquetipo);
  }

  deleteArquetipo(id_arq:string): Observable<any>{
    return this.httpClient.delete(this.url_import+id_arq+"/");
  }
  
  deleteAllArquetipos() : Observable<any>{
    return this.httpClient.delete(this.url_import);
  }

  getUser(user:number): Observable<any>{
    httpOptions.headers = httpOptions.headers.set('Authorization', "token "+this.getToken());
    return this.httpClient.get(this.url_users+user+"/", httpOptions);
  }

  getToken() {
    return this.cookies.get("token");
  }
  getIdUser(){
    return this.cookies.get("id_user")
  }
  
}
