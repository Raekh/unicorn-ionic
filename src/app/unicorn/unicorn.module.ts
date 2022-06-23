import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnicornPage } from './unicorn.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { UnicornRoutingModule } from './unicorn-routing.module';
import { UnicornInfoComponent } from './unicorn-info/unicorn-info.component';
import { CreateUnicornComponent } from './create-unicorn/create-unicorn.component';

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		ExploreContainerComponentModule,
		UnicornRoutingModule
	],
	declarations: [UnicornPage, UnicornInfoComponent, CreateUnicornComponent]
})
export class UnicornPageModule {}
