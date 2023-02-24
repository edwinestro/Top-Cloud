import { LightningElement, api, wire  } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import TRACK_OBJECT from '@salesforce/schema/Track__c';
import CANDIDATE_FIELD from '@salesforce/schema/Track__c.Candidate__c';
import getContactOwnerId from '@salesforce/apex/ContactController.getContactOwnerId';
//import setPrimaryRecruitmentFlow from '@salesforce/apex/ContactController.setPrimaryRecruitmentFlow';



export default class trackComponent extends LightningElement {
    @api recordId;
    trackingReason;
    trackReminderDate;
    primaryRecruiter;
    secondaryRecruiter;
    createdTrack = false;
    track;
    contactOwnerId;

    @wire(getRecord, { recordId: '$recordId', fields: ['Contact.Id', 'Contact.Recruitment_Flow__c'] })
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

            let fields = {
                'Contact__c': this.record.fields.Candidate__c.value,
                'Primary_Recruiter__c': this.record.fields.Primary_Recruiter__c.value,
                'Secondary_Recruiter__c': this.record.fields.Secondary_Recruiter__c.value,
                'Tracking_Reason__c': this.record.fields.Tracking_Reason__c.value,
                'Track_Reminder_Date__c': this.record.fields.Track_Reminder_Date__c.value
            };
            let recordInput = { apiName: 'Recruitment_Flow__c', fields };
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: null,
                    objectApiName: 'Recruitment_Flow__c',
                    actionName: 'edit'
                },
                state: {
                    defaultFieldValues: JSON.stringify(recordInput)
                }
            });
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
