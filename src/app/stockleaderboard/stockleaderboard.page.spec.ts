import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockleaderboardPage } from './stockleaderboard.page';

describe('StockleaderboardPage', () => {
  let component: StockleaderboardPage;
  let fixture: ComponentFixture<StockleaderboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockleaderboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockleaderboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
