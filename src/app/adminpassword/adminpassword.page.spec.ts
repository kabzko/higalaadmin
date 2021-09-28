import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminpasswordPage } from './adminpassword.page';

describe('AdminpasswordPage', () => {
  let component: AdminpasswordPage;
  let fixture: ComponentFixture<AdminpasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminpasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminpasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
