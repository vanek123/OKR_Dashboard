import { LightningElement } from 'lwc';
import NAME from '@salesforce/schema/Case_Study__c.Name';
import KEY_RESULT from '@salesforce/schema/Case_Study__c.Key_Result__c';

export default class CaseStudyForm extends LightningElement {
    caseStudyFields = [KEY_RESULT, NAME];
    caseStudyRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
    
}