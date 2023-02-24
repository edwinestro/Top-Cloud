public class BatchClass implements Database.Batchable<sObject>, Database.stateful{
    public integer recordCount = 0;

    //Start Method

    public Database.QueryLocator start (Database.BatchableContext bc){  //retrieve Id and Name from Contact at the beginning
        return Database.getQueryLocator([
            SELECT Id, Name, Owner.Name
            FROM Contact
            WHERE Id = '003Dn00000Ci1V0IAJ'

            Limit 1
        ]);
    }

    //EXECUTE Method
    public void execute(Database.BatchableContext bc, List<Contact> candidates){
        for(Contact cand : candidates){
            cand.Description = 'The batch works';
            cand.Skills__c = 'Agile';
        }
        update candidates;
        recordCount = recordCount + candidates.size();

       
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        string [] toaddress= New string[]{'jhernandezg93@gmail.com'};
        email.setSubject('Testing Apex Scheduler-Subject');
        email.setPlainTextBody('Testing Apex Scheduler-Body');
        email.setToAddresses(toaddress);
        Messaging.sendEmail(New Messaging.SingleEmailMessage[]{email});

    }

    public void finish(Database.BatchableContext bc){
        System.debug('Total records processed: '+ recordCount);
    }
}