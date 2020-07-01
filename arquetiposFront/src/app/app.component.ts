import { Component,OnInit } from '@angular/core';
import {ConexionBackendService} from './servicios/conexion-backend.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'EditorArquetipos';

  constructor(private conexBack: ConexionBackendService){}
  usuario_logeado:string = ""
  ngOnInit() {
    if(!this.conexBack.getToken()){//si no hay token
      //this.router.navigateByUrl('')
      location.href ="http://localhost:4200/";
      //alert("No estas logeado")
    }
    //Apenas inicia el componente obtenemos el usuario
    this.conexBack.getUser(parseInt(this.conexBack.getIdUser())).subscribe(
      data => {
        this.usuario_logeado = data.user.username
        //alert(data.user.username+" from app component xd!")
        //var id_profesional = data.user.id
      },
      error => {
        console.log('error', error)
      }
    );
  }
}
