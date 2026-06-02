import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { TelaInicial } from './pages/tela-inicial-component/tela-inicial';
import { GruposComponent } from './pages/grupos-component/grupos';
import { CalendarioComponent } from './pages/calendario-component/calendario';
import { IngressosComponent } from './pages/ingressos-component/ingressos';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [App, Navbar, Footer, TelaInicial, GruposComponent, CalendarioComponent, IngressosComponent],
  imports: [BrowserModule, AppRoutingModule, NgbModule, ReactiveFormsModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule { }
