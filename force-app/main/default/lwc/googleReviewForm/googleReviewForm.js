import { LightningElement, api } from 'lwc';
import createGoogleReview from '@salesforce/apex/okrDashboardController.createGoogleReview';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class GoogleReviewForm extends LightningElement {
    
    @api selectedUserId;
    googleReviewName;
    keyResultId;

    get keyResultFilter() {

        if (!this.selectedUserId) {
            return null;
        }

        return {
            criteria: [
                {
                    fieldPath: 'Objective__r.OwnerId',
                    operator: 'eq',
                    value: this.selectedUserId
                },
            ]
        }
        
    }

    handleGoogleReviewKRChange(event) {
        this.keyResultId = event.detail.recordId;
    }

    handleGoogleReviewNameChange(event) {
        this.googleReviewName = event.target.value;
    }

    handleGoogleReviewCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleGoogleReviewSave() {
        const googleReviewKRPicker = this.template.querySelector('[data-id="google-review-kr-picker"]');
        const googleReviewNameInput = this.template.querySelector('[data-id="google-review-name-input"]');

        googleReviewKRPicker.setCustomValidity('');
        googleReviewNameInput.setCustomValidity('');

        let isValid = true;

        if (!this.keyResultId) {
            googleReviewKRPicker.setCustomValidity('Please select a Key Result');
            isValid = false;
        }

        if (!this.googleReviewName || !this.googleReviewName.trim()) {
            googleReviewNameInput.setCustomValidity('Please enter a Google Review name.');
            isValid = false;
        }

        googleReviewKRPicker.reportValidity();
        googleReviewNameInput.reportValidity();

        if (!isValid) {
            return;
        }

        createGoogleReview({
            keyResultId: this.keyResultId,
            reviewName: this.reviewName
        }).then(() => {
            this.dispatchEvent(new CustomEvent('save', { bubbles: true }));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Failed to create Google Review',
                    variant: 'error'
                })
            );
        });
        
    }
}