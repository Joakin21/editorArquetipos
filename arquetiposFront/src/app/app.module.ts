import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { EditorArquetiposComponent } from './editor-arquetipos/editor-arquetipos.component';
import { HeaderComponent } from './header/header.component';
import { ListaArquetiposComponent } from './lista-arquetipos/lista-arquetipos.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {path:'editor', component: EditorArquetiposComponent},
  {path:'visualizador', component: ListaArquetiposComponent},
  { path: '', component: ListaArquetiposComponent, pathMatch: 'full'},
  { path: '**', redirectTo: '/', pathMatch: 'full' },
]

@NgModule({
  declarations: [
    AppComponent,
    EditorArquetiposComponent,
    HeaderComponent,
    ListaArquetiposComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
