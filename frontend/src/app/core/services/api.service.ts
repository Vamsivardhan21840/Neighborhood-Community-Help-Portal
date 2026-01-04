import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HelpRequest {
    id?: number;
    resident_id?: number;
    helper_id?: number | null;
    title: string;
    description?: string;
    category: string;
    address: string;
    status: 'Pending' | 'Accepted' | 'In-progress' | 'Completed';
    attachments?: string;
    created_at?: string;
    resident_name?: string;
    helper_name?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:3002/api/requests';

    constructor(private http: HttpClient) { }

    getAllRequests(): Observable<HelpRequest[]> {
        return this.http.get<HelpRequest[]>(this.apiUrl);
    }

    getMyRequests(): Observable<HelpRequest[]> {
        // No params needed, backend identifies user from JWT
        return this.http.get<HelpRequest[]>(`${this.apiUrl}/my`);
    }

    getRequestById(id: number): Observable<HelpRequest> {
        return this.http.get<HelpRequest>(`${this.apiUrl}/${id}`);
    }

    createRequest(request: any): Observable<any> {
        return this.http.post(this.apiUrl, request);
    }

    updateStatus(requestId: number, status: string): Observable<any> {
        // helper_id not needed in body, backend gets it from token
        return this.http.patch(`${this.apiUrl}/${requestId}/status`, { status });
    }
}
