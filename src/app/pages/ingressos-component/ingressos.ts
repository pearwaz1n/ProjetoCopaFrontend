import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngressoVenda } from '../../ingresso';
import { IngressosService } from '../../services/ingressos-service';
import { JogoCopa } from '../../services/ingressos-service';

@Component({
  selector: 'app-ingressos',
  standalone: false,
  templateUrl: './ingressos.html',
  styleUrls: ['./ingressos.css']
})
export class IngressosComponent implements OnInit {

  formGroupIngresso: FormGroup;
  ingressos = signal<IngressoVenda[]>([]);
  jogosDisponiveis = signal<JogoCopa[]>([]);
  erroServidor = signal<string>('');
  isEditing: boolean = false;
  termoBusca: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private ingressosService: IngressosService
  ) {
    this.formGroupIngresso = this.formBuilder.group({
      id: [''],
      cpf: ['', [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(14),
        Validators.pattern(/^[0-9.-]*$/)
      ]],
      titular: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      jogo: ['', Validators.required],
      setor: ['', Validators.required],
      assento: ['', Validators.required],
      preco: ['', [
        Validators.required,
        Validators.min(0.01)
      ]]
    });
  }

  ngOnInit(): void {
    this.carregarIngressos();
    this.carregarJogos(); // <-- Chama a função nova
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
  carregarJogos(): void {
    this.ingressosService.getJogosDaCopa().subscribe({
      next: (dados) => {
        if (dados) {
          const jogosValidos = dados.filter(jogo => jogo.timeMandante && jogo.timeVisitante);
          this.jogosDisponiveis.set(jogosValidos);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar jogos da API externa', err);
      }
    });
  }

  prepararCadastro(): void {
    this.isEditing = false;
    this.formGroupIngresso.reset();
    this.erroServidor.set('');
  }

  prepararEdicao(ingresso: IngressoVenda): void {
    this.isEditing = true;
    this.formGroupIngresso.patchValue(ingresso);
  }

  excluir(ingresso: IngressoVenda): void {
    this.ingressosService.delete(ingresso).subscribe(() => {
      this.carregarIngressos();
    });
  }

  salvar(): void {
    if (this.formGroupIngresso.invalid) {
      this.formGroupIngresso.markAllAsTouched();
      return;
    }

    const ingressoForm: IngressoVenda = this.formGroupIngresso.value;
    this.erroServidor.set('');

    if (this.isEditing) {
      this.ingressosService.update(ingressoForm).subscribe({
        next: () => this.finalizarSalvamento(),
        error: (err) => this.lidarComErroBackend(err)
      });
    } else {
      this.ingressosService.save(ingressoForm).subscribe({
        next: () => this.finalizarSalvamento(),
        error: (err) => this.lidarComErroBackend(err)
      });
    }
  }

  lidarComErroBackend(err: any): void {
    console.error('Erro do servidor:', err);
    if (err.status === 400) {
      this.erroServidor.set('O servidor recusou o cadastro. Verifique se o CPF é um número válido e real.');
    } else {
      this.erroServidor.set('Erro de comunicação com o servidor.');
    }
  }

  finalizarSalvamento(): void {
    this.carregarIngressos();
    this.formGroupIngresso.reset();
    this.isEditing = false;
    document.getElementById('btnFecharModal')?.click();
  }
}