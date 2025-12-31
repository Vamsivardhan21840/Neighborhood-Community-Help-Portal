import { Component, OnInit } from '@angular/core';
import { ApiService, HelpRequest } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.html',
  styleUrls: ['./request-list.scss'],
  standalone: false
})
export class RequestList implements OnInit {
  requests: HelpRequest[] = [];
  currentUser: any;
  isHelper = false;
  isResident = false;
  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isHelper = user?.role === 'Helper';
      this.isResident = user?.role === 'Resident';

      if (this.isResident) {
        // Residents should not be here, redirect to dashboard
        this.router.navigate(['/dashboard']);
      }
    });
    this.loadRequests();
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  loadRequests() {
    this.apiService.getAllRequests().subscribe(data => {
      // Show ONLY Pending requests in Marketplace
      this.requests = data.filter(r => r.status === 'Pending');
    });
  }

  acceptRequest(req: HelpRequest) {
    this.apiService.updateStatus(req.id!, 'Accepted').subscribe({
      next: () => {
        this.snackBar.open('Request accepted!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']); // Redirect to dashboard to see the task
      },
      error: () => {
        this.snackBar.open('Failed to accept request', 'Close', { duration: 3000 });
      }
    });
  }

  declineRequest(req: HelpRequest) {
    if (confirm('Are you sure you want to decline this request? It will be removed from your list.')) {
      this.requests = this.requests.filter(r => r.id !== req.id);
      this.snackBar.open('Request declined', 'Close', { duration: 3000 });
    }
  }

  isImage(url: string | undefined): boolean {
    return !!url && url.startsWith('data:image');
  }
}
