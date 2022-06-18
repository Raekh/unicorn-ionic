import { Component, Input, OnInit } from '@angular/core';
import { Unicorn } from 'src/app/services/unicorn';

@Component({
	selector: 'app-unicorn-info',
	templateUrl: './unicorn-info.component.html',
	styleUrls: ['./unicorn-info.component.scss'],
})
export class UnicornInfoComponent implements OnInit {

	@Input() unicorn: Unicorn;

	constructor() { }

	ngOnInit() {}

}
