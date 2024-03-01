import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css']
})
export class Combobox implements OnInit {
  @Input() items: any[] = [];
  @Input() inputId = '';
  @Input() comboBoxId = '';
  @Input() selectedOption: any = {};
  @Input() isCreateNewItems: boolean = false;

  @Output() onOptionSelect = new EventEmitter<string>();

  initialData: any = {};

  ngOnInit(): void {
    console.log(this.items);
    console.log(this.selectedOption);
    this.initialData = {...this.selectedOption};
  }

  handleListSelect(option: any): void {
    this.selectedOption = option;
    this.handleComboboxDisplaying();

    this.onOptionSelect.emit(this.selectedOption.id);
  }

  handleComboboxDisplaying(): void {
    console.log(this.comboBoxId, `#${this.comboBoxId}`);
    const combobox: HTMLElement = document.querySelector(`#${this.comboBoxId}`) as HTMLElement;
    console.log(combobox);

    if (combobox?.classList.contains('slds-is-open')) {
      combobox?.classList.remove('slds-is-open');
    } else {
      combobox?.classList.add('slds-is-open');
    }
  }

  handleBlur(): void {
    this.selectedOption.id = null;
    this.onOptionSelect.emit(this.selectedOption.name);
  }

  handleTextInput(event: any): void {
    event.preventDefault();
  }
}