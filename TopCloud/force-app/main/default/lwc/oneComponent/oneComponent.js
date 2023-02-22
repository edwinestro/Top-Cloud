import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FLOW_STATUS_FIELD = 'Contact.Active_Recruitment_Flow_Status__c';
const STARTED_STATUS = 'Started';
const COMPANY_DECLINED_STATUS = 'Company Declined';
const POSITION_REJECTED_STATUS = 'Position Rejected';

export default class oneComponent extends LightningElement {
    @api recordId;
    showComponent = false;
    showTrack = false;
    showTag = false;
    showPing = false;

    @wire(getRecord, { recordId: '$recordId', fields: [FLOW_STATUS_FIELD] })
    contactRecord;

    get flowStatus() {
        return this.contactRecord.data.fields.Recruitment_Flow_Status__c.value;
    }

    connectedCallback() {
        this.handleStatusChange();
    }

    handleStatusChange() {
        switch (this.flowStatus) {
            case POSITION_REJECTED_STATUS:
                this.showTrack = true;
                break;
            case STARTED_STATUS:
                this.showPing = true;
                break;
            case COMPANY_DECLINED_STATUS:
                this.showTag = true;
                break;
            default:
                break;
        }
        this.showComponent = this.showTrack || this.showTag || this.showPing;
    }
}
