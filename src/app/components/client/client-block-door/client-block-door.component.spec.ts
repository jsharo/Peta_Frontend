import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBlockDoorComponent } from './client-block-door.component';

describe('ClientBlockDoorComponent', () => {
  let component: ClientBlockDoorComponent;
  let fixture: ComponentFixture<ClientBlockDoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientBlockDoorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientBlockDoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
