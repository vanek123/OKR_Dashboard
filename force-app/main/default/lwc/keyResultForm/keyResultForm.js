import { LightningElement, api } from 'lwc';
import NAME from '@salesforce/schema/Key_Result__c.Name';
import TARGET from '@salesforce/schema/Key_Result__c.Target__c';
import COMPLETED_TARGETS from '@salesforce/schema/Key_Result__c.Completed_Targets__c';
import OBJECTIVE_FIELD from '@salesforce/schema/Key_Result__c.Objective__c';

export default class KeyResultForm extends LightningElement {
    
    @api objectiveId; 
    
    keyResultFields = [OBJECTIVE_FIELD, NAME, TARGET, COMPLETED_TARGETS];
    keyResultRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}