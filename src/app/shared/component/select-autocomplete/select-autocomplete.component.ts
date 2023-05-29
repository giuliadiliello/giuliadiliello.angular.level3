import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MacroCategorie, SottoCategorie } from 'src/app/data.models';

const DROPDOWN_ACCESSOR_VALUE = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'app-select-autocomplete',
  templateUrl: './select-autocomplete.component.html',
  styleUrls: ['./select-autocomplete.component.scss'],
  providers: [DROPDOWN_ACCESSOR_VALUE],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAutocompleteComponent implements ControlValueAccessor {

  nascondiFiltered = true;
  @Input() id: string = '';
  @Input() required = false;
  @Input() placeholder = '';
  @Input() items: MacroCategorie[] | SottoCategorie[] = [];

  @Input() items_filtered: MacroCategorie[] | SottoCategorie[] = [];

  @Output() emettiValore = new EventEmitter<number>();


  notFound = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    console.log(this.items);
    this.items_filtered = this.items;
  }

  onChange: any = () => {/**/};
  onTouch: any = () => {/**/};

  value = '';

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }


    writeValue(value: string) {
    console.log('writeValue');
    console.log(value);
    if (value) {
      this.value = value;
      this.onChange(value);
      this.changeDetectorRef.markForCheck();
    } else {
      this.value = '';
    }
    this.changeDetectorRef.detectChanges();
  }


  onValueChange(event: string) {
    this.emitValue(event);
  }


  private emitValue(stringDate: string) {
    console.log('emitValue');
    console.log(stringDate);

    try {
      this.onChange(stringDate);
    } catch {
      this.onChange(stringDate);
    }
  }

  settaValore(obj: any) {
    console.log(obj);
    this.value = obj.nome;
    this.filtra(obj.nome);
    this.nascondiFiltered = true;
    this.emettiValore.emit(obj.id);

  }


  filtra(text: string) {
    if (this.nascondiFiltered) {
      this.nascondiFiltered = false;
    }
      this.items_filtered = this.items.filter((item) => item.nome.toLowerCase().indexOf(text.toLocaleLowerCase()) !== -1);
      if(this.items_filtered.length > 0) {
          this.notFound = false;
      }
      else {
          this.notFound = true;
      }
 
  }
}
