import { Component, OnInit, signal } from '@angular/core';
import { IngressosService } from '../../services/ingressos-service';

@Component({
  selector: 'app-grupos',
  standalone: false,
  templateUrl: './grupos.html',
  styleUrls: ['./grupos.css'] // Ajuste se necessário
})
export class GruposComponent implements OnInit {

  // O nosso novo formato de dados: Uma lista que tem o nome do grupo e um array de strings com os times
  grupos = signal<{ nome: string, times: string[] }[]>([]);

  constructor(private ingressosService: IngressosService) { }

  ngOnInit(): void {
    this.carregarGrupos();
  }

  carregarGrupos(): void {
    this.ingressosService.getJogosDaCopa().subscribe({
      next: (dados) => {
        if (dados) {
          // 1. Pega apenas os jogos válidos
          const jogosValidos = dados.filter(jogo => jogo.timeMandante && jogo.timeVisitante);

          // 2. Cria um "Dicionário" (Map) onde a chave é o Grupo e o valor é uma lista sem repetições (Set) de times
          const mapaGrupos = new Map<string, Set<string>>();

          jogosValidos.forEach(jogo => {
            if (!mapaGrupos.has(jogo.grupo)) {
              mapaGrupos.set(jogo.grupo, new Set<string>());
            }
            // Adiciona os dois times no Set daquele grupo (o Set ignora nomes duplicados automaticamente)
            mapaGrupos.get(jogo.grupo)!.add(jogo.timeMandante);
            mapaGrupos.get(jogo.grupo)!.add(jogo.timeVisitante);
          });

          // 3. Converte o nosso Map para o formato visual e coloca em ordem alfabética
          const listaGrupos = Array.from(mapaGrupos.entries()).map(([nome, timesSet]) => {
            return {
              nome: nome.replace('_', ' '), // Troca "GROUP_A" por "GROUP A" para ficar mais bonito
              times: Array.from(timesSet).sort() // Coloca os países em ordem alfabética
            };
          }).sort((a, b) => a.nome.localeCompare(b.nome)); // Organiza os grupos do A ao L

          // Salva no Signal para desenhar a tela
          this.grupos.set(listaGrupos);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar grupos', err);
      }
    });
  }
}