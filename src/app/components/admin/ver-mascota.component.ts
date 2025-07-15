import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Mascota {
  id: number;
  nombre: string;
  edad: number;
  raza: string;
  codigoCollar: string;
  foto?: string;
  fechaRegistro?: string;
  activo?: boolean;
}

@Component({
  selector: 'app-ver-mascota',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-mascota.component.html',
  styleUrls: ['./ver-mascota.component.css']
})
export class VerMascotaComponent implements OnInit {
  mascotas: Mascota[] = [];
  loading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.loading = true;
    // Aquí puedes agregar la lógica para cargar mascotas reales desde tu API
    this.mascotas = [];
    this.loading = false;
  }

  irARegistrarMascota(): void {
    this.router.navigate(['/admin/registrar-mascota']);
  }

  verDetallesMascota(mascota: Mascota): void {
    console.log('Ver detalles de:', mascota);
  }

  recargarMascotas(): void {
    this.cargarMascotas();
  }

  obtenerMascotasActivas(): number {
    return this.mascotas.filter(mascota => mascota.activo).length;
  }

  trackByMascota(index: number, mascota: Mascota): number {
    return mascota.id;
  }
}