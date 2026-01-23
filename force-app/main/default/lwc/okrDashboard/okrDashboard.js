import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Name from '@salesforce/schema/User.Name';
import Id from '@salesforce/user/Id';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import GET_OBJECTIVES from '@salesforce/apex/okrDashboardController.getObjectives';
import GET_USERS from '@salesforce/apex/okrDashboardController.getUsers';

export default class OkrDashboard extends LightningElement {
  userName;
  showObjectiveForm = false;
  objectives = [];
  showKeyResultForm = false;
  showReviewForm = false;
  showSurveyForm = false;
  showCaseStudyForm = false;
  showGoogleReviewForm = false;
  showObjectiveItself = false;
  value;
  chosenYearForTheUser;
  yearValue;
  yearOptions = [];
  userValue;

  @track userData;
  @track userOptions = [];
  @track selectedUser;

  connectedCallback() {
    for (let i = this.currentYear - 3; i <= this.currentYear + 3; i++) {
      this.yearOptions.push({ label: i.toString(), value: i.toString() }); 
    }

    this.userValue = Id;
    
    this.yearValue = this.currentYear.toString();
    this.chosenYearForTheUser = this.currentYear.toString();
    this.selectedUser = { Id: Id, Name: this.userName };
    this.getObjectives(); 
  }

  // Get all users from apex controller 
  // and pass them into the combobox 
  @wire (GET_USERS)
  wiredUsers({ error, data }) {
    if (data) {
      this.userData = data;
      this.userOptions = data.map((user) => ({
        label: user.Name,
        value: user.Id,
      }));
    } else if (error) {
      this.error = error;
      console.error('Error fetching users: ', error);
    }
    
  }

  // Choose user from combobox
  handleUserChange(event) {
    this.userValue = event.detail.value; 
    this.selectedUser = this.userData.filter(user => user.Id === event.detail.value)[0];
    
    this.getObjectives();
  }


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
  
  currentYear = new Date().getFullYear();
  chosenYearToString = parseInt(this.chosenYearForTheUser, 10);
  
  @wire(GET_OBJECTIVES, { 
    year: '$chosenYearToString', 
    userId: '$selectedUser.Id' 
  })
  wiredObjectives({ error, result}) {
    if (error) {
      this.error = error;
      console.error(result.error);
    } else if (result.data) {
      this.objectives = result.data;
    }
  } 

  handleYearChange(event) {
    this.yearValue = event.detail.value;
    this.chosenYearForTheUser = this.yearValue;

    this.getObjectives();
  }

  /*async getObjectives() {
    
    await GET_OBJECTIVES({ 
      year: parseInt(this.chosenYearForTheUser, 10),
      userId: this.selectedUser.Id
     })
      .then((result) => {
        this.objectives = result;
        console.log('Objectives ::: ' + JSON.stringify(this.objectives));
      })
      .catch(error => {
        console.log('Error ::: ' + error);
      })
  }*/

  get hasObjectives() {
    if (this.objectives.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  get isYearSelected() {
    if (this.chosenYearForTheUser) {
      return true;
    }
    return false;
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
    else if (this.value === "review") {
      this.showReviewForm = true;
    }
    else if (this.value === "survey") {
      this.showSurveyForm = true;
    }
    else if (this.value === "case study") {
      this.showCaseStudyForm = true;
    }
    else if (this.value === "google review") {
      this.showGoogleReviewForm = true;
    }
    
  }

  handleObjectiveSave() {
    this.showObjectiveForm = false;
    this.objectiveRecordId = null;
    this.value = '';
    this.getObjectives();

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleObjectiveCancel() {
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

  handleReviewCancel() {
    this.showReviewForm = false;
    this.value = undefined;
  }

  handleReviewSave() {
    this.showReviewForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }
  
  handleSurveyCancel() {
    this.showSurveyForm = false;
    this.value = undefined;
  }

  handleSurveySave() {
    this.showSurveyForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleCaseStudyCancel() {
    this.showCaseStudyForm = false;
    this.value = undefined;
  }

  handleCaseStudySave() {
    this.showCaseStudyForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleGoogleReviewCancel() {
    this.showGoogleReviewForm = false;
    this.value = undefined;
  }

  handleGoogleReviewSave() {
    this.showGoogleReviewForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }
  
}
