import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import OWNER_ID_FIELD from '@salesforce/schema/Contact.OwnerId';


export default class CreateTrack extends LightningElement {
    @api recordId;
    candidateName;
    candidateOwnerId;

    @wire(getRecord, { recordId: '$recordId', fields: [OWNER_ID_FIELD] })
    wiredContact({ error, data }) {
        if (data) {
            this.contactOwnerId = data.fields.OwnerId.value;
        } else if (error) {
            // Handle error
        }
    }

    get defaultReminderDate() {
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        return twoWeeksLater.toISOString().slice(0, 10);
    }

    get candidateName() {
        return this.contact.data.fields.Name.value;
    }

    get candidateOwner() {
        return this.contact.data.ownerId;    
    }

    handleSuccess(event) {
        const createdTrackId = event.detail.id;
        const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Track has been created successfully.',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }
}
