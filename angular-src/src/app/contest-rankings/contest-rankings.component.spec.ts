import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestRankingsComponent } from './contest-rankings.component';

describe('ContestRankingsComponent', () => {
  let component: ContestRankingsComponent;
  let fixture: ComponentFixture<ContestRankingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContestRankingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
