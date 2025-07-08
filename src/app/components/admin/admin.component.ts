import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  cards = [
    {
      id: 1,
      name: 'Usuario',
      image: '/crear-usuario.png'
    },
    {
      id: 2,
      name: 'Registrar Mascota',
      image: '/mascotas.png'
    },
    {
      id: 3,
      name: 'Notificaciones',
      image: '/notisss.png'
    },
    {
      id: 4,
      name: 'Bloquear Puerta',
      image: '/puerta.jpeg'
    },
    {
      id: 5,
      name: 'Ver Mascotas',
      image: '/ver-mascota.jpeg'
    }
  ];

  viewCard(card: any) {
    alert(`Visualizando: ${card.name}`);
  }
}
