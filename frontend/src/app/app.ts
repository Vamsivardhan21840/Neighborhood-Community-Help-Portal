import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  themeClass = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (!user) {
        this.themeClass = '';
      } else if (user.role === 'Resident') {
        this.themeClass = 'theme-resident';
      } else if (user.role === 'Helper') {
        this.themeClass = 'theme-helper';
      }
    });
  }
}
