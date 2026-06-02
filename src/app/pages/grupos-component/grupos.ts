import { Component, OnInit, signal } from '@angular/core';
import { FutebolService } from '../../services/futebol-service';

@Component({
  selector: 'app-grupos',
  standalone: false,
  templateUrl: './grupos.html',
  styleUrls: ['./grupos.css']

})
export class GruposComponent implements OnInit {

  // Signal que vai guardar a lista de grupos real vinda do banco/API
  grupos = signal<any[]>([]);

  // Controla o spinner de carregamento
  carregando = signal<boolean>(true);

  constructor(private futebolService: FutebolService) { }

  ngOnInit(): void {
    this.buscarGrupos();
  }

  buscarGrupos(): void {
    // Chama o serviço real em vez de usar o Mock (dados falsos)
    this.futebolService.getGruposCopa().subscribe({
      next: (dados) => {
        // A API da FIFA retorna a tabela de classificação dentro da propriedade "standings"
        this.grupos.set(dados.standings);

        // Desliga a bolinha de carregamento quando os dados chegam
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao buscar a classificação dos grupos:', erro);
        // Desliga o carregamento mesmo se der erro, para não ficar girando infinitamente
        this.carregando.set(false);
      }
    });
  }
}