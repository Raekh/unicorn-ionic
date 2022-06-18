import { Injectable } from '@angular/core';
import { Color, Gender, Unicorn } from './unicorn';

// export enum MergeStrategy {
// 	[key: string]
// }
//
//

export enum ColorMergeStrategy {
	'average' = 'average',
	'pick' = 'pick'
}

export enum NameMergeStrategy {
	'concatenate' = 'concatenate'
}

@Injectable({
	providedIn: 'root'
})
export class UnicornService {

	public unicornList: Unicorn[];

	constructor() {
		this.unicornList = [
			new Unicorn({
				name: 'Bertrand',
				color: new Color({r: 0, g:0, b:255}),
				gender: Gender.male,
				age: 25
			}),
			new Unicorn({
				name: 'Cindy',
				color: new Color('0402ae'),
				gender: Gender.female,
				age: 16
			}),
			new Unicorn({
				name: 'Flash',
				color: new Color({r:255, g:125, b:0}),
				gender: Gender.male,
				age: 18
			}),
			new Unicorn({
				name: 'Butcher',
				color: new Color({r:255, g:0, b:0}),
				gender: Gender.male,
				age: 35
			}),
			new Unicorn({
				name: 'PoisonIvy',
				color: new Color({r:50, g:230, b:10}),
				gender: Gender.female,
				age: 25
			})
		];
	}

	mateRandomUnicorns() {
		const maleUnicorns = this.unicornList.filter((unicorn: Unicorn) => unicorn.gender === Gender.male);
		const femaleUnicorns = this.unicornList.filter((unicorn: Unicorn) => unicorn.gender === Gender.female);

		const randomMaleUnicornIndex = Math.floor(Math.random() * maleUnicorns.length);
		const randomFemaleUnicornIndex = Math.floor(Math.random() * femaleUnicorns.length);

		const randomMaleUnicorn = maleUnicorns[randomMaleUnicornIndex];
		const randomFemaleUnicorn = femaleUnicorns[randomFemaleUnicornIndex];

		const offspring = this.mateUnicorns(randomMaleUnicorn, randomFemaleUnicorn);
		randomMaleUnicorn.children.push(offspring);
		randomFemaleUnicorn.children.push(offspring);

		this.unicornList.push(offspring);

		console.log('%cunicornList', 'color:orange', this.unicornList);
	}

	getRandomEnum<T extends object>(anEnum: T): T[keyof T] {
		const enumValues = Object.keys(anEnum)
		.filter(key => typeof anEnum[key as keyof typeof anEnum] === 'number')
		.map(key => key);

		const randomIndex = Math.floor(Math.random() * enumValues.length);
		return anEnum[randomIndex as keyof T];
	}

	listAllUnicorns() {
		console.log(this.unicornList);
	}

	mergeColors(aPrimary: number, bPrimary: number, strategy: string): number {
		switch(ColorMergeStrategy[strategy]) {
			case ColorMergeStrategy.average:
				console.log('%caverage was chosen', 'color:limegreen');
				return (aPrimary + bPrimary) / 2;

			case ColorMergeStrategy.pick:
				console.log('%cpick was chosen', 'color:deeppink');
				return Math.random() >= 0.5 ? bPrimary : aPrimary;
		}
	}

	mergeNames(aName: string, bName: string, strategy: NameMergeStrategy): string {
		switch(strategy as NameMergeStrategy) {
			case NameMergeStrategy.concatenate:
				console.log('%cfirst option', '', aName+' '+bName);
				console.log('%csecond option', '', bName+' '+aName);
				return Math.random() >= 0.5 ? aName+' '+bName : bName+' '+aName;
		}
	}

	computeOffspringColor(unicornA: Unicorn, unicornB: Unicorn): Color {
		// const colorMergeStrategies = [
		// 	this.getRandomEnum(ColorMergeStrategy),
		// 	this.getRandomEnum(ColorMergeStrategy),
		// 	this.getRandomEnum(ColorMergeStrategy),
		// ];
		const newColor = new Color('000');

		console.log('%cthis.computeOffspringColor', 'color:red');

		newColor.r = this.mergeColors(unicornA.color.r, unicornB.color.r, ColorMergeStrategy.pick);
		newColor.g = this.mergeColors(unicornA.color.g, unicornB.color.g, ColorMergeStrategy.pick);
		newColor.b = this.mergeColors(unicornA.color.b, unicornB.color.b, ColorMergeStrategy.pick);

		return newColor;
	}

	computeOffspringName(unicornA: Unicorn, unicornB: Unicorn): string {
		// const nameMergeStrategy = this.getRandomEnum(NameMergeStrategy);
		return this.mergeNames(unicornA.name, unicornB.name, NameMergeStrategy.concatenate);
	}

	mateUnicorns(unicornA: Unicorn, unicornB: Unicorn) {
		const isReproductionPossible =
			[unicornA,unicornB].some((unicorn: Unicorn) => unicorn.gender === Gender.female)
		&& [unicornA,unicornB].some((unicorn: Unicorn) => unicorn.gender === Gender.male);

		if(!isReproductionPossible) {
			throw new Error('Reproduction is not possible. Need one male and one female.');
		}

		const consanguinity =
			[unicornA, unicornB].some((unicorn: Unicorn) => unicorn.children.includes(unicornA) || unicorn.children.includes(unicornB));

		if(consanguinity) {
			console.log('DISGUSTANG');
			return;
		}

		const offspringColor = this.computeOffspringColor(unicornA, unicornB);
		const offspringName = this.computeOffspringName(unicornA, unicornB);

		const offspring = new Unicorn({
			name: offspringName,
			color: offspringColor,
			age: 0,
			gender: Math.random() >= 0.5 ? Gender.female : Gender.male
		});

		return offspring;
	}
}
