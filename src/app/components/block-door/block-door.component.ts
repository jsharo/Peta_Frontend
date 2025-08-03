import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoorService } from '../../services/door.service';

@Component({
  selector: 'app-block-door',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block-door.component.html',
  styleUrls: ['./block-door.component.css']
})
export class BlockDoorComponent implements OnInit {
  estado: 'gris' | 'verde' | 'rojo' = 'gris';

  constructor(private doorService: DoorService) {}

  ngOnInit() {
    this.actualizarEstadoPuerta();
    setInterval(() => this.actualizarEstadoPuerta(), 3000); // cada 3 segundos
  }

  bloquearPuerta() {
    this.doorService.bloquearPuerta().subscribe({
      next: () => {
        this.estado = 'rojo';
        this.actualizarEstadoPuerta();
      },
      error: () => alert('Error al bloquear la puerta')
    });
  }

  desbloquearPuerta() {
    this.doorService.desbloquearPuerta().subscribe({
      next: () => {
        this.estado = 'verde';
        this.actualizarEstadoPuerta();
      },
      error: () => alert('Error al desbloquear la puerta')
    });
  }

  actualizarEstadoPuerta() {
    this.doorService.obtenerEstadoPuerta().subscribe({
      next: (res) => {
        if (res.is_locked === true) {
          this.estado = 'rojo';
        } else if (res.is_locked === false) {
          this.estado = 'verde';
        } else {
          this.estado = 'gris';
        }
      },
      error: () => {
        this.estado = 'gris';
      }
    });
  }

  get texto(): string {
    switch (this.estado) {
      case 'verde': return 'Desbloqueada';
      case 'rojo': return 'Bloqueada';
      default: return 'Desconocido';
    }
  }
}
