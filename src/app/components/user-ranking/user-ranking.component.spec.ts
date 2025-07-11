import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRankingComponent } from './user-ranking.component';

describe('UserRankingComponent', () => {
  let component: UserRankingComponent;
  let fixture: ComponentFixture<UserRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
