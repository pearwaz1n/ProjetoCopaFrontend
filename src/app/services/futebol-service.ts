import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FutebolService {

  // URL base oficial da API
  private apiUrl = 'https://api.football-data.org/v4';

  private apiKey = 'f5644cfeca5140aabbc54cab254e2468b0603d43d';

  constructor(private http: HttpClient) { }

  // Função para anexar a sua chave secreta na requisição
  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'X-Auth-Token': this.apiKey
      })
    };
  }

  // MÉTODO DO CALENDÁRIO: Busca as partidas
  getJogosCopa(): Observable<any> {
    return this.http.get(`${this.apiUrl}/competitions/2000/matches`, this.getHeaders());
  }

  // MÉTODO DOS GRUPOS: Busca a classificação e tabela de pontos
  getGruposCopa(): Observable<any> {
    return this.http.get(`${this.apiUrl}/competitions/2000/standings`, this.getHeaders());
  }
}