import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css']
})
export class ClientDetailComponent implements OnInit {
  userId: string | null = null;
  usuario: any = null;
  notificaciones: any[] = [];
  mascotas: any[] = [];
  loading = true;

  // Tarjetas como en el panel de administración
  cards = [
    { 
      title: 'Mascotas', 
      description: 'Listado de mascotas del usuario', 
      img: '/ver-mascota.jpeg',
      action: () => this.goToMascotas()
    },
    { 
      title: 'Notificaciones', 
      description: 'Notificaciones del usuario', 
      img: '/notisss.png',
      action: () => this.goToNotificaciones()
    },
    { 
      title: 'Información', 
      description: 'Datos del usuario', 
      img: '/puerta.jpeg',
      action: () => this.goToInfo()
    }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.cargarUsuario();
      this.cargarNotificaciones();
      this.cargarMascotas();
    }
  }

  cargarUsuario() {
    this.http.get(`http://localhost:3000/users/${this.userId}`).subscribe({
      next: (data) => { this.usuario = data; },
      error: (err) => console.error('Error al cargar usuario:', err)
    });
  }

  cargarNotificaciones() {
    this.http.get<any[]>(`http://localhost:3000/notifications/user/${this.userId}`).subscribe({
      next: (data) => this.notificaciones = data,
      error: (err) => console.error('Error al cargar notificaciones:', err)
    });
  }

  cargarMascotas() {
    this.http.get<any[]>(`http://localhost:3000/pets/user/${this.userId}`).subscribe({
      next: (data) => this.mascotas = data,
      error: (err) => console.error('Error al cargar mascotas:', err)
    });
  }

  goToMascotas() {
    this.router.navigate(['/admin/admin-pets-view'], { queryParams: { userId: this.userId } });
  }

  goToNotificaciones() {
    this.router.navigate(['/admin/notifications'], { queryParams: { userId: this.userId } });
  }

  goToInfo() {
    alert(
      `Nombre: ${this.usuario?.name}\nEmail: ${this.usuario?.email}\nRol: ${this.usuario?.role || this.usuario?.rol}`
    );
  }
}

