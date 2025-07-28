import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetTipsComponent } from './pet-tips.component';

describe('PetTipsComponent', () => {
  let component: PetTipsComponent;
  let fixture: ComponentFixture<PetTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetTipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
