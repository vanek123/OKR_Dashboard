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
    public static Integer getCallCountForKeyResult(Id krId, Date startDate, Date endDate) {
        try {
            return [SELECT COUNT() FROM Call__c
                    WHERE Key_Result__c =: krId
                    AND ActivityDate >=: startDate
                    AND ActivityDate <=: endDate];
        }
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}