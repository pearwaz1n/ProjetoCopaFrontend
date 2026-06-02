import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IngressoVenda } from '../ingresso';

@Injectable({
  providedIn: 'root',
})
export class IngressosService {
  apiUrl = "http://localhost:4200/ingressos"; // Usando a porta 4200 por enquanto como você pediu

  constructor(private http: HttpClient) { }

  getAllIngressos(): Observable<IngressoVenda[]> {
    return this.http.get<IngressoVenda[]>(this.apiUrl);
  }

  save(ingresso: IngressoVenda): Observable<IngressoVenda> {
    return this.http.post<IngressoVenda>(this.apiUrl, ingresso);
  }

  delete(ingresso: IngressoVenda): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ingresso.id}`);
  }

  update(ingresso: IngressoVenda): Observable<IngressoVenda> {
    return this.http.put<IngressoVenda>(`${this.apiUrl}/${ingresso.id}`, ingresso);
  }
}