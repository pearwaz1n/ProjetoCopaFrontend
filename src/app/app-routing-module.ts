import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TelaInicial } from './pages/tela-inicial-component/tela-inicial';
import { GruposComponent } from './pages/grupos-component/grupos';
import { CalendarioComponent } from './pages/calendario-component/calendario';
import { IngressosComponent } from './pages/ingressos-component/ingressos';

const routes: Routes = [
  // Rota padrão: quando abrir o site, redireciona direto para a tela inicial
  { path: '', redirectTo: 'tela-inicial', pathMatch: 'full' },
  { path: 'tela-inicial', component: TelaInicial },
  { path: 'grupos', component: GruposComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'ingressos', component: IngressosComponent },
  { path: '**', redirectTo: 'tela-inicial' } // se o usuário digitar qualquer URL errada, volta para a tela inicial
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }