import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectAlwaysComponent } from './redirect-always.component';

describe('RedirectAlwaysComponent', () => {
  let component: RedirectAlwaysComponent;
  let fixture: ComponentFixture<RedirectAlwaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectAlwaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectAlwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
