import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloquearPuertaComponent } from './bloquear-puerta.component';

describe('BloquearPuertaComponent', () => {
  let component: BloquearPuertaComponent;
  let fixture: ComponentFixture<BloquearPuertaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloquearPuertaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloquearPuertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
