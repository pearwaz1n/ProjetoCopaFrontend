import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IngressoVenda } from '../ingresso';

//interface api
export interface JogoCopa {
  dataHora: string;
  grupo: string;
  timeMandante: string;
  timeVisitante: string;
}


@Injectable({
  providedIn: 'root',
})

export class IngressosService {

  private apiUrl = "http://localhost:8080/ingressos";
  private jogosUrl = "http://localhost:8080/jogos";


  constructor(private http: HttpClient) { }

  getAllIngressos() {
    // Pega a data/hora exata do milissegundo atual
    const tempoAtual = new Date().getTime();

    // Coloca o tempo na URL 
    return this.http.get<IngressoVenda[]>(`${this.apiUrl}?t=${tempoAtual}`);
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
  //pegar jogos
  getJogosDaCopa() {
    return this.http.get<JogoCopa[]>(this.jogosUrl);
  }
}
