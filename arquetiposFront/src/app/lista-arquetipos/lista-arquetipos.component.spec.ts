import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaArquetiposComponent } from './lista-arquetipos.component';

describe('ListaArquetiposComponent', () => {
  let component: ListaArquetiposComponent;
  let fixture: ComponentFixture<ListaArquetiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaArquetiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaArquetiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
