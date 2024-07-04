import { Directive, DoCheck, ElementRef, Renderer2, computed, effect, inject, input, signal } from '@angular/core';
import { hlm } from '@spartan-ng/ui-core';
import { ClassValue } from 'clsx';

@Directive({
	selector: '[hlmProgressIndicator],brn-progress-indicator[hlm]',
	standalone: true,
	host: {
		'[class]': '_computedClass()',
	},
})
export class HlmProgressIndicatorDirective implements DoCheck {
	private _element = inject(ElementRef);
	private _renderer = inject(Renderer2);
	private readonly _value = signal(0);

	public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected _computedClass = computed(() =>
		hlm('bg-primary inline-flex justify-center text-center', this.userClass()),
	);

	constructor() {
		effect(() => {
      const currentValue = this._value();
      const widthPercentage = currentValue ? `${currentValue}%` : '0%';

      this._renderer.setStyle(this._element.nativeElement, 'width', widthPercentage);
      this._renderer.setStyle(this._element.nativeElement, 'border-radius', '9999px');
    });
	}

	ngDoCheck(): void {
		this._value.set(this._element.nativeElement.getAttribute('data-value'));
	}
}
