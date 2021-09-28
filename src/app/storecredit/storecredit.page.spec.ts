import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StorecreditPage } from './storecredit.page';

describe('StorecreditPage', () => {
  let component: StorecreditPage;
  let fixture: ComponentFixture<StorecreditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorecreditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StorecreditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
