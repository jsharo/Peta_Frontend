import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bloquear-puerta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bloquear-puerta.component.html',
  styleUrls: ['./bloquear-puerta.component.css']
})
export class BloquearPuertaComponent {
  estado: 'gris' | 'verde' | 'rojo' = 'gris';

  cambiarEstado() {
    if (this.estado === 'gris') {
      this.estado = 'verde';
    } else if (this.estado === 'verde') {
      this.estado = 'rojo';
    } else {
      this.estado = 'gris';
    }
  }

  get texto(): string {
    switch (this.estado) {
      case 'verde': return 'Encendido';
      case 'rojo': return 'Apagado';
      default: return '';
    }
  }
}
