import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';
import { UnicornInfoComponent } from './unicorn-info/unicorn-info.component';

const routes: Routes = [
	{
		path: '',
		component: Tab1Page,
	},
	{
		path: 'info',
		component: UnicornInfoComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
