import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateproductPage } from './updateproduct.page';

describe('UpdateproductPage', () => {
  let component: UpdateproductPage;
  let fixture: ComponentFixture<UpdateproductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateproductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
