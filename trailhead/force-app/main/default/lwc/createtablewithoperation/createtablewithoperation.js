import {LightningElement, wire, track ,api} from 'lwc';
import {refreshApex} from '@salesforce/apex';  
import getAllFin from '@salesforce/apex/controllerClass.fetchFinancial';  
import deleteFinancials from '@salesforce/apex/controllerClass.deleteFinancials';  
import totalCountfinancial from '@salesforce/apex/controllerClass.totalCountfin';
import balanceGrandTotal from '@salesforce/apex/controllerClass.balanceGrandTotal';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const COLS = [
    { label: 'Creditor', fieldName: 'Creditor_Name__c', type:'text' },
    { label: 'First Name', fieldName: 'First_Name__c', type: 'text',editable: true, },
    { label: 'Last Name', fieldName: 'Last_Name__c', type: 'text' , editable: true,},
    { label: 'Min Payment %', fieldName: 'Min_Payment_Percentage__c', type: 'percentage', editable: true, },
    { label: 'Balance', fieldName: 'Balance__c', type: 'currency', editable: true, }
]; 

export default class Createtablewithoperation extends LightningElement {
    cols=COLS;  
    balance;
    checkedRow;
    @wire(getAllFin) fin;  
    @track bShowModal = false;
    @wire(totalCountfinancial) countrow;
    saveDraftValues = [];
     

    openModal() {    
        this.bShowModal = true;
    }
 
    closeModal() {    
        this.bShowModal = false;
    }
    refreshPage(){
    window.location.reload();
    } 

 
    deleteRecord(){  
      var selectedRecords =  
       this.template.querySelector("lightning-datatable").getSelectedRows();  
       deleteFinancials({fin: selectedRecords})  
      .then(result=>{  
        this.dispatchEvent(
        new ShowToastEvent({
            title: 'Remove',
            message: 'Remove Debt Successfully!!',
            variant: 'error'
        })
    );
        window.location.reload();
        return refreshApex(this.fin);  
      })  
      .catch(error=>{  
        alert('Could not delete'+JSON.stringify(error));  
      })  
    } 
   
       grandtotal(){
         var selectedlist = this.template.querySelector("lightning-datatable").getSelectedRows();
         balanceGrandTotal({selectedfinstr : JSON.stringify(selectedlist)})
         .then(show =>{
            this.balance = show;
           return refreshApex(this.fin);
         }).catch(error => {
           alert('Balance should not be null');  
         })
       }
 
 
        getSelectedRow() {
         var selectedRowsArray = this.template.querySelector("lightning-datatable").getSelectedRows();
         this.checkedRow = selectedRowsArray.length; 
         alert('Number of Checked Row is : ' + this.checkedRow);        
        
     }

     handleSave(event) {
      this.saveDraftValues = event.detail.draftValues;
      const recordInputs = this.saveDraftValues.slice().map(draft => {
          const fields = Object.assign({}, draft);
          return { fields };
      });

     
      const promises = recordInputs.map(recordInput => updateRecord(recordInput));
      Promise.all(promises).then(res => {
          this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Success',
                  message: 'Records Updated Successfully!!',
                  variant: 'success'
              })
          );
          this.saveDraftValues = [];
          return this.refresh();
      }).catch(error => {
          this.dispatchEvent(
              new ShowToastEvent({
                  title: 'Error',
                  message: 'An Error Occured!!',
                  variant: 'error'
              })
          );
      }).finally(() => {
          this.saveDraftValues = [];
      });
  }

  async refresh() {
    await refreshApex(this.fin);
}
        }