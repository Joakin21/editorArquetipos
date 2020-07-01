import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() userName: string;

  arquetipo:any;

  constructor() { }
  titulo:string = "Archetype Editor"
  ngOnInit() {
  }

}
