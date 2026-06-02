import { Component, OnInit, signal } from '@angular/core';
import { FutebolService } from '../../services/futebol-service';

@Component({
  selector: 'app-calendario',
  standalone: false,
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css']
})
export class CalendarioComponent implements OnInit {

  // SIGNAL: Armazena a lista de jogos que vai vir da API
  jogos = signal<any[]>([]);

  // SIGNAL DE ESTADO: Controla se a tela está carregando ou se já pode mostrar os dados
  carregando = signal<boolean>(true);

  constructor(private futebolService: FutebolService) { }

  ngOnInit(): void {
    this.buscarJogos();
  }

  buscarJogos(): void {
    // Chama o serviço real que você criou
    this.futebolService.getJogosCopa().subscribe({
      next: (dados) => {

        // A mágica acontece aqui: O filtro varre a lista e guarda só os jogos futuros
        const jogosFuturos = dados.matches.filter((jogo: any) =>
          jogo.status === 'SCHEDULED' || jogo.status === 'TIMED'
        );

        // Atualiza o Signal apenas com os jogos filtrados
        this.jogos.set(jogosFuturos);

        // Desliga a bolinha de carregamento
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar dados da API:', erro);
        this.carregando.set(false);
      }
    });
  }
}