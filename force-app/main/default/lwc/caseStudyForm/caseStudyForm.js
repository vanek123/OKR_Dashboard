import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCaseStudy from '@salesforce/apex/okrDashboardController.createCaseStudy';

export default class CaseStudyForm extends LightningElement {

    @api selectedUserId;
    caseStudyName;
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

    handleCaseStudyNameChange(event) {
        this.caseStudyName = event.target.value;
    }

    handleCaseStudyKRChange(event) {
        this.keyResultId = event.detail.recordId;
    }

    handleCaseStudyCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleCaseStudySave() {
        const caseStudyKRPicker = this.template.querySelector('[data-id="case-study-kr-picker"]');
        const caseStudyNameInput = this.template.querySelector('[data-id="case-study-name-input"]');

        caseStudyKRPicker.setCustomValidity('');
        caseStudyNameInput.setCustomValidity('');

        let isValid = true;

        if (!this.keyResultId) {
            caseStudyKRPicker.setCustomValidity('Please select a Key Result');
            isValid = false;
        }

        if (!this.caseStudyName || !this.caseStudyName.trim()) {
            caseStudyNameInput.setCustomValidity('Please enter a case study name.');
            isValid = false;
        }

        caseStudyKRPicker.reportValidity();
        caseStudyNameInput.reportValidity();

        if (!isValid) {
            return;
        }

        createCaseStudy({
            keyResultId: this.keyResultId,
            caseStudyName: this.caseStudyName
        }).then(() => {
            this.dispatchEvent(new CustomEvent('save', { bubbles: true }));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Failed to create Case Study',
                    variant: 'error'
                })
            );
        });
    }
    
}