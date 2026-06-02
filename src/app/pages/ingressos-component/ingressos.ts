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

  // REACTIVE FORMS: O FormBuilder substitui o [(ngModel)] do HTML. 
  // Ele cria um grupo de controles que gerencia os dados do formulário de forma mais segura.
  formGroupIngresso: FormGroup;

  // SIGNALS: A nova forma do Angular de lidar com variáveis reativas. 
  // Em vez de um array comum, o Signal avisa o HTML automaticamente quando a lista muda, melhorando a performance.
  ingressos = signal<IngressoVenda[]>([
    { id: 101, cpf: '111222333-44', titular: 'Pedro Santos', jogo: 'Brasil x Marrocos', setor: 'VIP', assento: 'A10', preco: 450.00 },
    { id: 102, cpf: '555666777-88', titular: 'Mariana Lima', jogo: 'Argentina x França', setor: 'A norte', assento: 'B20', preco: 300.00 }
  ]);

  isEditing: boolean = false;
  termoBusca: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private ingressosService: IngressosService
  ) {
    // Inicializando o formulário com os campos em branco. 
    // As chaves precisam ter os mesmos nomes da sua Interface IngressoVenda!
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
        if (dados && dados.length > 0) {
          // Para atualizar o valor de um Signal, usamos o método .set()
          this.ingressos.set(dados);
        }
      },
      error: (err) => {
        console.warn('Backend offline, usando dados mockados temporários.', err);
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
    // --- SOLUÇÃO TEMPORÁRIA (MOCK) ATÉ O JAVA/H2 FICAR PRONTO ---
    this.ingressos.update(listaAtual => listaAtual.filter(ing => ing.id !== ingresso.id));

    // --- CÓDIGO OFICIAL DEFINITIVO (DESCOMENTE QUANDO O JAVA ESTIVER RODANDO) ---
    /*
    this.ingressosService.delete(ingresso).subscribe(() => {
      this.carregarIngressos();
    });
    */
  }

  salvar(): void {
    const ingressoForm: IngressoVenda = this.formGroupIngresso.value;

    if (this.isEditing) {
      // --- SOLUÇÃO TEMPORÁRIA (MOCK) ATÉ O JAVA/H2 FICAR PRONTO ---
      this.ingressos.update(listaAtual =>
        listaAtual.map(ing => ing.id === ingressoForm.id ? ingressoForm : ing)
      );

      // --- CÓDIGO OFICIAL DEFINITIVO (DESCOMENTE QUANDO O JAVA ESTIVER RODANDO) ---
      /*
      this.ingressosService.update(ingressoForm).subscribe(() => {
        this.carregarIngressos();
        this.formGroupIngresso.reset();
        this.isEditing = false;
      });
      */
    } else {
      // --- SOLUÇÃO TEMPORÁRIA (MOCK) ATÉ O JAVA/H2 FICAR PRONTO ---
      // 1. Gera um ID falso aleatório só para a tabela não ficar sem ID
      ingressoForm.id = Math.floor(Math.random() * 1000);
      // 2. Atualiza o Signal
      this.ingressos.update(listaAtual => [...listaAtual, ingressoForm]);

      // --- CÓDIGO OFICIAL DEFINITIVO (DESCOMENTE QUANDO O JAVA ESTIVER RODANDO) ---
      /*
      this.ingressosService.save(ingressoForm).subscribe(() => {
        this.carregarIngressos();
        this.formGroupIngresso.reset();
      });
      */
    }

    // Limpa os campos do modal e reseta o estado de edição
    this.formGroupIngresso.reset();
    this.isEditing = false;
  }
}