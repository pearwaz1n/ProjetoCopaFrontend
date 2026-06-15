import { Component, OnInit, signal } from '@angular/core';
import { IngressosService, JogoCopa } from '../../services/ingressos-service';

// Interface adaptada para o ecrã
interface JogoExibicao extends JogoCopa {
  concluido: boolean;
}

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css']
})
export class CalendarioComponent implements OnInit {

  jogosDisponiveis = signal<JogoExibicao[]>([]);

  constructor(private ingressosService: IngressosService) { }

  ngOnInit(): void {
    this.carregarJogos();
  }

  carregarJogos(): void {
    this.ingressosService.getJogosDaCopa().subscribe({
      next: (dados) => {
        if (dados) {
          const jogosTratados = dados
            .filter(jogo => jogo.timeMandante && jogo.timeVisitante)
            .map(jogo => {
              return {
                ...jogo,
                // A API gringa devolve "FINISHED" quando o jogo já acabou
                concluido: jogo.status === 'FINISHED'
              };
            });

          this.jogosDisponiveis.set(jogosTratados);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar jogos', err);
      }
    });
  }
}