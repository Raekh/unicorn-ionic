import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Unicorn } from '../services/unicorn';
import { UnicornService } from '../services/unicorn.service';

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
		public actionSheetController: ActionSheetController
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
		return ((unicorn.color.r << 16) | (unicorn.color.g << 8) | unicorn.color.b).toString(16);
	}

	getFontAndText(unicorn: Unicorn) {
		return `&text=${this.getUrlName(unicorn)}&fontsize=50`;
	}

	getUrlName(unicorn: Unicorn) {
		return unicorn.name.replace(' ', '_');
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
}
