import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSourceSuggestionPageComponent } from './open-source-suggestion-page.component';

describe('OpenSourceSuggestionPageComponent', () => {
  let component: OpenSourceSuggestionPageComponent;
  let fixture: ComponentFixture<OpenSourceSuggestionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenSourceSuggestionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenSourceSuggestionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
