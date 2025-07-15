import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Panel de Administración</h1>
    <div class="cards-container">
      <div class="card" *ngFor="let card of cards">
        <img [src]="card.img" [alt]="card.title" class="card-img" />
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
        <button (click)="goTo(card.route)">Visualizar</button>
      </div>
    </div>
  `,
  styles: [`
    .cards-container {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .card {
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 8px;
      width: 220px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .card-img {
      width: 100px;
      height: 100px;
      object-fit: contain;
      margin-bottom: 1rem;
    }
    button {
      margin-top: auto;
      padding: 0.5rem 1rem;
      font-weight: bold;
      cursor: pointer;
    }
  `]
})
export class AdminComponent {
  cards = [
    { 
      title: 'Ver Mascotas', 
      description: 'Listado de mascotas registradas', 
      route: '/admin/mascotas',
      img: '/ver-mascota.jpeg'
    },
    { 
      title: 'Notificaciones', 
      description: 'Ver notificaciones', 
      route: '/admin/notificaciones',
      img: '/notisss.png'
    },
    { 
      title: 'Bloquear Puerta', 
      description: 'Control de acceso', 
      route: '/admin/bloquear-puerta',
      img: '/puerta.jpeg'
    }
  ];

  constructor(private router: Router) {}

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
