import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { UnicornPage } from './unicorn.page';

describe('UnicornPage', () => {
	let component: UnicornPage;
	let fixture: ComponentFixture<UnicornPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [UnicornPage],
			imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
		}).compileComponents();

		fixture = TestBed.createComponent(UnicornPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
