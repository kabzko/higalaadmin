import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuperadminPage } from './superadmin.page';

describe('SuperadminPage', () => {
  let component: SuperadminPage;
  let fixture: ComponentFixture<SuperadminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
