import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[type=file]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileValueAccessorDirective,
      multi: true
    }
  ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {

  private onChange: Function;
  private onTouched: Function;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  writeValue(value: any): void {
    // no-op
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  @HostListener('change', ['$event.target.files'])
  onFileChange(files: FileList): void {
    this.onChange(files);
    this.onTouched();
  }

  @HostListener('blur')
  onHostBlur(): void {
    this.onTouched();
  }
}
