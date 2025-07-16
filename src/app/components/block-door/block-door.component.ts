import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-block-door',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block-door.component.html',
  styleUrls: ['./block-door.component.css']
})
export class BlockDoorComponent {
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
