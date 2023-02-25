public class BatchClassEd implements Database.Batchable<sObject>, Database.stateful{
    public integer recordCount = 0;

    //Start Method

    public Database.QueryLocator start (Database.BatchableContext bc){  //retrieve Id and Name from Contact at the beginning
        return Database.getQueryLocator([
            SELECT Id, Name, UserRoleId, Email
            FROM User
            WHERE UserRole.Name = 'Recruiter'
        ]);
    }

    //EXECUTE Method
    public void execute(Database.BatchableContext bc, List<User> userList){
        
        List<Ping__c> activePings = new List<Ping__c>();
        activePings = [
            SELECT Id, Name, Active_Ping__c, Primary_Recruiter__c 
            FROM Ping__c
            WHERE Active_Ping__c = true
        ];
        system.debug('Lista de pings activos ' + activePings);

        /*Set<Id> userIdsSet = new Set<Id>(); //set que recupera los Ids de user
        for(User currentUser : userList){
            userIdsSet.add(currentUser.id);
        }
        system.debug('El set de Ids tiene: ' + userIdsSet);*/
        
        //----------------------------SEND EMAIL------------------------------------
        EmailTemplate emailtemp = [
            SELECT Id, Subject, Body, DeveloperName
            FROM EmailTemplate
            WHERE DeveloperName = 'Reminder_Email_2'
        ];
        system.debug('This is the template for Reminders: '+emailtemp);

        for(User usr : userList){
            Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
            string [] toaddress= New string[]{'jhernandezg93@gmail.com'}; //insertar lista de User Email address
            message.setTemplateId(emailtemp.id);
            message.setTargetObjectId(usr.id);
            //message.setSubject('Hey, your reminders are here:'); 
            //message.setPlainTextBody('This is an Email test'); // Insertar el template básico-
            message.setToAddresses(toaddress);
            message.setSaveAsActivity(false);
            Messaging.sendEmail(New Messaging.SingleEmailMessage[]{message});
            system.debug('The email was sent -> '+emailtemp.body);
        }
    }

    public void finish(Database.BatchableContext bc){
        //----------------------------------------------Email template definition
        
        
    }
}