import { LightningElement } from 'lwc';
import NAME from '@salesforce/schema/Review__c.Name';
import KEY_RESULT from '@salesforce/schema/Review__c.Key_Result__c';

export default class ReviewForm extends LightningElement {
    reviewFields = [KEY_RESULT, NAME];
    reviewRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}