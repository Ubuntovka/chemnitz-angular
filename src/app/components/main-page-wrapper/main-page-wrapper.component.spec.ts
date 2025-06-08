import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageWrapperComponent } from './main-page-wrapper.component';

describe('MainPageWrapperComponent', () => {
  let component: MainPageWrapperComponent;
  let fixture: ComponentFixture<MainPageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
