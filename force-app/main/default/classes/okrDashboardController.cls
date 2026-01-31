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
            return [SELECT Id, Type__c, Target_Number__c
                    FROM Target__c
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Calls for a target
    @AuraEnabled(cacheable=true)
    public static Integer getCallCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Task
                    WHERE Key_Result__c =: keyResultId
                    AND TaskSubtype = 'Call'];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Events for a target
    @AuraEnabled(cacheable=true)
    public static Integer getEventCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Event
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Opportunities for a target
    @AuraEnabled(cacheable=true)
    public static Integer getOpportunityCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Opportunity
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Leads(only from web) for a target
    @AuraEnabled(cacheable=true)
    public static Integer getLeadCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Lead
                    WHERE LeadSource = 'Web'
                    AND Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    
    }

    // Count of Surveys for a target
    public static Integer getSurveyCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Survey__c
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Reviews for a target
    public static Integer getReviewCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Review__c
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Google Reviews for a target
    public static Integer getGoogleReviewCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Google_Review__c
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Case Studies for a target
    public static Integer getCaseStudiesCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Case_Study__c
                    WHERE Key_Result__c =: keyResultId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    // Count of Contracts for a target
    public static Integer getContractCountForKeyResult(Id keyResultId) {
        try {
            return [SELECT COUNT() FROM Contract
                    WHERE Key_Result__c =: keyResultId];
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
}