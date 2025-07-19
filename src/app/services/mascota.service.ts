import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  constructor() {}

  getMascotas(): Observable<any[]> {
    const mascotas = [
      { nombre: 'Firulais', foto: 'assets/images/firulais.jpg' },
      { nombre: 'Luna', foto: 'assets/images/luna.jpg' },
      { nombre: 'Max', foto: 'assets/images/max.jpg' }
    ];

    return of(mascotas); // simula una llamada HTTP
  }
}
