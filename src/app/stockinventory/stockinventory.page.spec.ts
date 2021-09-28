import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StockinventoryPage } from './stockinventory.page';

describe('StockinventoryPage', () => {
  let component: StockinventoryPage;
  let fixture: ComponentFixture<StockinventoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockinventoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StockinventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
