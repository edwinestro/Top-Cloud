public class RecruitmentFlowBatch implements Database.Batchable<SObject> {
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        // Query for Recruitment Flows with past due Ping Reminder Dates and Approved/Started Status
        String query = 'SELECT Id, Candidate__c, Potential_Company__c, Position__c, Status__c, ' +
                       '(SELECT Id FROM Pings__r WHERE Ping_Reminder_Date__c <= TODAY), ' +
                       '(SELECT Id, Candidate__r.Active_Recruitment_Flow_Status__c FROM Tracks__r), ' +
                       '(SELECT Id, Tag__r.Tagging_Reason__c, Tag__r.Tagged_Skills__c FROM Tag_Relationships__r) ' +
                       'FROM Recruitment_Flow__c ' +
                       'WHERE Status__c IN (\'Approved\', \'Started\') AND ' +
                       '    (SELECT COUNT() FROM Pings__r WHERE Ping_Reminder_Date__c <= TODAY) > 0';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext bc, List<sObject> records) {
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        for (sObject record : records) {
            Id candidateId = (Id)record.get('Candidate__c');
            Id potentialCompanyId = (Id)record.get('Potential_Company__c');
            List<Ping__c> pings = [SELECT Id, Ping_Reminder_Date__c FROM Ping__c WHERE Candidate__c = :candidateId];
            if (!pings.isEmpty()) {
                for (Ping__c ping : pings) {
                    if (ping.Ping_Reminder_Date__c <= Date.today()) {
                        // Create email message for past due Ping Reminder Date
                        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                        email.setToAddresses(new List<String>{String.valueOf(candidateId)});
                        email.setSubject('Reminder: Ping Reminder Date is past due');
                        
                        // Check for Tag matches
                        String tagInfo = checkTagMatches(potentialCompanyId);
                        if (!String.isEmpty(tagInfo)) {
                            email.setPlainTextBody('The following Tag matches were found:\n' + tagInfo + '\n');
                        }
                        
                        emails.add(email);
                    }
                }
            }
        }
        // Send all email messages
        Messaging.sendEmail(emails);
    }
    
    
    
    
    

    public void finish(Database.BatchableContext bc) {
        // Nothing to do here
    }
}