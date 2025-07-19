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
  selector: 'app-admin-pets-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pets-view.component.html',
  styleUrls: ['./admin-pets-view.component.css']
})
export class AdminPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];
  loading = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.loading = true;

    // Aquí deberías hacer una llamada real a tu API para cargar las mascotas
    // Ejemplo:
    // this.miServicio.obtenerMascotas().subscribe(data => {
    //   this.mascotas = data;
    //   this.loading = false;
    // });

    // Por ahora sin datos falsos
    this.mascotas = [];
    this.loading = false;
  }

  irARegistrarMascota(): void {
    this.router.navigate(['/admin/pet-register']);
  }

  verDetallesMascota(mascota: Mascota): void {
    console.log('Ver detalles de:', mascota);
    // Puedes hacer navegación si tienes vista de detalles
  }

  recargarMascotas(): void {
    this.cargarMascotas();
  }

  obtenerMascotasActivas(): number {
    return this.mascotas.filter(m => m.activo).length;
  }

  trackByMascota(index: number, mascota: Mascota): number {
    return mascota.id;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
