import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPwInputPage } from './reset-pw-input.page';

describe('ResetPwInputPage', () => {
  let component: ResetPwInputPage;
  let fixture: ComponentFixture<ResetPwInputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPwInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
