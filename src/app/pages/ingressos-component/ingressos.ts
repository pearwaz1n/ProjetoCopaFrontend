import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IngressoVenda } from '../../ingresso';
import { IngressosService } from '../../services/ingressos-service';

@Component({
  selector: 'app-ingressos',
  standalone: false,
  templateUrl: './ingressos.html',
  styleUrls: ['./ingressos.css']
})
export class IngressosComponent implements OnInit {

  formGroupIngresso: FormGroup;

  // Inicializa o array reativo vazio, aguardando os dados da API
  ingressos = signal<IngressoVenda[]>([]);

  isEditing: boolean = false;
  termoBusca: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private ingressosService: IngressosService
  ) {
    this.formGroupIngresso = this.formBuilder.group({
      id: [''],
      cpf: [''],
      titular: [''],
      jogo: [''],
      setor: [''],
      assento: [''],
      preco: []
    });
  }

  ngOnInit(): void {
    this.carregarIngressos();
  }

  carregarIngressos(): void {
    this.ingressosService.getAllIngressos().subscribe({
      next: (dados) => {
        if (dados) {
          this.ingressos.set(dados);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do backend', err);
      }
    });
  }

  prepararCadastro(): void {
    this.isEditing = false;
    this.formGroupIngresso.reset();
  }

  prepararEdicao(ingresso: IngressoVenda): void {
    this.isEditing = true;
    this.formGroupIngresso.patchValue(ingresso);
  }

  excluir(ingresso: IngressoVenda): void {
    this.ingressosService.delete(ingresso).subscribe(() => {
      this.carregarIngressos(); // Recarrega a lista atualizada do banco
    });
  }

  salvar(): void {
    const ingressoForm: IngressoVenda = this.formGroupIngresso.value;

    if (this.isEditing) {
      this.ingressosService.update(ingressoForm).subscribe(() => {
        this.carregarIngressos();
        this.formGroupIngresso.reset();
        this.isEditing = false;
      });
    } else {
      this.ingressosService.save(ingressoForm).subscribe(() => {
        this.carregarIngressos();
        this.formGroupIngresso.reset();
        this.isEditing = false;
      });
    }
  }
}