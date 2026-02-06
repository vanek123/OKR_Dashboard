import { LightningElement, api } from 'lwc';
import createObjective from '@salesforce/apex/okrDashboardController.createObjective';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ObjectiveForm extends LightningElement {
    @api currentYear;
    @api selectedUserId;

    handleObjYearChange(event) {
        this.objectiveYear = event.detail.value;
    }

    handleObjNameChange(event) {
        this.objectiveName = event.detail.value;
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleSave() {
        const objNameInput = this.template.querySelector('[data-id="objective-name"]');
        const objYearInput = this.template.querySelector('[data-id="objective-year"]');

        objNameInput.setCustomValidity('');
        objYearInput.setCustomValidity('');

        let isValid = true;

        if (!this.objectiveName || !this.objectiveName.trim()) {
            objNameInput.setCustomValidity('Objective name is required');
            isValid = false;
        }

        if (!this.objectiveYear || this.objectiveYear < this.currentYear) {
            objYearInput.setCustomValidity('Please enter a valid year');
            isValid = false;
        }

        objNameInput.reportValidity();
        objYearInput.reportValidity();

        if (!isValid) {
            
            return;
        }

        createObjective({ 
            objectiveName: this.objectiveName, 
            year: this.objectiveYear,
            ownerId: this.selectedUserId})
        .then(() => {
            this.dispatchEvent(new CustomEvent('save', { bubbles: true}));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Failed to create objective',
                    variant: 'error'
                })
            )
        })
    }
}