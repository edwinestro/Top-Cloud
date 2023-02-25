public class QueriedStuffController {
    public Id recipient { get; set; }
    public List<Tag__c> tags {get; set; }

    public QueriedStuffController() {
        matchTags();
        System.debug(tags);
    }
        //Method to match Tagged skills with Open position's skills

    public void matchTags(){
        
        
        
         System.debug('yeez, method start');
             // Get all active tags owned by the 
             List<Tag__c> activeTags = [SELECT Id, Tagged_Skills__c, Candidate__c, Name FROM Tag__c WHERE Active__c = true AND OwnerId=:recipient];
         	Set<String> openPositionSkills = new Set<String>();
    // Get all open positions for the user's company and their skills
    List<Position__c> openPositions = [SELECT Skills__c FROM Position__c WHERE Status__c = 'Open'];
    for (Position__c openPosition : openPositions) {
        openPositionSkills.addAll(new Set<String>(openPosition.Skills__c.split(';')));
    }
    
    List<Tag__c> matchingTags = new List<Tag__c>();
    // Loop through each active tag
    for (Tag__c tag : activeTags) {
        Set<String> tagSkills = new Set<String>(tag.Tagged_Skills__c.split(';'));
        // Check if at least one of the tag's skills match any of the open positions' skills
        for (String skill : tagSkills) {
            if (openPositionSkills.contains(skill)) {
                matchingTags.add(tag);
                break;
            }
        }
    }
         tags = matchingTags;
                  System.debug('yeez, method end');

     
       
    }
    
    
    
    
    
    
}