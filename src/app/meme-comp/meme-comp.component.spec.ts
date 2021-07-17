import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeCompComponent } from './meme-comp.component';

describe('MemeCompComponent', () => {
  let component: MemeCompComponent;
  let fixture: ComponentFixture<MemeCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeCompComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
