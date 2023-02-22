import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OWNER_FIELD from '@salesforce/schema/Contact.OwnerId';
import PRIMARY_RECRUITER_FIELD from '@salesforce/schema/Track__c.Primary_Recruiter__c';

export default class ContactForm extends LightningElement {
    @api recordId;

    primaryRecruiter;

    @wire(getRecord, { recordId: '$recordId', fields: [CONTACT_OWNER_FIELD] })
    contact;

    connectedCallback() {
        this.primaryRecruiter = this.contact ? getFieldValue(this.contact.data, CONTACT_OWNER_FIELD) : null;
    }

    handlePrimaryRecruiterChange(event) {
        this.primaryRecruiter = event.target.value;
        this.updatePrimaryRecruiter();
    }

    updatePrimaryRecruiter() {
        const fields = {};
        fields[PRIMARY_RECRUITER_FIELD.fieldApiName] = this.primaryRecruiter;
    
        const recordInput = { fields, id: this.recordId }; // add the record ID here
        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    
}
