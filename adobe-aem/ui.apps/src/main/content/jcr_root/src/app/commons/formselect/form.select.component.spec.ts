import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormSelectComponent, FormSelectOption} from './form.select.component';
import {ClickOutsideDirective} from '../clickoutside.directive';

describe('FormSelectComponent', () => {
  let component: FromSelectTestComponent;
  let fixture: ComponentFixture<FromSelectTestComponent>;
  let label: HTMLElement;
  let displayValue: HTMLSpanElement;
  let filterInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [FromSelectTestComponent, FormSelectComponent, ClickOutsideDirective]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromSelectTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    label = fixture.debugElement.query(By.css('label.c-poland-form-select__label')).nativeElement;
    displayValue = fixture.debugElement.query(By.css('span.c-poland-form-select__placeholder')).nativeElement;
    filterInput = fixture.debugElement.query(By.css('div.c-poland-form-select__filter>input')).nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properly', () => {
    // Given
    // the component under test

    // When
    fixture.detectChanges();

    // Then
    expect(label.textContent).toEqual('My Label');
    expect(displayValue.innerText).toEqual('My Placeholder');
    expect(filterInput.placeholder).toEqual('My Filter Placeholder');

    const ulOptionsGroups = getOptionsGroups();
    expect(ulOptionsGroups.length).toBe(2);
    const optionGroup1values = getOptionsGroup(ulOptionsGroups[0]);
    const optionGroup2values = getOptionsGroup(ulOptionsGroups[1]);
    expect(optionGroup1values).toEqual(['AUDI', 'TOYOTA']);
    expect(optionGroup2values).toEqual(['ABARTH', 'ALFA ROMEO', 'BMW']);
  });

  it('should open/close on click', () => {
    // Given
    // component under test

    // When
    displayValue.click();
    fixture.detectChanges();

    // Then
    const formSelect = getSelectDiv();
    expect(formSelect.classes['is-opened']).toBe(true);

    // When
    displayValue.click();
    fixture.detectChanges();

    // Then
    expect(formSelect.classes['is-opened']).toBe(false);
  });

  it('should filter the options', () => {
    // Given
    // the component under test

    // When
    // if you find a way to simulate the keyup on filterInput please go ahead and improve
    component.formSelect.onFilterChange({target: {value: 'a'}});
    fixture.detectChanges();

    // Then
    const ulOptionsGroups = getOptionsGroups();
    expect(ulOptionsGroups.length).toBe(2);
    const optionGroup1values = getOptionsGroup(ulOptionsGroups[0]);
    const optionGroup2values = getOptionsGroup(ulOptionsGroups[1]);
    expect(optionGroup1values).toEqual(['AUDI']);
    expect(optionGroup2values).toEqual(['ABARTH', 'ALFA ROMEO']);
  });

  it('should select the option', () => {
    // Given
    // the component under test
    const ulOptionsGroups = getOptionsGroups();
    const optionToSelect = ulOptionsGroups[0].queryAll(By.css('li.c-poland-form-select__option'))[1].nativeElement;

    // When
    optionToSelect.click();
    fixture.detectChanges();

    // Then
    expect(component.myFormGroup.controls['myValue']['value'].value).toBe('TOYOTA');
  });

  it('should reset with new options', () => {
    // Given
    // the component under test

    // When
    component.optionGroups = FORM_SELECT_OPTIONS_2;
    fixture.detectChanges();

    const ulOptionsGroups = getOptionsGroups();
    expect(ulOptionsGroups.length).toBe(1);
    const optionGroup1values = getOptionsGroup(ulOptionsGroups[0]);
    expect(optionGroup1values).toEqual(['BMW', 'MERCEDES', 'PORSCHE']);
    expect(displayValue.innerText).toEqual('My Placeholder');
  });

  it('should close on outside click', () => {
    // Given
    // the component under test
    displayValue.click(); // opens the select
    fixture.detectChanges();

    // When
    const inputField = fixture.debugElement.query(By.css('#myinput')).nativeElement;
    inputField.click(); // click outside
    fixture.detectChanges();

    // Then
    const formSelect = getSelectDiv();
    expect(formSelect.classes['is-opened']).toBe(false);

  });

  function getSelectDiv() {
    return fixture.debugElement.query(By.css('div.c-poland-form-select'));
  }

  function getOptionsGroups() {
    return fixture.debugElement.queryAll(By.css('ul.c-poland-form-select__option-group'));
  }

  function getOptionsGroup(ulOptionsGroup: DebugElement) {
    return ulOptionsGroup.queryAll(By.css('li.c-poland-form-select__option'))
      .map(textContentOfLIElement);
  }

  function textContentOfLIElement(el: DebugElement) {
    return (el.nativeElement as HTMLLIElement).textContent.trim();
  }

});


const FORM_SELECT_OPTIONS = [
  [{group: 0, icon: 'c-icon--poland--brand-audi', value: 'AUDI'},
    {group: 0, icon: 'c-icon--poland--brand-toyota', value: 'TOYOTA'}],
  [{group: 1, icon: undefined, value: 'ABARTH'},
    {group: 1, icon: undefined, value: 'ALFA ROMEO'},
    {group: 1, icon: 'c-icon--poland--brand-bmw', value: 'BMW'}
  ]
];

const FORM_SELECT_OPTIONS_2 = [
  [{group: 0, icon: 'c-icon--poland--brand-bmw', value: 'BMW'},
    {group: 0, icon: 'c-icon--poland--brand-mercedes', value: 'MERCEDES'},
    {group: 0, icon: 'c-icon--poland--brand-porsche', value: 'PORSCHE'}
  ]
];

@Component({
  selector: 'app-form-select-test',
  template: `
    <form [formGroup]="myFormGroup">
      <input id="myinput"/>
      <app-form-select #formSelect
                       [label]="'My Label'"
                       [filterPlaceholder]="'My Filter Placeholder'"
                       [placeholder]="'My Placeholder'"
                       [optionGroups]="optionGroups"
                       [formGroup]="formSelectGroup"></app-form-select>
    </form>`
})
class FromSelectTestComponent {

  @ViewChild('formSelect') formSelect: FormSelectComponent;
  selectedOption: FormSelectOption;
  optionGroups: Array<Array<FormSelectOption>>;
  myFormGroup: FormGroup;
  formSelectGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formSelectGroup = this.formBuilder.group({value: [null, Validators.required]});
    this.myFormGroup = this.formBuilder.group({ // <-- the parent FormGroup
      myValue: this.formSelectGroup
    });

    this.optionGroups = FORM_SELECT_OPTIONS;
  }

}
