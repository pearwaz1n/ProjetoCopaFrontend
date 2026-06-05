import { Component, OnInit, signal } from '@angular/core';
import { IngressosService, JogoCopa } from '../../services/ingressos-service';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css']
})
export class CalendarioComponent implements OnInit {

  // O Signal que vai guardar a lista pronta para a tela
  jogosDisponiveis = signal<JogoCopa[]>([]);

  constructor(private ingressosService: IngressosService) { }

  ngOnInit(): void {
    this.carregarJogos();
  }

  carregarJogos(): void {
    this.ingressosService.getJogosDaCopa().subscribe({
      next: (dados) => {
        if (dados) {
          // Filtra para mostrar apenas jogos com times definidos
          const jogosValidos = dados.filter(jogo => jogo.timeMandante && jogo.timeVisitante);
          this.jogosDisponiveis.set(jogosValidos);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar jogos', err);
      }
    });
  }
}