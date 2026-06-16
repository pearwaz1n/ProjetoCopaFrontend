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

  // Mapas assentos
  mapaAssentos = signal([
    ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'A-07', 'A-08'],
    ['B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06', 'B-07', 'B-08'],
    ['C-01', 'C-02', 'C-03', 'C-04', 'C-05', 'C-06', 'C-07', 'C-08'],
    ['D-01', 'D-02', 'D-03', 'D-04', 'D-05', 'D-06', 'D-07', 'D-08'],
    ['', '', 'VIP-01', 'VIP-02', 'VIP-03', 'VIP-04', '', ''] //espacos vazios para centralizar
  ]);

  // Variável para guardar qual cadeira está clicada
  assentoSelecionado = signal<string>('');

  // Guarda a lista de cadeiras que já foram vendidas para o jogo selecionado
  assentosOcupados = signal<string[]>([]);

  constructor(
    private formBuilder: FormBuilder,
    private ingressosService: IngressosService
  ) {
    // Inicializa o formulário reativo com regras de validação para cada campo
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
    // Ao iniciar o componente, carrega a lista de ingressos e os jogos da API
    this.carregarIngressos();
    this.carregarJogos();

    // Escuta as mudanças no campo de jogo para recalcular os assentos ocupados
    this.formGroupIngresso.get('jogo')?.valueChanges.subscribe(jogoSelecionado => {
      this.atualizarAssentosOcupados(jogoSelecionado);
      this.assentoSelecionado.set(''); // Limpa a cadeira selecionada ao trocar de jogo
      this.formGroupIngresso.patchValue({ assento: '' });
    });
  }

  // Busca a lista de ingressos já cadastrados no backend
  carregarIngressos(): void {
    this.ingressosService.getAllIngressos().subscribe({
      next: (dados) => {
        if (dados) {
          this.ingressos.set(dados);
          // Atualiza o mapa caso um jogo já esteja selecionado na edição
          const jogoAtual = this.formGroupIngresso.get('jogo')?.value;
          if (jogoAtual) {
            this.atualizarAssentosOcupados(jogoAtual);
          }
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do backend', err);
      }
    });
  }

  // Busca os jogos disponíveis de uma API externa para preencher as opções de seleção
  carregarJogos(): void {
    this.ingressosService.getJogosDaCopa().subscribe({
      next: (dados) => {
        if (dados) {
          // Filtra os jogos válidos e oculta aqueles que já foram concluídos (status FINISHED)
          const jogosValidos = dados.filter(jogo =>
            jogo.timeMandante &&
            jogo.timeVisitante &&
            jogo.status !== 'FINISHED'
          );
          this.jogosDisponiveis.set(jogosValidos);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar jogos da API externa', err);
      }
    });
  }

  // Filtra os ingressos do banco e separa apenas os assentos vendidos para o jogo atual
  atualizarAssentosOcupados(jogoSelecionado: string): void {
    if (!jogoSelecionado) {
      this.assentosOcupados.set([]);
      return;
    }

    const ocupados = this.ingressos()
      .filter(ingresso => ingresso.jogo === jogoSelecionado)
      .map(ingresso => ingresso.assento);

    this.assentosOcupados.set(ocupados);
  }

  // Atribui a cadeira clicada ao formulário, ignorando as vendidas e espaços vazios
  selecionarAssento(assento: string): void {
    if (!assento) return; // Ignora se clicar no espaço vazio

    if (this.assentosOcupados().includes(assento)) return; // Ignora se a cadeira já estiver ocupada

    this.assentoSelecionado.set(assento); // Pinta a cadeira
    this.formGroupIngresso.patchValue({ assento: assento }); // Joga pro formulário
  }

  // Limpa o formulário e reseta o estado para iniciar o cadastro de um novo ingresso
  prepararCadastro(): void {
    this.isEditing = false;
    this.formGroupIngresso.reset();
    this.erroServidor.set('');
    this.assentoSelecionado.set('');
  }

  // Preenche o formulário com os dados de um ingresso existente para a sua edição
  prepararEdicao(ingresso: IngressoVenda): void {
    this.isEditing = true;
    this.formGroupIngresso.patchValue(ingresso);
    this.assentoSelecionado.set(ingresso.assento); // Pinta a cadeira na edição
  }

  // Remove um ingresso do sistema através do backend
  excluir(ingresso: IngressoVenda): void {
    this.ingressosService.delete(ingresso).subscribe(() => {
      this.carregarIngressos();
    });
  }

  // Valida os dados do formulário e realiza a criação ou atualização do ingresso
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

  // Exibe mensagens de erro amigáveis baseadas na resposta da API
  lidarComErroBackend(err: any): void {
    console.error('Erro do servidor:', err);
    if (err.status === 400) {
      this.erroServidor.set('O servidor recusou o cadastro. Verifique se o CPF é um número válido e real.');
    } else {
      this.erroServidor.set('Erro de comunicação com o servidor.');
    }
  }

  // Atualiza a lista, limpa o formulário e fecha o modal de cadastro após sucesso
  finalizarSalvamento(): void {
    this.carregarIngressos();
    this.formGroupIngresso.reset();
    this.isEditing = false;
    document.getElementById('btnFecharModal')?.click();
  }
}