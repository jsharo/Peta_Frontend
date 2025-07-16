import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})

export class AdminPanelComponent {
  cards = [
    { 
      title: 'Ver Mascotas', 
      description: 'Listado de mascotas registradas', 
      route: '/admin/admin-pets-view',
      img: '/ver-mascota.jpeg'
    },
    { 
      title: 'Notificaciones', 
      description: 'Ver notificaciones', 
      route: '/admin/notifications',
      img: '/notisss.png'
    },
    { 
      title: 'Bloquear Puerta', 
      description: 'Control de acceso', 
      route: '/admin/block-door',
      img: '/puerta.jpeg'
    }
  ];

  constructor(private router: Router) {}

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
