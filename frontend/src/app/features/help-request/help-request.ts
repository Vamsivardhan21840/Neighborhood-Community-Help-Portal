import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-help-request',
  templateUrl: './help-request.html',
  styleUrls: ['./help-request.scss'],
  standalone: false
})
export class HelpRequest implements OnInit {
  requestForm: FormGroup;
  currentUser: any;
  private routerSub: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      address: ['', Validators.required],
      description: [''],
      attachments: ['']
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user || user.role !== 'Resident') {
        this.snackBar.open('Only Residents can post requests', 'Close', { duration: 3000 });
        this.router.navigate(['/requests']);
      }
    });

    // Reset form on navigation to this component (handles tab switching)
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.requestForm.reset();
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.requestForm.patchValue({
          attachments: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.requestForm.valid) {
      this.apiService.createRequest(this.requestForm.value).subscribe({
        next: () => {
          this.snackBar.open('Request posted successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.snackBar.open('Failed to post request', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
