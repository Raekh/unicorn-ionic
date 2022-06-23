import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnicornInfoComponent } from './unicorn-info/unicorn-info.component';
import { UnicornPage } from './unicorn.page';

const routes: Routes = [
	{
		path: '',
		component: UnicornPage,
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
export class UnicornRoutingModule {}
