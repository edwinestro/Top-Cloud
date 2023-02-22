import { LightningElement, api, wire } from 'lwc';
import getContactOwnerId from '@salesforce/apex/ContactController.getContactOwnerId';
import { getRecord } from 'lightning/uiRecordApi';

export default class myComponent extends LightningElement {
    @api recordId;

    contactOwnerId;

    @wire(getRecord, { recordId: '$recordId', fields: ['Contact.Id'] })
    contactRecord({ error, data }) {
        if (data) {
            getContactOwnerId({ contactId: data.fields.Id.value })
                .then(result => {
                    this.contactOwnerId = result;
                })
                .catch(error => {
                    console.error(error);
                });
        } else if (error) {
            console.error(error);
        }
    }

    get isContactRecord() {
        return this.recordId && this.recordId.startsWith('003');
    }

    get contactOwnerIdString() {
        return this.contactOwnerId ? this.contactOwnerId : '';
    }
}
