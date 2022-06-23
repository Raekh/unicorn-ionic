import { Injectable } from '@angular/core';
import { Color, Gender, Unicorn } from './unicorn';

const UNICORN_LIST = 'unicornList';
const FIRST_RUN = 'firstRun';

export enum ColorMergeStrategy {
	'average' = 'average',
	'pick' = 'pick'
}

export enum NameMergeStrategy {
	'concatenate' = 'concatenate',
	'compound' = 'compound'
}

@Injectable({
	providedIn: 'root'
})
export class UnicornService {

	public unicornList: Unicorn[];

	constructor() {
		this.unicornList = JSON.parse(localStorage.getItem(UNICORN_LIST)) as Unicorn[] || [];
		const appFirstRun = Boolean(localStorage.getItem(FIRST_RUN) || true);
		if(this.unicornList.length === 0 && appFirstRun) {
			this.unicornList = [
				new Unicorn({
					name: 'Bertrand',
					color: new Color({r: 0, g:0, b:255}),
					gender: Gender.male,
					age: 25
				}),
				new Unicorn({
					name: 'Zorglub',
					color: new Color({r: 120, g:120, b:120}),
					gender: Gender.other,
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
			const baby = new Unicorn({
				name: 'Jackjack',
				color: new Color({r:230, g:10, b:50}),
				gender: Gender.male,
				age: 3
			});
			this.unicornList.find((u: Unicorn) => u.name === 'Bertrand').children.push(baby);
			this.unicornList.push(baby);
			localStorage.setItem(UNICORN_LIST, JSON.stringify(this.unicornList));
			localStorage.setItem(FIRST_RUN, 'false');
		}
	}

	// mateRandomUnicorns() {
	// 	const maleUnicorns = this.unicornList.filter((unicorn: Unicorn) => unicorn.gender === Gender.male);
	// 	const femaleUnicorns = this.unicornList.filter((unicorn: Unicorn) => unicorn.gender === Gender.female);

	// 	const randomMaleUnicornIndex = Math.floor(Math.random() * maleUnicorns.length);
	// 	const randomFemaleUnicornIndex = Math.floor(Math.random() * femaleUnicorns.length);

	// 	const randomMaleUnicorn = maleUnicorns[randomMaleUnicornIndex];
	// 	const randomFemaleUnicorn = femaleUnicorns[randomFemaleUnicornIndex];

	// 	const offspring = this.mateUnicorns(randomMaleUnicorn, randomFemaleUnicorn);
	// 	randomMaleUnicorn.children.push(offspring);
	// 	randomFemaleUnicorn.children.push(offspring);

	// 	// this.unicornList.push(offspring);
	// 	this.addUnicorn(offspring);

	// 	console.log('%cunicornList', 'color:orange', this.unicornList);
	// }

	listAllUnicorns() {
		return this.unicornList;
	}

    addUnicorn(newUnicorn: Unicorn) {
		this.unicornList.push(newUnicorn);
		localStorage.setItem(UNICORN_LIST, JSON.stringify(this.unicornList));
    }

	mergeColors(aPrimary: number, bPrimary: number, strategy: string): number {
		switch(ColorMergeStrategy[strategy]) {
			case ColorMergeStrategy.average:
				return (aPrimary + bPrimary) / 2;

			case ColorMergeStrategy.pick:
				return Math.random() >= 0.5 ? bPrimary : aPrimary;
		}
	}

	mergeNames(aName: string, bName: string, strategy: NameMergeStrategy): string {
		switch(strategy as NameMergeStrategy) {
			case NameMergeStrategy.concatenate:
				return Math.random() >= 0.5 ? aName+' '+bName : bName+' '+aName;
			case NameMergeStrategy.compound:
				const firstOption = Math.random() >= 0.5;
				if(firstOption) {
					return aName.substring(0, aName.length/2)+bName.substring(bName.length/2);
				} else {
					return bName.substring(0, bName.length/2)+aName.substring(aName.length/2);
				}
		}
	}

	computeOffspringColor(unicornA: Unicorn, unicornB: Unicorn): Color {
		const newColor = new Color('000');

		newColor.r = this.mergeColors(unicornA.color.r, unicornB.color.r, ColorMergeStrategy.pick);
		newColor.g = this.mergeColors(unicornA.color.g, unicornB.color.g, ColorMergeStrategy.pick);
		newColor.b = this.mergeColors(unicornA.color.b, unicornB.color.b, ColorMergeStrategy.pick);

		return newColor;
	}

	computeOffspringName(unicornA: Unicorn, unicornB: Unicorn): string {
		return this.mergeNames(unicornA.name, unicornB.name, NameMergeStrategy.compound);
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
			throw new Error('DISGUSTANG');
		}

		const offspringColor = this.computeOffspringColor(unicornA, unicornB);
		const offspringName = this.computeOffspringName(unicornA, unicornB);

		const offspring = new Unicorn({
			name: offspringName,
			color: offspringColor,
			age: 0,
			gender: Math.random() >= 0.5 ? Gender.female : Gender.male
		});

		this.unicornList.find((unicorn: Unicorn) => unicorn === unicornA).children.push(offspring);
		this.unicornList.find((unicorn: Unicorn) => unicorn === unicornB).children.push(offspring);
		this.addUnicorn(offspring);
	}

	deleteUnicorns(unicornsToDelete: Unicorn[]) {
		unicornsToDelete.forEach((unicornToDelete) => {
			const unicornIndex = this.unicornList.findIndex((unicorn: Unicorn) => unicorn === unicornToDelete);
			this.unicornList.splice(unicornIndex, 1);
		});
		localStorage.setItem(UNICORN_LIST, JSON.stringify(this.unicornList));
	}
}
