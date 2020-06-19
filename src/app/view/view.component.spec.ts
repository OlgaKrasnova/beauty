import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { ViewComponent } from './view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule ],
      declarations: [ ViewComponent ],
      // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Рендеринг прошел успешно', () => {
    expect(component).toBeTruthy();
  });

  it('Вывод фразы об отсутствии  товара', () => {
    component.product.number=0;
    component.numberOfItem();
    fixture.detectChanges();
    expect(component.hasOrNot).toBe("Отсутствует в продаже");
  });
});
