import { Component, ViewEncapsulation } from '@angular/core';
import { ScheduleDataService } from './shared';
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
    constructor(private data: ScheduleDataService) { }
}
