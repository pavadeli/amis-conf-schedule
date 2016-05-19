import { Component, ViewEncapsulation } from '@angular/core';
import { ScheduleDataService, ScheduleDataModel } from './shared';
import { OverviewComponent } from './overview';

@Component({
    moduleId: module.id,
    selector: 'schedule-app',
    templateUrl: 'schedule.component.html',
    styleUrls: ['schedule.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [ScheduleDataService],
    directives: [OverviewComponent]
})
export class ScheduleAppComponent {

    error: string;
    model: ScheduleDataModel;

    constructor(data: ScheduleDataService) {
        data.model$.subscribe(
            model => this.model = model,
            () => this.error = 'Could not load session information. Service unavailable.'
        );
    }

}
