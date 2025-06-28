import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPwPage } from './reset-pw.page';

describe('ResetPwPage', () => {
  let component: ResetPwPage;
  let fixture: ComponentFixture<ResetPwPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
