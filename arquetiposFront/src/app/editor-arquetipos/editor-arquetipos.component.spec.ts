import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorArquetiposComponent } from './editor-arquetipos.component';

describe('EditorArquetiposComponent', () => {
  let component: EditorArquetiposComponent;
  let fixture: ComponentFixture<EditorArquetiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorArquetiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorArquetiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
