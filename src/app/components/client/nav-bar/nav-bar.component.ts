import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavbarComponent {
  active: 'huella' | 'puerta' | 'notificaciones' = 'huella';

  select(tab: 'huella' | 'puerta' | 'notificaciones') {
    this.active = tab;
    // Aquí puedes hacer navegación, emitir eventos o cargar componentes
  }
}
