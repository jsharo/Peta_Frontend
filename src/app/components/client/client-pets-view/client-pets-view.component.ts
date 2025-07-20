import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

interface Mascota {
  nombre: string;
  foto: string;
  // otros campos si necesitas
}

@Component({
  selector: 'app-client-pets-view',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './client-pets-view.component.html',
  styleUrls: ['./client-pets-view.component.css']
})
export class ClientPetsViewComponent implements OnInit {
  mascotas: Mascota[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id_user) {
      this.http.get<any[]>(`http://localhost:3000/pets/user/${user.id_user}`)
        .subscribe(data => {
          // Adapta los datos al modelo Mascota si es necesario
          this.mascotas = data.map(pet => ({
            nombre: pet.name_pet,
            foto: pet.photo // o el campo correcto
          }));
        });
    }
  }

  trackByMascota(index: number, mascota: Mascota): number {
    return index;
  }

  verDetallesMascota(mascota: Mascota): void {
    console.log('Ver detalles de:', mascota);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
