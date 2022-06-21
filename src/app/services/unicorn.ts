export enum Gender {
	'male' = 'male',
	'female' = 'female',
	'other' = 'other'
}

export class Color {
	r: number;
	g: number;
	b: number;

	constructor(param: any) {
		if(param instanceof Object) {
			console.log('%cshould be once', '');
			({ r: this.r, g: this.g, b: this.b } = param);
		} else if(param.length === 3 || param.length === 6) {
			console.log('%cbut not twice', '');
			const chunkLength = param.length === 6 ? 2 : 1;
			const colors = chunkLength === 2
			? param.match(/.{2}|.{1,2}/g)
			: param.match(/.{1}|.{1,2}/g);
			this.r = Number('0x' + colors[0]);
			this.g = Number('0x' + colors[1]);
			this.b = Number('0x' + colors[2]);
		}
	}
};

// export class RgbColor {
// 	r: number;
// 	g: number;
// 	b: number;

// 	constructor(color: RgbColor) {
// 		this.r = color.r;
// 		this.g = color.g;
// 		this.b = color.b;
// 	}
// }

// export class HexColor implements Validator{
// 	value: string;

// 	get() {
// 		return this.value;
// 	}

// 	set(value: string) {
// 		this.value = value;
// 	}

// 	constructor(color: HexColor) {

// 	}
// }

export class Unicorn {
	name: string;
	color: Color;
	gender: Gender;
	age: number;
	children?: Unicorn[] = [];

	constructor(param: Unicorn) {
		({ name: this.name, color: this.color, gender: this.gender, age: this.age } = param);
	}
};

