import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusAntrianPage } from './status-antrian.page';

describe('StatusAntrianPage', () => {
  let component: StatusAntrianPage;
  let fixture: ComponentFixture<StatusAntrianPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusAntrianPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
