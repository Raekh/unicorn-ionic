import { Component, Input, OnInit } from '@angular/core';
import { Gender, Unicorn } from 'src/app/services/unicorn';

@Component({
	selector: 'app-unicorn-info',
	templateUrl: './unicorn-info.component.html',
	styleUrls: ['./unicorn-info.component.scss'],
})
export class UnicornInfoComponent implements OnInit {

	@Input() unicorn: Unicorn;

	constructor() { }

	ngOnInit() {}

	getHex(color: number) {
		return color.toString(16).padEnd(2, '0');
	}

	getHexColor() {
		// return ((unicorn.color.r << 16) | (unicorn.color.g << 8) | unicorn.color.b).toString(16);
		return `#${this.getHex(this.unicorn.color.r)}${this.getHex(this.unicorn.color.g)}${this.getHex(this.unicorn.color.b)}`;
	}

	getBadgeColor() {
		switch(this.unicorn.gender) {
			case Gender.male:
				return 'primary';
			case Gender.female:
				return 'danger';
			default:
				return 'dark';
		}
	}
}
