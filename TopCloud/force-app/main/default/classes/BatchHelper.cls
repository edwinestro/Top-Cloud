public with sharing class BatchHelper {

    
    public static String checkTagMatches(Id userId) {
        // Get all active tags owned by the user
        List<Tag__c> activeTags = [SELECT Id, Tagged_Skills__c, Candidate__c, Name FROM Tag__c WHERE Active__c = true AND OwnerId = :userId];
        
        Set<String> openPositionSkills = new Set<String>();
        // Get all open positions for the user's company and their skills
        List<Position__c> openPositions = [SELECT Skills__c FROM Position__c WHERE Status__c = 'Open'];
        for (Position__c openPosition : openPositions) {
            openPositionSkills.addAll(new Set<String>(openPosition.Skills__c.split(';')));
        }
        
        List<String> matchingTags = new List<String>();
        // Loop through each active tag
        for (Tag__c tag : activeTags) {
            Set<String> tagSkills = new Set<String>(tag.Tagged_Skills__c.split(';'));
            // Check if at least one of the tag's skills match any of the open positions' skills
            for (String skill : tagSkills) {
                if (openPositionSkills.contains(skill)) {
                    matchingTags.add(tag.Name);
                    break;
                }
            }
        }
        
        if (matchingTags.isEmpty()) {
            return '';
        } else {
            return 'The following Tag matches were found:\n' + String.join(matchingTags, ', ') + '\n';
        }
    }
}
