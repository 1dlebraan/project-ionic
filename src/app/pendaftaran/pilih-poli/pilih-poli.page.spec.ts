import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PilihPoliPage } from './pilih-poli.page';

describe('PilihPoliPage', () => {
  let component: PilihPoliPage;
  let fixture: ComponentFixture<PilihPoliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PilihPoliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
