public with sharing class ContactController2 {
    @AuraEnabled
    public static Id getContactOwnerId(Id contactId){
        try {
            Contact c = [SELECT OwnerId FROM Contact WHERE Id = :contactId];
            return c.OwnerId;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}