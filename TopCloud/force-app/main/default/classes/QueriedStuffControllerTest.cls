@isTest
private class QueriedStuffControllerTest {

    @testSetup
    static void setup() {
        // Create a test user
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'testuser@test.com',
            Username = 'testuser@test.com',
            Alias = 'testuser',
            CommunityNickname = 'testuser',
            TimeZoneSidKey = 'America/Los_Angeles',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            ProfileId = UserInfo.getProfileId(),
            LanguageLocaleKey = 'en_US'
        );
        insert testUser;
        
        // Create test open positions with skills
        Position__c testPosition1 = new Position__c(
            Name = 'Test Position 1',
            Status__c = 'Open',
            Skills__c = 'Java;JavaScript;HTML'
        );
        insert testPosition1;
        
        Position__c testPosition2 = new Position__c(
            Name = 'Test Position 2',
            Status__c = 'Open',
            Skills__c = 'C++;Python;Ruby'
        );
        insert testPosition2;
        
        // Create test tags with matching and non-matching skills
        Tag__c testTag1 = new Tag__c(
            Name = 'Test Tag 1',
            Active__c = true,
            Candidate__c = testUser.Id,
            Tagged_Skills__c = 'Java;JavaScript'
        );
        insert testTag1;
        
        Tag__c testTag2 = new Tag__c(
            Name = 'Test Tag 2',
            Active__c = true,
            Candidate__c = testUser.Id,
            Tagged_Skills__c = 'C++;HTML'
        );
        insert testTag2;
        
        Tag__c testTag3 = new Tag__c(
            Name = 'Test Tag 3',
            Active__c = false,
            Candidate__c = testUser.Id,
            Tagged_Skills__c = 'Python;Ruby'
        );
        insert testTag3;
    }
@isTest
    static  void testMatchTags() {
        // Instantiate the controller
        QueriedStuffController controller = new QueriedStuffController();
        controller.recipient = [SELECT Id FROM User LIMIT 1].Id; // Get any user
        
        // Call the matchTags() method
        controller.matchTags();
        
        // Verify that only matching tags are retrieved
        System.assertEquals(2, controller.tags.size());
        System.assertEquals('Test Tag 1', controller.tags[0].Name);
        System.assertEquals('Test Tag 2', controller.tags[1].Name);
    }

}
