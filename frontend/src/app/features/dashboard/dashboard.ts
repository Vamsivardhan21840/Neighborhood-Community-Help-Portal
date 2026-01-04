import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService, HelpRequest } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false
})
export class Dashboard implements OnInit {
  myRequests: HelpRequest[] = [];
  displayedColumns: string[] = ['title', 'category', 'status', 'actions'];
  currentUser: any;
  userRole: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  private routerSub: Subscription | undefined;

  ngOnInit() {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.userRole = user.role;
        this.loadMyRequests();
      }
    });

    // Listen for navigation events to refresh data (handles double-click/tab switching)
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadMyRequests();
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadMyRequests() {
    console.log('Loading requests for user:', this.currentUser);
    this.apiService.getMyRequests().subscribe(data => {
      console.log('My Requests data:', data);
      this.myRequests = data;
      this.cdr.detectChanges();
    });
  }

  get isResident(): boolean {
    return this.userRole === 'Resident';
  }

  getIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'plumbing': return 'plumbing';
      case 'grocery': return 'local_grocery_store';
      case 'repair': return 'build';
      case 'delivery': return 'local_shipping';
      default: return 'help_outline';
    }
  }

  isAfter(currentStatus: string, stage: string): boolean {
    const order = ['Pending', 'Accepted', 'In-progress', 'Completed'];
    return order.indexOf(currentStatus) > order.indexOf(stage);
  }

  updateStatus(req: HelpRequest, newStatus: string) {
    this.apiService.updateStatus(req.id!, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Status updated to ${newStatus}`, 'Close', { duration: 3000 });
        this.loadMyRequests();
      },
      error: () => {
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
      }
    });
  }
}
