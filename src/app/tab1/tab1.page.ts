import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActionSheetController, IonSearchbar, ModalController } from '@ionic/angular';
import { Gender, Unicorn } from '../services/unicorn';
import { UnicornService } from '../services/unicorn.service';
import { CreateUnicornComponent } from './create-unicorn/create-unicorn.component';

enum UiState {
	'browsing',
	'mating',
	'waitingForSecondMate',
	'deleting'
}

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

	@ViewChild('searchBar') searchBar: ElementRef<IonSearchbar>;
	unicornList: Unicorn[];

	uiState: UiState = UiState.browsing;
	enumUiState = UiState;
	currentSearchValue = '';
	selectedUnicorn: Unicorn = null;

	firstMate: Unicorn | null;
	secondMate: Unicorn | null;

    isUnicornInfoModalOpen = false;
    unicornsToDelete: Unicorn[] = [];

	constructor(
		public unicornService: UnicornService,
		public actionSheetController: ActionSheetController,
		public modal: ModalController,
	) {
		this.refreshUnicorns();
	}


	get noUnicornsToDisplay() {
		return this.unicornList.length === 0
		|| this.unicornList.every((unicorn: Unicorn) => !this.shouldDisplayUnicorn(unicorn));
	}

	get isSearchEmpty() {
		return this.currentSearchValue === '';
	}

	get isDeleteSelectionValid() {
		return this.unicornsToDelete.length > 0;
	}

	stateIs(state: UiState) {
		return this.uiState === state;
	}

	stateIsIn(states: UiState[]) {
		return states.includes(this.uiState);
	}

	setState(newState: UiState) {
		this.uiState = newState;
	}

	refreshUnicorns() {
		this.unicornList = this.unicornService.listAllUnicorns();
	}

	processSearchBarChange(event: any) {
		this.currentSearchValue = event.target.value;
	}

	shouldDisplayUnicorn(unicorn: Unicorn): boolean {
		switch(this.uiState) {
			case UiState.deleting:
				return true;
			case UiState.browsing:
				return unicorn.name.indexOf(this.currentSearchValue) !== -1;
			default:
				return this.isUnicornFitForMating(unicorn);
		}
	}

	shouldDisplayCheckbox(unicorn: Unicorn) {
		return this.stateIs(UiState.deleting) || (
			this.stateIsIn([UiState.mating, UiState.waitingForSecondMate])
			&& this.isUnicornFitForMating(unicorn)
		);
	}

	selectUnicorn(unicornToDelete: Unicorn) {
		if(this.stateIs(UiState.deleting)) {
			const unicornIndex = this.unicornsToDelete.findIndex((unicorn: Unicorn) => unicorn === unicornToDelete);
			unicornIndex !== -1
				? this.unicornsToDelete.splice(unicornIndex, 1)
				: this.unicornsToDelete.push(unicornToDelete);
			// if(this.unicornsToDelete.includes(unicorn)) {
			// 	const un
			// }
		}
		if(this.stateIs(UiState.mating)) {
			this.firstMate = unicornToDelete;
			this.setState(UiState.waitingForSecondMate);
			return;
		}
		if(this.stateIs(UiState.waitingForSecondMate)) {
			this.secondMate = unicornToDelete;
			this.unicornService.mateUnicorns(this.firstMate, this.secondMate);
			this.refreshUnicorns();
			this.setState(UiState.browsing);
			return;
		}
	}

	deleteSelectedUnicorns() {
		this.unicornService.deleteUnicorns(this.unicornsToDelete);
		this.setState(UiState.browsing);
		this.refreshUnicorns();
	}

	isUnicornFitForMating(unicorn: Unicorn) {
		if(unicorn.gender === Gender.other) {
			return false;
		}
		if(this.stateIs(UiState.mating)) {
			return true;
		}
		if(this.stateIs(UiState.waitingForSecondMate)) {
			return unicorn.gender !== this.firstMate.gender
			&& !this.areUnicornsRelated(this.firstMate, unicorn);
		}
	}

	areUnicornsRelated(unicornA: Unicorn, unicornB: Unicorn) {
		return unicornA.children.includes(unicornA)
		|| unicornB.children.includes(unicornA);
	}

	getHexColor(unicorn: Unicorn) {
		// return ((unicorn.color.r << 16) | (unicorn.color.g << 8) | unicorn.color.b).toString(16);
		return `${this.getHexString(unicorn.color.r)}${this.getHexString(unicorn.color.g)}${this.getHexString(unicorn.color.b)}`;
	}

	getHexString(color: number) {
		return color.toString(16).padEnd(2, '0');
	}

	getFontAndText(unicorn: Unicorn) {
		return `&text=${this.getUrlName(unicorn)}&fontsize=50`;
	}

	getUrlName(unicorn: Unicorn) {
		return unicorn.name.replace(' ', '_');
	}

	displayUnicornInfo(unicorn: Unicorn) {
		this.selectedUnicorn = unicorn;
		this.isUnicornInfoModalOpen = true;
	}

	getBadgeColor(unicorn: Unicorn) {
		switch(unicorn.gender) {
			case Gender.male:
				return 'primary';
			case Gender.female:
				return 'danger';
			default:
				return 'dark';
		}
	}

	startMatingProcess() {
		this.currentSearchValue = '';
		this.setState(UiState.mating);
	}

	startDeletingProcess() {
		this.currentSearchValue = '';
		this.setState(UiState.deleting);
	}

	cancelMatingProcess() {
		this.firstMate = null;
		this.secondMate = null;
		this.setState(UiState.browsing);
	}

	cancelDeletingProcess() {
		this.unicornsToDelete = [];
		this.setState(UiState.browsing);
	}

	public async showActionSheet(unicorn: Unicorn, position: number) {
		const actionSheet = await this.actionSheetController.create({
			header: 'Unicorns',
			buttons: [
				{
					text: `View info`,
					icon: 'information-circle-outline',
					handler: () => {
						this.selectedUnicorn = unicorn;
						this.isUnicornInfoModalOpen = true;
					},
				},
				{
					text: `Delete ${unicorn.name}`,
					role: 'destructive',
					icon: 'trash',
					handler: () => {
					},
				},
				{
					text: 'Cancel',
					role: 'cancel',
					icon: 'close',
					handler: () => {}
				}
			]
		});
		await actionSheet.present();
	}

	async openAddUnicornModal() {
		const modal = await this.modal.create({
			component: CreateUnicornComponent
		});
		modal.present();
		const { data } = await modal.onWillDismiss();
		if(data !== null) {
			this.unicornService.addUnicorn(data);
		}
	}
}
