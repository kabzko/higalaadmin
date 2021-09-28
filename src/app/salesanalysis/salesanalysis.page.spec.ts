import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalesanalysisPage } from './salesanalysis.page';

describe('SalesanalysisPage', () => {
  let component: SalesanalysisPage;
  let fixture: ComponentFixture<SalesanalysisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesanalysisPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesanalysisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
