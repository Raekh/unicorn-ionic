import { Component } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Gender, Unicorn } from '../services/unicorn';
import { UnicornService } from '../services/unicorn.service';
import { CreateUnicornComponent } from './create-unicorn/create-unicorn.component';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

	selectedUnicorn: Unicorn = null;
    isUnicornInfoModalOpen = false;

	constructor(
		public unicornService: UnicornService,
		public actionSheetController: ActionSheetController,
		public modal: ModalController,
	) {
		this.unicornService.listAllUnicorns();
	}

	addUnicorn() {
		console.log('add unicorn');
	}

	viewUnicornInfo(unicorn: Unicorn) {
		console.log(`view unicon info from ${unicorn.name}`);
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

	public async showActionSheet(unicorn: Unicorn, position: number) {
		const actionSheet = await this.actionSheetController.create({
			header: 'Unicorns',
			buttons: [
				{
					text: `View info`,
					icon: 'information-circle-outline',
					handler: () => {
						console.log('%chandler should work', 'color:deeppink', this.isUnicornInfoModalOpen);
						this.selectedUnicorn = unicorn;
						this.isUnicornInfoModalOpen = true;
						console.log('%chandler should work', 'color:limegreen', this.isUnicornInfoModalOpen);
					},
				},
				{
					text: `Delete ${unicorn.name}`,
					role: 'destructive',
					icon: 'trash',
					handler: () => {
						console.log(`Deleting ${unicorn.name} at position ${position}`);
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
