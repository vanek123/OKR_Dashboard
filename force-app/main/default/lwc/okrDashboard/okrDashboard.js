import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Name from '@salesforce/schema/User.Name';
import Id from '@salesforce/user/Id';
import OBJECTIVE_NAME_FIELD from '@salesforce/schema/Objective__c.Name';
import YEAR_FIELD from '@salesforce/schema/Objective__c.Year__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class OkrDashboard extends LightningElement {
  userName;
  selectedYear = '';
  selectedUser = '';
  showObjectiveForm = false;
  showKeyResultForm = false;
  value;

  @wire(getRecord, { recordId: Id, fields: [Name] })
  userDetails({ error, data}) {
    if (error) {
      this.error = error;
    } else if (data) {
      if (data.fields.Name.value != null) {
        this.userName = data.fields.Name.value;
      }
    }
  }

  creatingOptions = [
    {   
       
      label: "Objective",
      value: "objective",
      description: "Create new objective" 
    },
    {
      
      label: "Key result",
      value: "key result",
      description: "Create new key result",
    },
    {
      
      label: "Review",
      value: "review",
      description: "Create new review",
    },
    {
      
      label: "Survey",
      value: "survey",
      description: "Create new survey",
    },
    {
      
      label: "Case study",
      value: "case study",
      description: "Create new case study",
    },
    {
        
      label: "Google review",
      value: "google review",
      description: "Create new google review",
    }
  ];

  handleCreatingChange(event) {
    // Get the string of the "value" attribute on the selected option
    this.value = event.detail.value;

    if (this.value === "objective") {
      this.showObjectiveForm = true;
    }
    else if (this.value === "key result") {
      this.showKeyResultForm = true;
    }
    
  }

  // Creating objective (form)
  @api objectiveFields = [OBJECTIVE_NAME_FIELD, YEAR_FIELD];
  @api objectiveRecordId;
  
  
  handleSuccess(event) {
    this.showObjectiveForm = false;
    this.objectiveRecordId = null;
    this.value = '';

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleCancel() {
    this.showObjectiveForm = false;
    this.objectiveRecordId = null;
    this.value = '';
    
  }

  // Cancel button on key result form
  handleKeyResultCancel() {
    this.showKeyResultForm = false;
    this.value = undefined;
  }

  // Save button on key result form
  handleKeyResultSave() {
    this.showKeyResultForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);

  }
  
  
}
