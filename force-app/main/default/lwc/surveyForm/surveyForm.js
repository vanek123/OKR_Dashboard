import { LightningElement, api } from 'lwc';
import createSurvey from '@salesforce/apex/okrDashboardController.createSurvey';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SurveyForm extends LightningElement {
    
    @api selectedUserId;
    keyResultId;
    surveyName;

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

    handleSurveyKRChange(event) {
        this.keyResultId = event.detail.recordId;
    }

    handleSurveyNameChange(event) {
        this.surveyName = event.target.value;
    }

    handleSurveyCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSurveySave() {
        const surveyKRPicker = this.template.querySelector('[data-id="survey-kr-picker"]');
        const surveyNameInput = this.template.querySelector('[data-id="survey-name-input"]');

        surveyKRPicker.setCustomValidity('');
        surveyNameInput.setCustomValidity('');

        let isValid = true;

        if (!this.keyResultId) {
            surveyKRPicker.setCustomValidity('Please select a key result.');
            isValid = false;
        }

        if (!this.surveyName || !this.surveyName.trim()) {
            surveyNameInput.setCustomValidity('Please enter a survey name.');
            isValid = false;
        }

        surveyKRPicker.reportValidity();
        surveyNameInput.reportValidity();

        if(!isValid) {
            return;
        }

        createSurvey({
            keyResultId: this.keyResultId,
            surveyName: this.reviewName
        }).then(() => {
            this.dispatchEvent(new CustomEvent('save', { bubbles: true }));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Failed to create Survey',
                    variant: 'error'
                })
            );
        });
    }
}