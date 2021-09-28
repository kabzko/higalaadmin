import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StoreadminPage } from './storeadmin.page';

describe('StoreadminPage', () => {
  let component: StoreadminPage;
  let fixture: ComponentFixture<StoreadminPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreadminPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StoreadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
