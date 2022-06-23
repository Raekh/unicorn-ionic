import { Injectable } from '@angular/core';
import { Color, Gender, Unicorn } from './unicorn';

const UNICORN_LIST = 'unicornList';
const FIRST_RUN = 'firstRun';

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
		this.unicornList = JSON.parse(localStorage.getItem(UNICORN_LIST)) as Unicorn[] || [];
		const appFirstRun = Boolean(localStorage.getItem(FIRST_RUN) || true);
		console.log('%cunicornList length', 'color:orange', this.unicornList.length);
		console.log('%cappFirstRun', 'color:yellow', appFirstRun);
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

		// this.unicornList.push(offspring);
		this.addUnicorn(offspring);

		console.log('%cunicornList', 'color:orange', this.unicornList);
	}

	listAllUnicorns() {
		console.log(this.unicornList);
		return this.unicornList;
	}

    addUnicorn(newUnicorn: Unicorn) {
		this.unicornList.push(newUnicorn);
		localStorage.setItem(UNICORN_LIST, JSON.stringify(this.unicornList));
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
		const newColor = new Color('000');

		console.log('%cthis.computeOffspringColor', 'color:red');

		newColor.r = this.mergeColors(unicornA.color.r, unicornB.color.r, ColorMergeStrategy.pick);
		newColor.g = this.mergeColors(unicornA.color.g, unicornB.color.g, ColorMergeStrategy.pick);
		newColor.b = this.mergeColors(unicornA.color.b, unicornB.color.b, ColorMergeStrategy.pick);

		return newColor;
	}

	computeOffspringName(unicornA: Unicorn, unicornB: Unicorn): string {
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

		return offspring;
	}
}
