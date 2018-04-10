import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';

/**
 * @whatItDoes represents the header of radio icon group.
 *
 * currently only the headlineItem will be recognized. groupHeadline and groupSecondHeadline are not implemented.
 * See {@link https://github.developer.allianz.io/acp-amos-th/pattern-lab-poland/blob/master/source/_patterns/molecules/06-forms/03-poland-radio-icon-group.mustache}
 * for how headlineItem, groupHeadline, groupSecondHeadline are to be used.
 */
export interface RadioIconGroupHeader {
  headlineItem?: {
    text: string, // the text to show
    level: number, // the level of the html h-element e.g. <h3>text</h3>
    icon?: string
  },
  groupHeadline?: {
    text: string,
    // level = 2,
    icon: string
  }
  groupSecondHeadline?: {
    text: string,
    // level = 6
    icon: string
  }
}

/**
 * @whatItDoes influences the layout of the radio icon group
 *
 * not yet used
 */
enum RadioIconGroupOptions {
  ThreeColumns = 3,
  FourColumns = 4
}

/**
 * @whatItDoes represents one item in the radio icon group
 *
 */
export interface RadioIconGroupItem {
  key: string,
  label: string,
  icon?: string
}

/**
 * @whatItDoes
 * It's the angular component for the patternlab atom [molecules/06-forms/03-poland-radio-icon-group]{@link https://github.developer.allianz.io/acp-amos-th/pattern-lab-poland/blob/master/source/_patterns/molecules/06-forms/03-poland-radio-icon-group.mustache}.
 *
 * @howToUse
 * @example
 * In the parent component create a {@link FormGroup} e.g.
 * this.mailingAddressSameFormGroup = this.formBuilder.group({mailingAddressSame: [null, Validators.required]});
 * and give it as input into the <app-radio-icon-group> component. The form name used must match the <em>name</em>
 * input parameter of the <em>RadioIconGroupComponent</em>
 *
 * <form [formGroup]="policyHolderForm">
 * ...
 * <app-radio-icon-group [header]="{headlineItem: {text: 'Does the mailing address is the same as above?',level: 3}}"
 *  [formGroup]="mailingAddressSameFormGroup"
 *  [name]="'mailingAddressSame'"
 *  [items]="[{key: 'y', label: 'Yes'}, {key: 'n', label: 'No'}]"></app-radio-icon-group>
 *  ...
 *  </form>
 *
 * @description
 *
 * It has five input properties:
 * <table>
 * <tr><td>styleModifier</td><td>css classes to be added to the top level div</td></tr>
 * <tr><td>header</td><td>defines the header</td></tr>
 * <tr><td>options</td><td>options to influence the layout of the radio-icon-group</td></tr>
 * <tr><td>name</td><td>name of the radio item group used in the input element <input type="radio" name="{{name}}"></td></tr>
 * <tr><td>formGroup</td><td>{@link FormGroup} controlled by this Component</td></tr>
 * </table>
 *
 */
@Component({
  selector: 'app-radio-icon-group',
  templateUrl: './radio.icon.group.html'
})
export class RadioIconGroupComponent {

  @Input() styleModifier: string;
  @Input() header: RadioIconGroupHeader;
  @Input() options: RadioIconGroupOptions;
  @Input() items: Array<RadioIconGroupItem>;
  @Input() name: string;
  @Input() formGroup: FormGroup;

}
