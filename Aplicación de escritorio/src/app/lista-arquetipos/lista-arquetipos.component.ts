import { Component, OnInit } from '@angular/core';
import {ConexionBackendService} from '../servicios/conexion-backend.service'
import {Router} from '@angular/router';
import {SeleccionArquetipoService} from '../servicios/seleccion-arquetipo.service'
import { CrearObjetoService } from '../servicios/crear-objeto.service'
declare var $:any;
@Component({
  selector: 'app-lista-arquetipos',
  templateUrl: './lista-arquetipos.component.html',
  styleUrls: ['./lista-arquetipos.component.css']
})
export class ListaArquetiposComponent implements OnInit {

  constructor(private router: Router,private conexBack: ConexionBackendService, private elegirArquetipo: SeleccionArquetipoService, private crearObjeto: CrearObjetoService) { }

  //arquetipos: any[]
  divs_arquetipos = []

  ngOnInit() {
    
    this.conexBack.getArquetipos().subscribe(resp => this.arquetiposFromDB(resp));

    
  }
  arquetiposFromDB(arquetipos:any[]){
    
    for (let arq of arquetipos) {
      this.agregarArquetipoDiv(arq)
   }
    //this.agregarArquetipoDiv(arquetipos[0])
  }
  fileToUpload: File = null;

  importarArchivo(files: FileList) {
    this.fileToUpload = files.item(0);
    var tipo_archivo = this.fileToUpload["name"].slice(this.fileToUpload["name"].length - 3)
    if(tipo_archivo=="xml" || tipo_archivo=="adl"){
      if(this.fileToUpload)
        this.conexBack.enviarArchivo(this.fileToUpload,tipo_archivo).subscribe(data => this.agregarArquetipoDiv(data));
      
    }
    else
      alert("Solamente los formatos xml, adl y json son soportados")
    

  }

  seleccionarArquetipo(arquetipo:any){
    this.elegirArquetipo.asignar(arquetipo)
  }

  arquetipo_a_eliminar:any 
  div_a_eliminar:string
  alertaEliminarArquetipo(arquetipo:any, id_div){
    $('#modalEliminarArquetipo').modal('show');
    
    this.arquetipo_a_eliminar =arquetipo
    this.div_a_eliminar = id_div

  }
  eliminarArquetipo(){
    //console.log("voy a eliminar: "+this.arquetipo_a_eliminar["id"])
    this.conexBack.deleteArquetipo(this.arquetipo_a_eliminar["id"]).subscribe();
    console.log("voy a eliminar "+this.div_a_eliminar)
    $("#"+this.div_a_eliminar).remove();
  }
  alertaEliminarTodos(){

    if(Array.isArray(this.divs_arquetipos) && this.divs_arquetipos.length )
      $('#modalEliminarTodosArquetipos').modal('show');
    else
      alert("No hay arquetipos que borrar")

  }
  eliminarTodos(){
    //alert("delete all")
    this.conexBack.deleteAllArquetipos().subscribe();
    $("#contenedor_arquetipos").remove();
    //recorre todos los div arquetipos y eliminalos
    for (let div of this.divs_arquetipos) {
      $("#"+div).remove();
    }
  }


  id_div:string
  n_id_div:number = 1
  agregarArquetipoDiv(arquetipo: any){
    
    var titulo = arquetipo["nombre"]
    
    //corregir detallito; cambia el texto del label upload
    document.getElementById('label1').innerHTML = titulo; 

    //crear objetos div y botones
    this.id_div = "div"+this.n_id_div
    this.divs_arquetipos.push(this.id_div)
    var newArquetipoDiv = this.crearObjeto.crearArquetipoDiv(titulo,this.id_div)
    this.n_id_div = this.n_id_div + 1
    let id_div = this.id_div 
    var contenedorBotones = this.crearObjeto.crearDivContenedorBotones()
    var editar_btn = this.crearObjeto.crearBotonArquetipoDiv(1)
    var eliminar_btn = this.crearObjeto.crearBotonArquetipoDiv(2)
    //var exportar_btn = this.crearObjeto.crearBotonArquetipoDiv(2)
    //agrega eventos a los botones
    editar_btn.addEventListener ("click", (evt) => this.seleccionarArquetipo(arquetipo["id"]))
    editar_btn.addEventListener ("click", (evt) => this.router.navigateByUrl('/editor'))
    eliminar_btn.addEventListener ("click", (evt) => this.alertaEliminarArquetipo(arquetipo, id_div))
    //exportar_btn.addEventListener ("click", (evt) => this.exportarArquetipo(arquetipo["id"]))

    //se arma el div del arquetipo
    contenedorBotones.appendChild(editar_btn);
    contenedorBotones.appendChild(eliminar_btn);
    //contenedorBotones.appendChild(exportar_btn);
    newArquetipoDiv.appendChild(contenedorBotones);
    //se agrega el div al area
    var padreDiv = document.getElementById("listaArqueripos"); 
    padreDiv.appendChild(newArquetipoDiv);
  }
  crearNuevoArquetipo(){
    this.seleccionarArquetipo("nuevo arquetipo")
    this.router.navigateByUrl('/editor')
  }

}
