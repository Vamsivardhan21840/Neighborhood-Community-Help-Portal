import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Resident' | 'Helper';
    contact_info?: string;
    location?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3002/api/auth';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData).pipe(
            tap((response: any) => {
                if (response.user && response.token) {
                    this.setSession(response.user, response.token);
                }
            })
        );
    }

    login(credentials: { email: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                if (response.user && response.token) {
                    this.setSession(response.user, response.token);
                }
            })
        );
    }

    updateProfile(profileData: any): Observable<any> {
        // ID is now in token, but backend might still expect it in body if we didn't change updateProfile controller to use req.user.id
        // Let's ensure updateProfile controller uses req.user.id
        return this.http.put(`${this.apiUrl}/profile`, profileData).pipe(
            tap((response: any) => {
                if (response.user) {
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    private setSession(user: User, token: string) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        this.currentUserSubject.next(user);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
