import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

/**
 * @whatItDoes represents an option in the {@link FormSelectComponent}, options can be grouped and the groups are shown
 * in ascending order
 *
 * @description
 *
 * It has three properties:
 * <table>
 * <tr><td>group</td><td>for grouping purposes</td></tr>
 * <tr><td>icon</td><td>css class for an options icon</td></tr>
 * <tr><td>brand</td><td>the brand of the option</td></tr>
 * </table>
 */
export interface FormSelectOption {
  group: number;
  icon: string;
  value: string;
}

/**
 * @whatItDoes
 * It's the angular component for the patternlab atom [atoms/40-form/poland-form-select.mustache]{@link https://github.developer.allianz.io/acp-amos-th/pattern-lab-poland/blob/master/source/_patterns/atoms/40-form/poland-form-select.mustache}.
 *
 * @howToUse
 * @example
 * In the parent component create a {@link FormGroup} e.g.
 * this.carBrandFormGroup = this.formBuilder.group({value: [null, Validators.required]});
 * and give it as input into the <app-form-select> component
 *
 * If you need access to it you can define a {@link ViewChild} in the parent component like this
 * @ViewChild('carBrand')
 * carBrandComponent: FormSelectComponent;
 *
 * <form [formGroup]="carDetailsFormGroup">
 * ...
 * <app-form-select #carBrand
 *  [label]="'Car Brand'"
 *  [filterPlaceholder]="'Type car brand'"
 *  [placeholder]="'Please Select Car Brand'"
 *  [optionGroups]="optionBrands"
 *  [formGroup]="carBrandFormGroup"></app-form-select>
 *  ...
 *  </form>
 *
 * @description
 *
 * It has five input properties:
 * <table>
 * <tr><td>label</td><td>label for the select</td></tr>
 * <tr><td>filterPlaceholder</td><td>placeholder for the input field to enter the filter for filtering the options</td></tr>
 * <tr><td>placeholder</td><td>placeholder for the select</td></tr>
 * <tr><td>optionBrands</td><td>option groups to show as two-dimensional array of {@link FormSelectOption}</td></tr>
 * <tr><td>formGroup</td><td>{@link FormGroup} controlled by this Component</td></tr>
 * </table>
 *
 */
@Component({
  selector: 'app-form-select',
  templateUrl: './form.select.html',
})
export class FormSelectComponent implements OnInit, OnChanges {

  @Input() label: string;
  @Input() filterPlaceholder: string;
  @Input() placeholder: string;
  @Input() optionGroups: Array<Array<FormSelectOption>> = new Array<Array<FormSelectOption>>();
  @Input() formGroup: FormGroup;

  private control: AbstractControl;

  isOpen = false; // true if the select unfolds its options
  value: string = null; // the current value of the select, can be null if nothing has been selected
  displayValue = ''; // the value shown in the Component, can be the placeholder or the actual value
  filterValue = ''; // value for filtering the items in the select
  currentOptionGroups: Array<Array<FormSelectOption>>; // select options to choose from

  constructor() {
  }

  ngOnInit(): void {
    this.currentOptionGroups = this.optionGroups;
    this.control = this.formGroup.get('value');
    this.control.valueChanges.forEach((value: string) => {
      this.displayValue = !!value ? value : this.placeholder;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // reset the value if a new placeholder or optionsGroup is set
    for (const propName of Object.keys(changes)) {
      if (propName === 'placeholder') {
        if (!!this.control) {
          this.control.setValue(null);
        }
        this.displayValue = changes[propName].currentValue;
      } else if (propName === 'optionGroups') {
        if (!!this.control) {
          this.control.setValue(null);
          this.currentOptionGroups = this.optionGroups;
        }
      }
    }
  }

  onFilterChange(event: any) {
    this.filterValue = event.target.value;

    const filteredOptionGroups = new Array<Array<FormSelectOption>>();
    const filter = this.filterValue.toLocaleUpperCase();
    for (const optionGroup of this.optionGroups) {
      const filteredOptionGroup = optionGroup.filter((option) => option.value.toLocaleUpperCase().startsWith(filter));
      if (filteredOptionGroup.length > 0) {
        filteredOptionGroups.push(filteredOptionGroup);
      }
    }

    this.currentOptionGroups = filteredOptionGroups;
  }

  onToggleOpen() {
    this.isOpen = !this.isOpen;
  }

  onReset() {
    this.control.setValue(null);
  }

  onSelectOption(option: FormSelectOption) {
    this.control.setValue(option.value);
    this.isOpen = false;
  }

  onOutsideClick() {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }

}
