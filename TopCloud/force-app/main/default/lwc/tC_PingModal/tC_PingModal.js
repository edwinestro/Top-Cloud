import { api, LightningElement, track, wire} from 'lwc';
import LightningModal from 'lightning/modal'; //Import the lightningmodal library
import {ShowToastEvent} from 'lightning/platformShowToastEvent'; //import method for toast events messages

//import { getRecord, updateRecord } from 'lightning/uiRecordApi'; //import method to get the record and update the record
//import { getObjectInfo } from 'lightning/uiObjectInfoApi'; //import method to get the object information

import PING_OBJECT from '@salesforce/schema/Ping__c';
import PINGREASON_FIELD from '@salesforce/schema/Ping__c.Pinging_Reason__c';
import REMINDERDATE_FIELD from '@salesforce/schema/Ping__c.Ping_Reminder_Date__c';
import PINGCHANNEL_FIELD from '@salesforce/schema/Ping__c.Ping_Channel__c';
import PRIMARYRECRUITER_FIELD from '@salesforce/schema/Ping__c.Primary_Recruiter__c';
import SECONDARYRECRUITER_FIELD from '@salesforce/schema/Ping__c.Secondary_Recruiter__c';
//import ACTIVEPING_FIELD from '@salesforce/schema/Ping__c.Active_Ping__c';

export default class tC_PingModal extends LightningModal {
    @api boolPing;  // Candidate without an active ping should be false, otherwise true
    @api content;
    @api objectApiName = PING_OBJECT;
    @track modalFields = [
        PINGREASON_FIELD,
        REMINDERDATE_FIELD,
        PINGCHANNEL_FIELD,
        PRIMARYRECRUITER_FIELD,
        SECONDARYRECRUITER_FIELD

    ];

    handleSuccess(){
        console.log("--->>>Record Id is: ->>> ", event.detail.id);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Ping creation',
                message: 'Ping created successfully',
                variant: 'success',
            })
        );
        
        this.close();
    }

    handleCancel() {
        this.close();
    }

}