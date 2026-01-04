import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService, HelpRequest } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.html',
  styleUrls: ['./request-status.scss'],
  standalone: false
})
export class RequestStatus implements OnInit {
  request: HelpRequest | null = null;
  currentStep = 1;
  canUpdateStatus = false;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRequest(parseInt(id));
    }
  }

  loadRequest(id: number) {
    this.apiService.getRequestById(id).subscribe({
      next: (request) => {
        this.request = request;
        this.updateStep();
        this.checkPermissions();
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Error loading request details', 'Close', { duration: 3000 });
      }
    });
  }

  updateStep() {
    switch (this.request?.status) {
      case 'Pending': this.currentStep = 1; break;
      case 'Accepted': this.currentStep = 2; break;
      case 'In-progress': this.currentStep = 3; break;
      case 'Completed': this.currentStep = 4; break;
    }
  }

  checkPermissions() {
    if (!this.currentUser || !this.request) return;
    if (this.currentUser.role === 'Helper' && this.request.helper_id === this.currentUser.id) {
      this.canUpdateStatus = true;
    }
  }

  updateStatus(status: string) {
    if (!this.request) return;
    this.apiService.updateStatus(this.request.id!, status).subscribe({
      next: () => {
        this.snackBar.open('Status updated', 'Close', { duration: 3000 });
        this.loadRequest(this.request!.id!);
      },
      error: () => this.snackBar.open('Error updating status', 'Close', { duration: 3000 })
    });
  }
}
