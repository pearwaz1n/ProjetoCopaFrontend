import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposComponent } from './grupos';

describe('Grupos', () => {
  let component: GruposComponent;
  let fixture: ComponentFixture<GruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GruposComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GruposComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
