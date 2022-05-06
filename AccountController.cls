public with sharing class AccountController {
 
    @AuraEnabled( cacheable = true )
    public static List< AccountWrapper > fetchAccounts() {
     
        List< AccountWrapper > listWrap = new List< AccountWrapper >();
        
       for ( Account objAcc : [ SELECT Id, Name, phone,  Rating, Type,  
                                        ( SELECT Id, FirstName, LastName, Email FROM Contacts )
                                   FROM Account
                                  LIMIT 10 ] ) {
            
            AccountWrapper objWrap = new AccountWrapper( true, objAcc, objAcc.Contacts.size() > 0 ? true : false );
            listWrap.add( objWrap );

        }

        return listWrap;
         
    }

    public class AccountWrapper {

        @AuraEnabled
        public Boolean hideBool;
        @AuraEnabled
        public Boolean contactBool;
        @AuraEnabled
        public Account objAccount;

        public AccountWrapper( Boolean hideBool, Account objAccount, Boolean contactBool ) {

            this.hideBool = hideBool;
            this.objAccount = objAccount;
            this.contactBool = contactBool;

        }

    }
     
}
