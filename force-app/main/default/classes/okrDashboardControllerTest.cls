/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class okrDashboardControllerTest {

    @testSetup
    static void setupData(){
        Objective__c obj = new Objective__c(
            Name = 'Test Objective',
            Year__c = 2026,
            OwnerId = UserInfo.getUserId()
        );
        insert obj;

        Key_Result__c keyResult = new Key_Result__c(
            Name = 'Test Key Result',
            Objective__c = obj.Id
        );
        insert keyResult;
    }

    // Helper method to get objective
    private static Objective__c getObj() {
        return [SELECT Id, Name FROM Objective__c LIMIT 1];
    }

    // Helper method to get key result
    private static Key_Result__c getKR() {
        return [SELECT Id, Name, Objective__c FROM Key_Result__c LIMIT 1];
    }

    // getObjectives test method
    @isTest
    static void getObjectivesTest() {

        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();
        User user = [SELECT Id FROM User WHERE Id =:UserInfo.getUserId() LIMIT 1];     

        Test.startTest();
        List<Objective__c> objectives = okrDashboardController.getObjectives(2026, user.Id);
        Test.stopTest();

        System.assertEquals(1, objectives.size());
        System.assertEquals(2026, objectives[0].Year__c);
        System.assertEquals('Test Objective', objectives[0].Name);

        System.assertNotEquals(null, objectives[0].Key_Results__r, 'Key Result subqery should not be null');
        System.assertEquals(1, objectives[0].Key_Results__r.size(), 'Key Result subqery should have 1 result');
        System.assertEquals('Test Key Result', objectives[0].Key_Results__r[0].Name);
    }

    // getUsers test
    @isTest
    static void getUsersTest() {
        Set<Id> expectedIds = new Set<Id>();

        for (User u : [SELECT Id FROM User]) {
            expectedIds.add(u.Id);
        }

        Test.startTest();
        List<User> actual = okrDashboardController.getUsers();
        Test.stopTest();

        // Build actual set
        Set<Id> actualIds = new Set<Id>();
        for (User u : actual) {
            actualIds.add(u.Id);
            // Optional field sanity check
            System.assertNotEquals(null, u.Name, 'Name should be populated');
        }

        // Assert same counts and same membership
        System.assertEquals(expectedIds.size(), actualIds.size(), 'Sizes should match (all users returned)');
        System.assertEquals(expectedIds, actualIds, 'Returned set of users should match all visible users');

    }

    // TARGET creation tests
    @isTest
    static void createTargetTest() {

        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Key_Result__c keyResult2 = new Key_Result__c(
            Name = 'Test Key Result 2',
            Objective__c = obj.Id
        );

        insert keyResult2;

        Test.startTest();
        okrDashboardController.createTarget(keyResult.Id, 'Contracts', 'New', 100);
        okrDashboardController.createTarget(keyResult2.Id, 'Surveys', null, 5);
        Test.stopTest();

        List<Target__c> targets = [SELECT Id, 
                                   Key_Result__c, 
                                   Type__c, 
                                   Contract_Type__c, 
                                   Target_Number__c 
                                   FROM Target__c];

        System.assertEquals(2, targets.size());

        for (Target__c t : targets) {
            if (t.Key_Result__c == keyResult.Id) {
                System.assertEquals('Contracts', t.Type__c);
                System.assertEquals('New', t.Contract_Type__c);
                System.assertEquals(100, t.Target_Number__c);

            } else if (t.Key_Result__c == keyResult2.Id) {
                System.assertEquals('Surveys', t.Type__c);
                System.assertEquals(5, t.Target_Number__c);
                System.assertEquals(null, t.Contract_Type__c);
            } else {
                System.Assert.isTrue(false, 'Unexpected key result id: ' + t.Key_Result__c);
            }

        }

    }

    // Objective creation tests
    @isTest
    static void createObjectiveTest() {


        Test.startTest();
        okrDashboardController.createObjective('Test Objective', 2027, UserInfo.getUserId());
        Test.stopTest();

        List<Objective__c> objectives = [SELECT Id, Name, Year__c FROM Objective__c WHERE Year__c = 2027 AND OwnerId = :UserInfo.getUserId()];

        System.assertEquals(1, objectives.size());
        System.assertEquals('Test Objective', objectives[0].Name);
        System.assertEquals(2027, objectives[0].Year__c);

    }

    @isTest
    static void createObjectiveExistsTest() {
        Objective__c obj = getObj();

        Boolean exceptionThrown = false;

        Test.startTest();
        try {
            okrDashboardController.createObjective('Test Objective', 2026, UserInfo.getUserId());
        } catch (AuraHandledException e) {
            exceptionThrown = true;
        }
        Test.stopTest();

        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown');

        List<Objective__c> objectives = [
            SELECT Id, Name, Year__c 
            FROM Objective__c 
            WHERE Year__c = 2026 AND OwnerId = :UserInfo.getUserId()
        ];
        System.assertEquals(1, objectives.size());
    }

    // Key Result creation tests
    @isTest
    static void createKeyResultTest() {
        Objective__c obj = getObj();

        Test.startTest();
        okrDashboardController.createKeyResult(obj.Id, 'Test Key Result 2');
        Test.stopTest();

        List<Key_Result__c> keyResults = [
            SELECT Id, Name 
            FROM Key_Result__c 
            WHERE Objective__c = :obj.Id
        ];

        System.assertEquals(2, keyResults.size());
        System.assertEquals('Test Key Result 2', keyResults[1].Name);

    }

    @isTest
    static void createKeyResultDuplicateTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Boolean exceptionThrown = false;

        Test.startTest();
        try {
            okrDashboardController.createKeyResult(obj.Id, 'Test Key Result');
        } catch (AuraHandledException e) {
            exceptionThrown = true;
        }
        Test.stopTest();

        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown');

        List<Key_Result__c> keyResults = [
            SELECT Id, Name 
            FROM Key_Result__c 
            WHERE Objective__c = :obj.Id
        ];

        System.assertEquals(1, keyResults.size());

    }

    // Review creation tests
    @isTest
    static void createReviewTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Test.startTest();
        okrDashboardController.createReview(keyResult.Id, 'Test Review');
        Test.stopTest();

        List<Review__c> reviews = [
            SELECT Id, Name 
            FROM Review__c 
            WHERE Key_Result__c = :keyResult.Id
        ];

        System.assertEquals(1, reviews.size());
        System.assertEquals('Test Review', reviews[0].Name);
    }

    @isTest
    static void createReviewDuplicateTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Review__c review = new Review__c(
            Key_Result__c = keyResult.Id,
            Name = 'Test Review'
        );
        insert review;

        Boolean exceptionThrown = false;

        Test.startTest();
        try {
            okrDashboardController.createReview(keyResult.Id, 'Test Review');
        }
        catch(AuraHandledException e) {
            exceptionThrown = true;
        }
        
        Test.stopTest();

        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown');

        List<Review__c> reviews = [
            SELECT Id, Name 
            FROM Review__c 
            WHERE Key_Result__c = :keyResult.Id
        ];

        System.assertEquals(1, reviews.size());

    }

    // Survey creation tests
    @isTest
    static void createSurveyTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Test.startTest();
        okrDashboardController.createSurvey(keyResult.Id, 'Test Survey');
        Test.stopTest();

        List<Survey__c> surveys = [
            SELECT Id, Name 
            FROM Survey__c 
            WHERE Key_Result__c = :keyResult.Id
            ];

        System.assertEquals(1, surveys.size());
        System.assertEquals('Test Survey', surveys[0].Name);

    }

    @isTest
    static void createSurveyDuplicateTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Survey__c survey = new Survey__c(
            Key_Result__c = keyResult.Id,
            Name = 'Test Survey'
        );
        insert survey;

        Boolean exceptionThrown = false;

        Test.startTest();
        try {
            okrDashboardController.createSurvey(keyResult.Id, 'Test Survey');
        } catch (AuraHandledException e) {
            exceptionThrown = true;
        }
        Test.stopTest();

        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown');

        List<Survey__c> surveys = [SELECT Id, Name FROM Survey__c WHERE Key_Result__c = :keyResult.Id];

        System.assertEquals(1, surveys.size());

    }

    // Case Study creation tests
    @isTest
    static void createCaseStudyTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Test.startTest();
        okrDashboardController.createCaseStudy(keyResult.Id, 'Test Case Study');
        Test.stopTest();

        List<Case_Study__c> caseStudies = [SELECT Id, Name FROM Case_Study__c WHERE Key_Result__c = :keyResult.Id];

        System.assertEquals(1, caseStudies.size());
        System.assertEquals('Test Case Study', caseStudies[0].Name);

    }

    @isTest
    static void createCaseStudyDuplicateTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Case_Study__c caseStudy = new Case_Study__c(
            Key_Result__c = keyResult.Id,
            Name = 'Test Case Study'
        );
        insert caseStudy;

        Boolean exceptionThrown = false;

        Test.startTest();
        try {
            okrDashboardController.createCaseStudy(keyResult.Id, 'Test Case Study');
        } catch (AuraHandledException e) {
            exceptionThrown = true;
        }
        Test.stopTest();

        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown');

        List<Case_Study__c> caseStudies = [SELECT Id, Name FROM Case_Study__c WHERE Key_Result__c = :keyResult.Id];

        System.assertEquals(1, caseStudies.size());
    }

    // Google Review creation tests
    @isTest
    static void createGoogleReviewTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Test.startTest();
        okrDashboardController.createGoogleReview(keyResult.Id, 'Test Google Review');
        Test.stopTest();

        List<Google_Review__c> googleReviews = [SELECT Id, Name FROM Google_Review__c WHERE Key_Result__c = :keyResult.Id];

        System.assertEquals(1, googleReviews.size());
        System.assertEquals('Test Google Review', googleReviews[0].Name);
    }

    @isTest
    static void createGoogleReviewDuplicateTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        Google_Review__c googleReview = new Google_Review__c(
            Key_Result__c = keyResult.Id,
            Name = 'Test Google Review'
        );
        insert googleReview;

        Boolean exceptionThrown = false;

        Test.startTest();
        try {
            okrDashboardController.createGoogleReview(keyResult.Id, 'Test Google Review');
        } catch (AuraHandledException e) {
            exceptionThrown = true;
        }
        Test.stopTest();

        System.assert(exceptionThrown, 'Expected AuraHandledException to be thrown');

        List<Google_Review__c> googleReviews = [SELECT Id, Name FROM Google_Review__c WHERE Key_Result__c = :keyResult.Id];

        System.assertEquals(1, googleReviews.size());
    }

    // Test for getting targets
    @isTest
    static void getTargetsTest() {
        Objective__c obj = getObj();
        Key_Result__c keyResult = getKR();

        // Targets
        List<Target__c> targets = new List<Target__c>{
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Calls', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Events', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Contracts', Contract_Type__c = 'New', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Web Leads', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Reviews', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Google Reviews', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Case Studies', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Opportunities', Target_Number__c = 5),
            new Target__c(Key_Result__c = keyResult.Id, Type__c = 'Surveys', Target_Number__c = 5)
        };
        insert targets;

        // Calls
        insert new Task(
            WhatId = keyResult.Id,
            Subject = 'Call test',
            TaskSubtype = 'Call'
        );

        // Events
        insert new Event(
            WhatId = keyResult.Id,
            Subject = 'Event test',
            StartDateTime = System.now(),
            EndDateTime = System.now().addHours(1)
        );

        Account acc = new Account(
            Name = 'Test Account'
        );
        insert acc;

        // Contracts
        insert new Contract(
            Key_Result__c = keyResult.Id,
            Contract_Type__c = 'New',
            AccountId = acc.Id,
            Status = 'Draft',
            StartDate = Date.today()
        );

        // Leads
        insert new Lead(
            LastName = 'Test',
            Company = 'Test',
            LeadSource = 'Web',
            Key_Result__c = keyResult.Id
        );

        // Reviews
        insert new Review__c(
            Name = 'Review test',
            Key_Result__c = keyResult.Id
        );

        // Google Reviews
        insert new Google_Review__c(
            Name = 'Google review test',
            Key_Result__c = keyResult.Id
        );

        // Case Studies
        insert new Case_Study__c(
            Name = 'Case study test',
            Key_Result__c = keyResult.Id
        );

        // Opportunities
        insert new Opportunity(
            Name = 'Opp test',
            StageName = 'Prospecting',
            CloseDate = Date.today(),
            Key_Result__c = keyResult.Id
        );

        insert new Survey__c(
            Name='Survey test',
            Key_Result__c = keyResult.Id
        );

        Test.startTest();
        List<Target__c> result = okrDashboardController.getTargets(keyResult.Id);
        Test.stopTest();

        System.assertEquals(9, result.size());

        for (Target__c t : result) {
            System.assertEquals(1, t.Current_Number__c);
        }
    }
}