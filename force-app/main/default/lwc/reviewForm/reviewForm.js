import { LightningElement, api } from 'lwc';
import createReview from '@salesforce/apex/okrDashboardController.createReview';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReviewForm extends LightningElement {
    chosenKeyResult;
    reviewName;
    @api selectedUserId;

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

    handleReviewKRChange(event) {
        this.chosenKeyResult = event.detail.recordId;
    }

    handleReviewNameChange(event) {
        this.reviewName = event.target.value;
    }

    handleReviewCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleReviewSave() {
        const reviewKRPicker = this.template.querySelector('[data-id="review-kr-picker"]');
        const reviewNameInput = this.template.querySelector('[data-id="review-name-input"]');

        reviewKRPicker.setCustomValidity('');
        reviewNameInput.setCustomValidity('');

        let isValid = true;

        if (!this.chosenKeyResult) {
            reviewKRPicker.setCustomValidity('Please select a key result.');
            isValid = false;
        }

        if (!this.reviewName || !this.reviewName.trim()) {
            reviewNameInput.setCustomValidity('Please enter a review name.');
            isValid = false;
        }

        reviewKRPicker.reportValidity();
        reviewNameInput.reportValidity();

        if (!isValid) {
            return;
        }

        createReview({
            keyResultId: this.chosenKeyResult,
            reviewName: this.reviewName
        }).then(() => {
            this.dispatchEvent(new CustomEvent('save', { bubbles: true }));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Failed to create Review',
                    variant: 'error'
                })
            );
        });
    }
}