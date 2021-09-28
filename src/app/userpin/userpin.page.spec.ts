import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserpinPage } from './userpin.page';

describe('UserpinPage', () => {
  let component: UserpinPage;
  let fixture: ComponentFixture<UserpinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserpinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserpinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
