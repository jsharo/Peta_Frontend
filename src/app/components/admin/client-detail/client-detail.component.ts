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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.cargarUsuario();
      this.cargarNotificaciones();
      this.cargarMascotas();
    }
  }

  cargarUsuario(): void {
    this.http.get(`http://localhost:3000/users/${this.userId}`).subscribe({
      next: (data) => this.usuario = data,
      error: (err) => console.error('Error al cargar usuario:', err)
    });
  }

  cargarNotificaciones(): void {
    this.http.get<any[]>(`http://localhost:3000/notifications/user/${this.userId}`).subscribe({
      next: (data) => this.notificaciones = data,
      error: (err) => console.error('Error al cargar notificaciones:', err)
    });
  }

  cargarMascotas(): void {
    this.http.get<any[]>(`http://localhost:3000/pets/user/${this.userId}`).subscribe({
      next: (data) => this.mascotas = data,
      error: (err) => console.error('Error al cargar mascotas:', err)
    });
  }

  goToMascotas(): void {
    this.router.navigate(['/admin/admin-pets-view'], {
      queryParams: { userId: this.userId }
    });
  }

  goToNotificaciones(): void {
    this.router.navigate(['/admin/notifications'], {
      queryParams: { userId: this.userId }
    });
  }

  goToInfo(): void {
    alert(
      `Nombre: ${this.usuario?.name}\nEmail: ${this.usuario?.email}\nRol: ${this.usuario?.role || this.usuario?.rol}`
    );
  }
}
