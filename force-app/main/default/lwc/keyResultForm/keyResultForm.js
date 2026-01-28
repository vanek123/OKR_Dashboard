import { LightningElement, api } from 'lwc';
import NAME from '@salesforce/schema/Key_Result__c.Name';
import OBJECTIVE_FIELD from '@salesforce/schema/Key_Result__c.Objective__c';

export default class KeyResultForm extends LightningElement {
    
    @api objectiveId; 
    
    keyResultFields = [OBJECTIVE_FIELD, NAME];
    keyResultRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}