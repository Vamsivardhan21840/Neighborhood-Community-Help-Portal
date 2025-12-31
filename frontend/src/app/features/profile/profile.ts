import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  standalone: false
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      contact_info: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          contact_info: user.contact_info || '', // Ensure no nulls
          location: user.location || ''
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      const updateData = {
        id: this.currentUser.id,
        contact_info: this.profileForm.get('contact_info')?.value,
        location: this.profileForm.get('location')?.value
      };

      this.authService.updateProfile(updateData).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
          this.profileForm.markAsPristine();
        },
        error: () => {
          this.snackBar.open('Failed to update profile', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
