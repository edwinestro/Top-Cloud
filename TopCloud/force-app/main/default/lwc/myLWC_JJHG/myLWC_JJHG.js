import { api, LightningElement, track } from 'lwc';

//Import Ping Object and fields
import PING_OBJECT from '@salesforce/schema/Ping__c';
import ID_PING from '@salesforce/schema/Ping__c.Id';
import NAME_FIELD from '@salesforce/schema/Ping__c.Name';
import REMINDERDATE_FIELD from '@salesforce/schema/Ping__c.Ping_Reminder_Date__c';

//import Lightning MOdal
import tC_PingModal from 'c/tC_PingModal';  //Import the Modal to the main LWC

export default class RecordViewFormStaticContact extends LightningElement {    
   
    @api objectApiName = PING_OBJECT;
    @track fields = [ID_PING, NAME_FIELD, REMINDERDATE_FIELD];
    @api recordId;

    @api boolTrack; //True when a Track is being displayed
    @api boolTag;   //True when a Tag is being displayed
    @api boolPing;  // Candidate without active ping should be false, otherwise true
    @api boolActivePing;

    showModal = true;
    result;

    async handleClickPing(){  //This button triggers the Ping Reminder guided flow
        const result = await tC_PingModal.open({
            size: 'small',
            description: 'Description of my first modal',
            content: 'passed into content API',
        });
        
        let boolPing = 1;
        console.log("--->>>BoolPing is: ->>> ", boolPing);       
        let boolActivePing = 1; 
        console.log("--->>>BoolActivePing is: ->>> ", boolActivePing);
    }   
}