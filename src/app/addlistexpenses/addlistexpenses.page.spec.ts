import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddlistexpensesPage } from './addlistexpenses.page';

describe('AddlistexpensesPage', () => {
  let component: AddlistexpensesPage;
  let fixture: ComponentFixture<AddlistexpensesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlistexpensesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddlistexpensesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
