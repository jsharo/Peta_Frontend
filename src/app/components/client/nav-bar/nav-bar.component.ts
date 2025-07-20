import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavbarComponent {
  active: 'notificaciones' | 'mascotas' = 'notificaciones';

  select(tab: 'notificaciones' | 'mascotas') {
    this.active = tab;
    // Aquí puedes hacer navegación, emitir eventos o cargar componentes
  }
}
