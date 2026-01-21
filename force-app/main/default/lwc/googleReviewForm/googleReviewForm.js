import { LightningElement } from 'lwc';
import NAME from '@salesforce/schema/Google_Review__c.Name';
import KEY_RESULT from '@salesforce/schema/Google_Review__c.Key_Result__c';

export default class GoogleReviewForm extends LightningElement {
    googleReviewFields = [KEY_RESULT, NAME];
    googleReviewRecordId;

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSuccess() {
        this.dispatchEvent(new CustomEvent('save'));
    }
}