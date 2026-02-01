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
            List<Target__c> targets = [SELECT Id, Type__c, Target_Number__c, Current_Number__c
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

}