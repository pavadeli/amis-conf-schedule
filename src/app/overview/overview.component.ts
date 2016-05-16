import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { ScheduleDataModel, Session } from '../shared';
import { SessionPreviewComponent } from './session-preview';

@Component({
    moduleId: module.id,
    selector: 'acs-overview',
    templateUrl: 'overview.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [SessionPreviewComponent]
})
export class OverviewComponent implements OnChanges {

    @Input() model: ScheduleDataModel;
    slotSessions: { [slotId: string]: Session[] };

    ngOnChanges() {
        this.slotSessions = {};
        if (this.model) {
            this.model.slots.forEach(slot => {
                this.slotSessions[slot.slotId] = this.model.rooms
                    .map(room => slot.sessions[room.roomId])
                    .filter(session => !session || !session.continued);
            });
        }
    }

}
