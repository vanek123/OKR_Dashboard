import { LightningElement } from 'lwc';
import NAME from '@salesforce/schema/Objective__c.Name';
import YEAR from '@salesforce/schema/Objective__c.Year__c';

export default class ObjectiveForm extends LightningElement {
    objectiveFields = [NAME, YEAR];
    objectiveRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}