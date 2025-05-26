import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DziedzinyComponent } from './dziedziny.component';

describe('DziedzinyComponent', () => {
  let component: DziedzinyComponent;
  let fixture: ComponentFixture<DziedzinyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DziedzinyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DziedzinyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
