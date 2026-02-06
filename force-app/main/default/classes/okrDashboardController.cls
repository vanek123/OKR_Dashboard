public with sharing class okrDashboardController {

    @AuraEnabled(cacheable=true)
    public static List<Objective__c> getObjectives(Integer year, Id userId) {
        try {
            return [SELECT Id, Name, Year__c, 
                    (SELECT Id, Name FROM Key_Results__r)
                    FROM Objective__c
                    WHERE Year__c =: year
                    AND OwnerId =: userId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<User> getUsers() {
        try {
            return [SELECT Id, Name FROM User];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Target__c> getTargets(Id keyResultId) {
        try {
            List<Target__c> targets = [
                    SELECT Id, 
                    Type__c, 
                    Target_Number__c, 
                    Current_Number__c,
                    Contract_Type__c
                    FROM Target__c
                    WHERE Key_Result__c =: keyResultId];

            for (Target__c t : targets) {
                Integer count = 0;

                switch on t.Type__c {
                when 'Calls' {
                    count = [SELECT COUNT() FROM Task
                            WHERE WhatId =: keyResultId
                            AND TaskSubtype = 'Call'];
                }
                when 'Events' {
                    count = [SELECT COUNT() FROM Event 
                            WHERE WhatId = :keyResultId];
                }
                when 'Contracts' {
                    count = [SELECT COUNT() FROM Contract
                            WHERE Key_Result__c = :keyResultId
                            AND Contract_Type__c = :t.Contract_Type__c]; 
                }
                when 'Leads' {
                    count = [SELECT COUNT() FROM Lead
                            WHERE LeadSource = 'Web'
                            AND Key_Result__c =: keyResultId];
                }
                when 'Surveys' {
                    count = [SELECT COUNT() FROM Survey__c
                            WHERE Key_Result__c = :keyResultId];
                }
                when 'Reviews' {
                    count = [SELECT COUNT() FROM Review__c
                            WHERE Key_Result__c = :keyResultId];
                }
                when 'Google Reviews' {
                    count = [SELECT COUNT() FROM Google_Review__c
                            WHERE Key_Result__c = :keyResultId];
                }
                when 'Case Studies' {
                    count = [SELECT COUNT() FROM Case_Study__c
                            WHERE Key_Result__c = :keyResultId];
                }
                when 'Opportunities' {
                    count = [SELECT COUNT() FROM Opportunity
                            WHERE Key_Result__c = :keyResultId];
                }
            }
            t.Current_Number__c = count;
        }
            return targets;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createTarget(Id keyResultId, 
    String type, String contractType, Integer targetNumber) {
        try {

            Target__c target = new Target__c(
                Key_Result__c = keyResultId,
                Type__c = type,
                Target_Number__c = targetNumber
            );

            if (type == 'Contracts') {
                target.Contract_Type__c = contractType;
            }
            insert target;
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

        } 
    }

    @AuraEnabled
    public static void createObjective(String objectiveName, Integer year, Id ownerId){
        try {

            List<Objective__c> existing = [
                SELECT Id
                FROM Objective__c
                WHERE Name = :objectiveName
                AND Year__c = :year
                LIMIT 1
            ];

            if (!existing.isEmpty()) {
                throw new AuraHandledException('An objective with this name already exists for this user and year.');
            }
            

            Objective__c objective = new Objective__c(
                Name = objectiveName,
                Year__c = year,
                OwnerId = ownerId
            );
            insert objective;
            
        } catch (AuraHandledException e) {
            throw e;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createKeyResult(Id objectiveId, String keyResultName){
        try {
            List<Key_Result__c> existing = [
                SELECT Id
                FROM Key_Result__c
                WHERE Name = :keyResultName
                AND Objective__c = :objectiveId
                LIMIT 1
            ];

            if (!existing.isEmpty()) {
                throw new AuraHandledException('A key result with this name already exists for this objective.');
            }

            Key_Result__c keyResult = new Key_Result__c(
                Objective__c = objectiveId,    
                Name = keyResultName 
            );
            insert keyResult;
            
        } catch (AuraHandledException e) {
            throw e;
        }  
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createReview(Id keyResultId, String reviewName){
        try {
            List<Review__c> existing = [
                SELECT Id
                FROM Review__c
                WHERE Name = :reviewName
                AND Key_Result__c = :keyResultId
                LIMIT 1
            ];

            if (!existing.isEmpty()) {
                throw new AuraHandledException('A key result with this name already exists for this objective.');
            }

            Review__c review = new Review__c(
                Key_Result__c = keyResultId,    
                Name = reviewName 
            );
            insert review;
            
        } 
        catch (AuraHandledException e) {
            throw e;
        }  
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createSurvey(Id keyResultId, String surveyName){
        try {
            List<Survey__c> existing = [
                SELECT Id
                FROM Survey__c
                WHERE Name = :surveyName
                AND Key_Result__c = :keyResultId
                LIMIT 1
            ];

            if (!existing.isEmpty()) {
                throw new AuraHandledException('A key result with this name already exists for this objective.');
            }

            Survey__c survey = new Survey__c(
                Key_Result__c = keyResultId,    
                Name = surveyName 
            );
            insert survey;
        } 
        catch (AuraHandledException e) {
            throw e;
        }  
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createCaseStudy(Id keyResultId, String caseStudyName){
        try {
            List<Case_Study__c> existing = [
                SELECT Id
                FROM Case_Study__c
                WHERE Name = :caseStudyName
                AND Key_Result__c = :keyResultId
                LIMIT 1
            ];

            if (!existing.isEmpty()) {
                throw new AuraHandledException('A key result with this name already exists for this objective.');
            }

            Case_Study__c caseStudy = new Case_Study__c(
                Key_Result__c = keyResultId,    
                Name = caseStudyName 
            );
            insert caseStudy;
        } catch (AuraHandledException e) {
            throw e;
        }  
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createGoogleReview(Id keyResultId, String googleReviewName){
        try {
            List<Google_Review__c> existing = [
                SELECT Id
                FROM Google_Review__c
                WHERE Name = :googleReviewName
                AND Key_Result__c = :keyResultId
                LIMIT 1
            ];

            if (!existing.isEmpty()) {
                throw new AuraHandledException('A key result with this name already exists for this objective.');
            }

            Google_Review__c googleReview = new Google_Review__c(
                Key_Result__c = keyResultId,    
                Name = googleReviewName 
            );
            insert googleReview;
        } 
        catch (AuraHandledException e) {
            throw e;
        }  
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}