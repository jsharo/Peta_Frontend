import { Component } from '@angular/core';

@Component({
  selector: 'app-client-pets-view',
  templateUrl: './client-pets-view.component.html',
  styleUrls: ['./client-pets-view.component.css']
})
export class ClientPetsViewComponent {
  mascotas = [
    {
      nombre: 'Fred',
      foto: 'assets/images/fred.jpg'
    },
    {
      nombre: 'Firulais',
      foto: 'assets/images/firulais.jpg'
    }
  ];
}
