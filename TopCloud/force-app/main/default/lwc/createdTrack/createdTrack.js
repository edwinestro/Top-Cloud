import { LightningElement, api, wire } from 'lwc';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import TRACK_OBJECT from '@salesforce/schema/Track__c';
import CANDIDATE_FIELD from '@salesforce/schema/Track__c.Candidate__c';

const FIELDS = [
    'Contact.Name',
    'Contact.OwnerId'
];

export default class CreatedTrack extends LightningElement {
    @api recordId;
    candidateName;
    candidateOwner;
    trackingReason;
    trackReminderDate;
    primaryRecruiter;
    secondaryRecruiter;
    createdTrack = false;
    track;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    contact;

    get defaultReminderDate() {
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        return twoWeeksLater.toISOString().slice(0, 10);
    }

    get candidateName() {
        return this.contact.data.fields.Name.value;
    }

    get candidateOwner() {
        return this.contact.data.fields.OwnerId.value;    
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
