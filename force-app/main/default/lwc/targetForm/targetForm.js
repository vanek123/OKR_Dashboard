import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import KR_NAME from '@salesforce/schema/Key_Result__c.Name';

import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import TARGET_TYPE from '@salesforce/schema/Target__c.Type__c';
import TARGET_OBJECT from '@salesforce/schema/Target__c';
import CONTRACT_TYPE from '@salesforce/schema/Target__c.Contract_Type__c';

export default class TargetForm extends LightningElement {
    @api keyResultId;

    type;
    contractType;
    targetNumber;
    typeOptions = [];
    contractTypeOptions = [];

    keyResultName;

    @api targets;

    @wire(getObjectInfo, { objectApiName: TARGET_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: TARGET_TYPE
    })
    wiredTypePicklist({ data, error }) {
        if (data) {
            this.typeOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }))
        } else if (error) {
            console.error(error);
        }
    }

    handleTypeChange(event) {
        this.type = event.detail.value;
    }

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: CONTRACT_TYPE
    })
    wiredContractTypePicklist({ data, error }) {
        if (data) {
            this.contractTypeOptions = data.values.map(item => ({
                label: item.label,
                value: item.value
            }))
        } else if (error) {
            console.error(error);
        }
    }

    handleContractTypeChange(event) {
        this.contractType = event.detail.value
    }

    handleTargetNumberChange(event) {
        this.targetNumber = event.detail.value;
    }

    @wire(getRecord, {
        recordId: '$keyResultId',
        fields: [KR_NAME]
    })
    wiredKeyResult({ data, error }) {
        if (data) {
            this.keyResultName = data.fields.Name.value;
        } else if ( error ) {
            console.error(error);
        }
    }

    get isContract() {
        return this.type === 'Contracts';
    }

    handleCancel() {
        this.dispatchEvent(new CustomEvent('targetcancel'));
    }

    handleSave() {
        const typeInput = this.template.querySelector('lightning-combobox[data-id="type"]')
        const contractTypeInput = this.template.querySelector('lightning-combobox[data-id="contractType"]')
        const numberInput = this.template.querySelector('lightning-input[data-id="targetNumber"]')

        typeInput.setCustomValidity('');
        contractTypeInput?.setCustomValidity('');
        numberInput.setCustomValidity('');

        let isValid = true;

        if (!this.type) {
            typeInput.setCustomValidity('Please select a target type');
            isValid = false;
        }

        if (this.isContract && !this.contractType) {
            contractTypeInput.setCustomValidity('Please select a contract type');
            isValid = false;
        }
        
        if (!this.targetNumber) {
            numberInput.setCustomValidity('Please enter a target number');
            isValid = false;
        }

        if (this.isContract) {
            // Для контрактов: дубликат по Type + Contract_Type
            if (this.targets.some(t => t.Type__c === this.type && t.Contract_Type__c === this.contractType)) {
                contractTypeInput.setCustomValidity('A target with this contract type already exists for this Key Result');
                isValid = false;
            }
        } else {
            // Для остальных типов: дубликат по Type
            if (this.targets.some(t => t.Type__c === this.type)) {
                typeInput.setCustomValidity('A target of this type already exists for this Key Result');
                isValid = false;
            }
        }

        typeInput.reportValidity();
        contractTypeInput?.reportValidity();
        numberInput.reportValidity();

        if (!isValid) {
            return;
        }

        this.dispatchEvent(new CustomEvent('targetsave', {
            detail: {
                keyResultId: this.keyResultId,
                type: this.type,
                contractType: this.contractType,
                targetNumber: this.targetNumber
            },
            bubbles: true
        }));
    }
}