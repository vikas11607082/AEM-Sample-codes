import {RadioIconGroupComponent, RadioIconGroupHeader, RadioIconGroupItem} from './radio.icon.group';
import {Component, DebugElement} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';


describe('RadioIconGroup', () => {
    let component: RadioIconGroupTestComponent;
    let fixture: ComponentFixture<RadioIconGroupTestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [RadioIconGroupTestComponent, RadioIconGroupComponent]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(RadioIconGroupTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
      const radioItems = fixture.debugElement.queryAll(By.css('div.c-poland-radio-circle-group__item'));
      expect(radioItems.length).toBe(2);
      expect(getRadioItemLabel(radioItems[0])).toBe('Ja');
      expect(getRadioItemLabel(radioItems[1])).toBe('Nein');
    });

    it('should select value y', () => {
      // Given
      // the component under test

      // When
      const radioItems = getRadioItems();
      radioItems[0].query(By.css('input')).nativeElement.click();
      fixture.detectChanges();

      // Then
      expect(component.myFormGroup.get('isValueYesOrNo.yesNo').value).toBe('y');
    });

    it('should select value n', () => {
      // Given
      // the component under test

      // When
      const radioItems = getRadioItems();
      radioItems[1].query(By.css('input')).nativeElement.click();
      fixture.detectChanges();

      // Then
      expect(component.myFormGroup.get('isValueYesOrNo.yesNo').value).toBe('n');
    });

    function getRadioItems() {
      return fixture.debugElement.queryAll(By.css('div.c-poland-radio-circle-group__item'));
    }

    function getRadioItemLabel(radioItem: DebugElement) {
      return radioItem.queryAll(By.css('span.c-radio-circle__label-text'))
        .map((span) => (span.nativeElement as HTMLSpanElement).innerText)[0];
    }

  }
);

@Component({
  selector: 'app-radio-iocon-group-test',
  template: `
    <form [formGroup]="myFormGroup">
      <app-radio-icon-group [header]="{headlineItem: {text: 'Yes or No?',level: 3}}"
                            [formGroup]="yesNoForm"
                            [name]="'yesNo'"
                            [items]="[{key: 'y', label: 'Ja'}, {key: 'n', label: 'Nein'}]"></app-radio-icon-group>
    </form>
  `
})
class RadioIconGroupTestComponent {

  myFormGroup: FormGroup;
  yesNoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.yesNoForm = this.fb.group({yesNo: ['', Validators.required]});
    this.myFormGroup = this.fb.group({isValueYesOrNo: this.yesNoForm});
  }
}
