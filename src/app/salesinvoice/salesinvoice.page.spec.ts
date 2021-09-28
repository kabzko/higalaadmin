import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesinvoicePage } from './salesinvoice.page';

describe('SalesinvoicePage', () => {
  let component: SalesinvoicePage;
  let fixture: ComponentFixture<SalesinvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesinvoicePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesinvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
