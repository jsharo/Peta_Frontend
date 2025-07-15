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
    
    setTimeout(() => {
      this.mascotas = [
        {
          id: 1,
          nombre: 'Max',
          edad: 3,
          raza: 'Golden Retriever',
          codigoCollar: 'GR001',
          foto: '/perrp.jpeg',
          fechaRegistro: '2024-01-15',
          activo: true
        },
        {
          id: 2,
          nombre: 'Luna',
          edad: 2,
          raza: 'Border Collie',
          codigoCollar: 'BC002',
          foto: '/petat.jpg',
          fechaRegistro: '2024-02-20',
          activo: true
        },
        {
          id: 3,
          nombre: 'Rocky',
          edad: 5,
          raza: 'Pastor Alemán',
          codigoCollar: 'PA003',
          fechaRegistro: '2024-03-10',
          activo: false
        }
      ];
      this.loading = false;
    }, 1000);
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