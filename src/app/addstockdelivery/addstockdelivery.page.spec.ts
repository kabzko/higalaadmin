import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddstockdeliveryPage } from './addstockdelivery.page';

describe('AddstockdeliveryPage', () => {
  let component: AddstockdeliveryPage;
  let fixture: ComponentFixture<AddstockdeliveryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddstockdeliveryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddstockdeliveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
