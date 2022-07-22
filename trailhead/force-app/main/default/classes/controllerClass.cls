public with sharing class controllerClass {


    @AuraEnabled(cacheable=true)  
    public static List<Financial__c> fetchFinancial(){  
        return [SELECT Id, Creditor_Name__c,First_Name__c, Last_Name__c,Min_Payment_Percentage__c,Balance__c From Financial__c]; 
    }  
    
    @AuraEnabled  
    public static void deleteFinancials(List<Financial__c> fin){ 
      delete fin;  
    }  

   @AuraEnabled(cacheable=true)
   public static Integer totalCountfin(){ 
       try {
         return [SELECT Id from Financial__c].size();
       } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
   }

   @AuraEnabled(cacheable=false)
   public static void addFinancial(List<Financial__c> financeRecord){
       try {
        List<Financial__c> finToBeCloned = new List<Financial__c>();
        for (Financial__c f : financeRecord) {
            finToBeCloned.add(f.clone(false,true,false,false));
        }
        System.debug(finToBeCloned); 
          insert finToBeCloned;
         } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
   }
   
   @AuraEnabled(cacheable=true)
   public static Double balanceGrandTotal(String selectedfinstr){
       try {
        List<Financial__c> selectedfin =(List<Financial__c>) JSON.deserialize(selectedfinstr, List<Financial__c>.class);
        Double sum = 0;
        for(Financial__c fk : selectedfin){
         sum = sum + fk.Balance__c;
        }
        return sum;
      } catch (Exception e) {
           throw new AuraHandledException(e.getMessage());
       }
   }
   
}