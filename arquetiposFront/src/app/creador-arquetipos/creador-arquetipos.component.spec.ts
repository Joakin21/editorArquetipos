import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreadorArquetiposComponent } from './creador-arquetipos.component';

describe('CreadorArquetiposComponent', () => {
  let component: CreadorArquetiposComponent;
  let fixture: ComponentFixture<CreadorArquetiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreadorArquetiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreadorArquetiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
