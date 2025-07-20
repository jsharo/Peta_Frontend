import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavbarComponent implements OnInit {
  @Input() activeTab: 'notificaciones' | 'mascotas' = 'notificaciones';

  active: 'notificaciones' | 'mascotas' = 'notificaciones';

  constructor(private router: Router) {}

  ngOnInit() {
    this.active = this.activeTab;
  }

  select(tab: 'notificaciones' | 'mascotas') {
    this.active = tab;
    if (tab === 'notificaciones') {
      this.router.navigate(['/cliente/notificaciones']);
    } else if (tab === 'mascotas') {
      this.router.navigate(['/cliente/mascotas']);
    }
  }
}
