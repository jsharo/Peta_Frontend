import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoorService } from '../../../services/door.service';

@Component({
  selector: 'app-client-block-door',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-block-door.component.html',
  styleUrls: ['./client-block-door.component.css']
})
export class ClientBlockDoorComponent implements OnInit {
  puertaBloqueada: boolean | null = null; // null = desconocido

  constructor(private doorService: DoorService) {}

  ngOnInit() {
    this.actualizarEstadoPuerta();
    setInterval(() => this.actualizarEstadoPuerta(), 5000); // Actualiza cada 5 segundos
  }

  actualizarEstadoPuerta() {
    this.doorService.obtenerEstadoPuerta().subscribe({
      next: (res) => {
        this.puertaBloqueada = res.is_locked;
      },
      error: () => {
        this.puertaBloqueada = null;
      }
    });
  }

  togglePuerta() {
    if (this.puertaBloqueada === null) return;
    if (this.puertaBloqueada) {
      this.doorService.desbloquearPuerta().subscribe({
        next: () => this.actualizarEstadoPuerta()
      });
    } else {
      this.doorService.bloquearPuerta().subscribe({
        next: () => this.actualizarEstadoPuerta()
      });
    }
  }

  get textoBoton(): string {
    if (this.puertaBloqueada === null) return 'Estado desconocido';
    return this.puertaBloqueada ? 'Puerta Bloqueada' : 'Puerta Desbloqueada';
  }
}
