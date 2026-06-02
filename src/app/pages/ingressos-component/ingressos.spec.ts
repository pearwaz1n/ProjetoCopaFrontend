import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngressosComponent } from './ingressos';
import { IngressosService } from '../../services/ingressos-service';
import { of } from 'rxjs';

describe('IngressosComponent', () => {
  let component: IngressosComponent;
  let fixture: ComponentFixture<IngressosComponent>;
  let mockIngressosService: any;

  beforeEach(async () => {
    mockIngressosService = {
      getAllIngressos: () => of([]),
      save: (ingresso: any) => of(ingresso),
      delete: (ingresso: any) => of(null),
      update: (ingresso: any) => of(ingresso)
    };

    await TestBed.configureTestingModule({
      declarations: [IngressosComponent],
      providers: [
        { provide: IngressosService, useValue: mockIngressosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IngressosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
