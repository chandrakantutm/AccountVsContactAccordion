import { LightningElement, wire } from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountController.fetchAccounts';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
const columns = [
    { label: 'FirstName', fieldName: 'FirstName' },
    { label: 'LastName', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email' }
];
export default class Sample extends NavigationMixin(LightningElement) {
    columns = columns;
    records;
    error;
     ranger;
     left;
     top;
     holdOrginalData;


    @wire( fetchAccounts )  
    wiredAccount( { error, data } ) {

        if (data) {

            console.log( 'Fetched Data ' + JSON.stringify( data ) );
            this.records = data;
            this.holdOrginalData=data;
        } else if ( error ) {

            this.error = error;
            this.records = undefined;

        }

    }  

    hideAndShow( event ) {

        let indx = event.target.dataset.recordId;
        console.log( 'Index is ' + indx );

        if ( this.records ) {

            let recs =  JSON.parse( JSON.stringify( this.records ) );
            
            for ( let rec of recs ) {
                rec.hideBool = true;
            }

            this.records = recs;
            let currVal = recs[ indx ].hideBool;
            console.log( 'Current Val ' + currVal );
            recs[ indx ].hideBool = !currVal;
            this.records = recs;
            console.log( 'After Change ' + this.records[ indx ].hideBool );

        }

    }

   
    handleScroll(event) {
        console.log('areaHeight');
        let area = this.template.querySelector('.scrollArea');
        //let threshold = 2 * event.target.clientHeight;
        console.log('area.clientHeight'+JSON.stringify(area)+ ' '+ JSON.stringify(event.target));
        /*let areaHeight = area.clientHeight;
        let scrollTop = event.target.scrollTop;
        if(areaHeight - threshold < scrollTop) {
           let i = 0, t = this.items.length;
            while(++i < 30) {
                this.items.push( {id:i+t, name:"Row "+(i+t), desc: "Example Row "+(i+t)} );
            }
            console.log('areaHeight');
    }*/
    }
    get boxClass() { 
        return `background-color:white; top:${this.top - 280}px; left:${this.left}px`;
      }
      showData(event){
          console.log('hiiii');
        this.ranger = event.currentTarget.dataset.rangerid;
        this.left = event.clientX;
        this.top=event.clientY;
    }
    hideData(event){
        this.ranger = "";
    }
    handleClick(event){
        
        let accId=this.ranger = event.currentTarget.dataset.accountid;
        
        const defaultValues = encodeDefaultFieldValues({
            AccountId: accId
        });

        console.log(defaultValues);

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Contact',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
            
        });
    }

    searchKeyword(event) {
        let searchvalue = event.target.value;
        searchvalue = searchvalue.toLowerCase();
        var mainData=this.holdOrginalData;
        console.log('mainData'+searchvalue+'            '+JSON.stringify(mainData));
        var records=[];
        if(searchvalue!=''){
            for(var i=0;i<mainData.length;i++){
               
                console.log('mainData 2'+JSON.stringify(mainData[i]));
                var arraydec=[];
                if(mainData[i].objAccount.Name.toLowerCase().includes(searchvalue)){
                    console.log('hiii');
                    records.push(mainData[i]);
                    console.log('hiii 2');
                    continue;
                }
                for(var j=0; j<mainData[i].objAccount.Contacts.length;j++){
                    if(mainData[i].objAccount.Contacts[j].FirstName.toLowerCase().includes(searchvalue) || mainData[i].objAccount.Contacts[j].LastName.toLowerCase().includes(searchvalue))
                    records.push(mainData[i]);
                    break;
                }
            }
            this.records=records;
           
        }
        else{
            this.records=mainData;
        }

    }

}
