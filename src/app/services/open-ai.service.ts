// src/app/services/open-ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  // Official API endpoint
  private apiUrl: string = 'https://api.openai.com/v1/chat/completions';


  private apiKey: string ='YOUR_API_KEY'; // Replace with your actual API key
  constructor(private http: HttpClient) {}

  public sendChatRequest(messages: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    // We'll call gpt-4o-mini
    const body = {
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.6
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
