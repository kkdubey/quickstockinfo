// ======================================
// Author: Komal Dubey
// Email:  kkdubey12@gmail.com
// 
// 

// ======================================

import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';

@Component({
    selector: 'not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css'],
    animations: [fadeInOut]
})
export class NotFoundComponent {
}
