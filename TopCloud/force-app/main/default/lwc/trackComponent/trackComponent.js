import { LightningElement, api, wire } from 'lwc';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import TRACK_OBJECT from '@salesforce/schema/Track__c';
import CANDIDATE_FIELD from '@salesforce/schema/Track__c.Candidate__c';
import getContactOwnerId from '@salesforce/apex/ContactController.getContactOwnerId';


export default class trackComponent extends LightningElement {
    @api recordId;
    trackingReason;
    trackReminderDate;
    primaryRecruiter;
    secondaryRecruiter;
    createdTrack = false;
    track;
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

    get defaultReminderDate() {
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        return twoWeeksLater.toISOString().slice(0, 10);
    }

    handleTrackingReasonChange(event) {
        this.trackingReason = event.target.value;
    }

    handleTrackReminderDateChange(event) {
        this.trackReminderDate = event.target.value;
    }

    handlePrimaryRecruiterChange(event) {
        this.primaryRecruiter = event.target.value;
    }

    handleSecondaryRecruiterChange(event) {
        this.secondaryRecruiter = event.target.value;
    }

    handleSuccess(event) {
        this.createdTrack = true;
        this.track = event.detail.id;
        const toastEvent = new ShowToastEvent({
            title: 'Success',
            message: 'Track has been created.',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);
    }

    convertTrack() {
        // Your conversion logic goes here
    }

    closeTrack() {
        // Your closing logic goes here
    }

    handleSubmit(event) {
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;
        fields[CANDIDATE_FIELD.fieldApiName] = this.recordId;
        createRecord({                  // call Apex method to create Track record
            apiName: TRACK_OBJECT.objectApiName,
            fields
        })
        .then(track => {
            this.createdTrack = true;
            this.track = track.id;
            const toastEvent = new ShowToastEvent({
                title: 'Success',
                message: 'Track has been created.',
                variant: 'success'
            });
            this.dispatchEvent(toastEvent);
        })
        .catch(error => {
            const toastEvent = new ShowToastEvent({
                title: 'Error creating record',
                message: error.body.message,
                variant: 'error'
            });
            this.dispatchEvent(toastEvent);
        });
    }
}
