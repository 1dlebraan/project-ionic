import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PenggunaPage } from './pengguna.page';

describe('PenggunaPage', () => {
  let component: PenggunaPage;
  let fixture: ComponentFixture<PenggunaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PenggunaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
