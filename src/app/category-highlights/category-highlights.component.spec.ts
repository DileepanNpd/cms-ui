import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryHighlightsComponent } from './category-highlights.component';

describe('CategoryHighlightsComponent', () => {
  let component: CategoryHighlightsComponent;
  let fixture: ComponentFixture<CategoryHighlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryHighlightsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
