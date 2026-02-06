import { LightningElement, api} from 'lwc';
import createKeyResult from '@salesforce/apex/okrDashboardController.createKeyResult';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class KeyResultForm extends LightningElement {
    
    @api selectedUserId;
    objectiveId; 
    keyResultName;

    get objectiveFilter() {

        if (!this.selectedUserId) {
            return null;
        }

        return {
            criteria: [
                {
                    fieldPath: 'OwnerId',
                    operator: 'eq',
                    value: this.selectedUserId
                },
            ]
        }
        
    }

    handleObjectiveChange(event) {
        this.objectiveId = event.detail.recordId;
    }

    handleKRNameChange(event) {
        this.keyResultName = event.target.value;
    }

    handleKRCancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    handleKRSave() {
        const krNameInput = this.template.querySelector('[data-id="kr-name-input"]');
        const objPicker = this.template.querySelector('[data-id="obj-picker"]');

        objPicker.setCustomValidity('');
        krNameInput.setCustomValidity('');

        let isValid = true;

        if (!this.objectiveId) {
            objPicker.setCustomValidity('Please select an objective');
            isValid = false;
        }

        if (!this.keyResultName || !this.keyResultName.trim()) {
            krNameInput.setCustomValidity('Please enter a key result name');
            isValid = false;
        }

        krNameInput.reportValidity();
        objPicker.reportValidity();

        if (!isValid) {
            return;
        }

        createKeyResult({
        objectiveId: this.objectiveId,
        keyResultName: this.keyResultName
        })
        .then(() => {
            this.dispatchEvent(new CustomEvent('save', { bubbles: true }));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body?.message || 'Failed to create Key Result',
                    variant: 'error'
                })
            );
        });

    }
}