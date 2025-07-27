import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoorService } from '../../services/door.service';

@Component({
  selector: 'app-block-door',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block-door.component.html',
  styleUrls: ['./block-door.component.css']
})
export class BlockDoorComponent {
  estado: 'gris' | 'verde' | 'rojo' = 'gris';

  constructor(private doorService: DoorService) {}

  bloquearPuerta() {
    this.doorService.bloquearPuerta().subscribe({
      next: () => this.estado = 'rojo',
      error: () => alert('Error al bloquear la puerta')
    });
  }

  desbloquearPuerta() {
    this.doorService.desbloquearPuerta().subscribe({
      next: () => this.estado = 'verde',
      error: () => alert('Error al desbloquear la puerta')
    });
  }

  get texto(): string {
    switch (this.estado) {
      case 'verde': return 'Encendido';
      case 'rojo': return 'Apagado';
      default: return '';
    }
  }
}
