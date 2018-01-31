// ======================================
// Author: Komal Dubey
// Email:  kkdubey12@gmail.com
// 
// 

// ======================================

import { Directive, Input, Output, EventEmitter } from '@angular/core';


@Directive({
    selector: '[lastElement]'
})
export class LastElementDirective {
    @Input()
    set lastElement(isLastElement: boolean) {

        if (isLastElement) {
            setTimeout(() => {
                this.lastFunction.emit();
            });
        }
    }

    @Output()
    lastFunction = new EventEmitter();
}