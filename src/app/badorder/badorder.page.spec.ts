import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BadorderPage } from './badorder.page';

describe('BadorderPage', () => {
  let component: BadorderPage;
  let fixture: ComponentFixture<BadorderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadorderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BadorderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
