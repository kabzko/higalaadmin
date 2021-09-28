import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddexpensesPage } from './addexpenses.page';

describe('AddexpensesPage', () => {
  let component: AddexpensesPage;
  let fixture: ComponentFixture<AddexpensesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddexpensesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddexpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
