import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPetsViewComponent } from './client-pets-view.component';

describe('ClientPetsViewComponent', () => {
  let component: ClientPetsViewComponent;
  let fixture: ComponentFixture<ClientPetsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPetsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientPetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
