import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonBadge, ModalController } from '@ionic/angular';
import { Gender, Unicorn } from 'src/app/services/unicorn';

@Component({
	selector: 'app-create-unicorn',
	templateUrl: './create-unicorn.component.html',
	styleUrls: ['./create-unicorn.component.scss'],
})
export class CreateUnicornComponent implements OnInit {

	@ViewChild('colorPreview') colorPreview: ElementRef<IonBadge>;
	genderEnum = Gender;
	newUnicorn: Unicorn;
	name = '';
	fkMom = true;
	age = 0;
	red = 0;
	green = 0;
	blue = 0;
	gender: Gender;
	genders: any = [
		{
			id: 1,
			value: 'hey'
		},
		{
			id: 2,
			value: 'hey'
		},
		{
			id: 3,
			value: 'hey'
		},
	];

	constructor(
		private modalController: ModalController,
	) {
		this.newUnicorn = new Unicorn({
			name: '',
			age: 0,
			color: {r: 0, g:0, b:0},
			gender: Gender.other
		});
	}

	get isFormValid() {
		return this.name != ''
		&& this.age >= 0
		&& this.gender !== undefined;
	}

	ngOnInit() { }


	getColorValue(value: number) {
		return Math.floor(Math.max(0, Math.min(value / 100 * 255, 255)));
	}

	getColorPreview() {
		return `rgba(${this.red},${this.green},${this.blue})`;
	}

	cancel() {
		return this.modalController.dismiss(null, 'cancel');
	}

	confirm() {
		this.newUnicorn.name = this.name;
		this.newUnicorn.age = this.age;
		this.newUnicorn.gender = this.gender;
		this.newUnicorn.color = { r: this.red, g: this.green, b: this.blue };
		return this.modalController.dismiss(this.newUnicorn, 'cancel');
	}
}
