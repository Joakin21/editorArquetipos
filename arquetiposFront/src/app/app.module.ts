import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EditorArquetiposComponent } from './editor-arquetipos/editor-arquetipos.component';
import { HeaderComponent } from './header/header.component';
import { ListaArquetiposComponent } from './lista-arquetipos/lista-arquetipos.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorArquetiposComponent,
    HeaderComponent,
    ListaArquetiposComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
