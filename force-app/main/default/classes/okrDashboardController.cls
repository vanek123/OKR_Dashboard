public with sharing class okrDashboardController {

    @AuraEnabled(cacheable=true)
    public static List<Objective__c> getObjectives(Integer year, Id userId) {
        try {
            return [SELECT Id, Name, Year__c FROM Objective__c
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
    public static List<Key_Result__c> getKeyResults(Id objectiveId) {
        try {
            return [SELECT Id, Name, Objective__c FROM Key_Result__c
                    WHERE Objective__c =: objectiveId];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}