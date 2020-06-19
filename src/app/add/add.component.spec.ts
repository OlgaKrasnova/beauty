import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddComponent } from './add.component';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('AddComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Рендеринг прошел успешно', () => {
    expect(component).toBeTruthy();
  });

  it ('Форма должна быть заполнена', () => {
    const name = component.form.get('name');
    const artikul = component.form.get('artikul');
    const price = component.form.get('price');
    const weight = component.form.get('weight');
    const description = component.form.get('description');
    const number = component.form.get('number');
    const ingredients = component.form.get('ingredients');
    name.setValue('');
    artikul.setValue('');
    price.setValue('');
    weight.setValue('');
    description.setValue('');
    number.setValue('');
    ingredients.setValue('');
    expect(component.form.valid).toBeFalsy();
});
});
