import { LightningElement } from 'lwc';
import NAME from '@salesforce/schema/Survey__c.Name';
import KEY_RESULT from '@salesforce/schema/Survey__c.Key_Result__c';

export default class SurveyForm extends LightningElement {
    surveyFields = [KEY_RESULT, NAME];
    surveyRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}