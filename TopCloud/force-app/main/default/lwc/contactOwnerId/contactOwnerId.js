import { LightningElement, wire } from 'lwc';
import { getCurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';

export default class contactOwnerId extends LightningElement {
    currentPageReference = null;
    contactRecordId = null;
    ownerId = null;

    @wire(getCurrentPageReference)
    wiredPageReference({ error, data }) {
        if (data) {
            this.currentPageReference = data;
            this.contactRecordId = this.currentPageReference.state.recordId;
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getRecord, { recordId: '$contactRecordId', fields: ['Contact.OwnerId'] })
    wiredContact({ error, data }) {
        if (data) {
            this.ownerId = data.fields.OwnerId.value;
        } else if (error) {
            console.error(error);
        }
    }
}
