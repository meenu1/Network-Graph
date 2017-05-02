import { Component , OnInit, OnDestroy,HostListener } from '@angular/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { UserFormService } from '../user/user-form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'network-graph',
  templateUrl: './network-graph.component.html',
  styles:[`
    #mynetwork{
          height: 500px;
          border: 1px solid #ccc;
          margin: 20px;
          margin: 0 auto;
    }
  `]
})
export class NetworkGraphComponent implements OnInit{
    public nodes: Node;
    public edges: Edge;
    public network : Network;
    private data : any;
    private backup :any = [];
    private totalNodes :any;
    private totalEdge :any;
    constructor(private UserFormService:UserFormService,private router:Router){
    }
    @HostListener('click') onclick(){
      var target = <HTMLElement>event.target;
      if(target.parentElement.parentElement.className === "vis-tooltip"){
        
            let obj = {
              'firstName': '',
              'lastName':'',
              'street': '',
              'zip' : 0,
              'town': ''
            };
            let objTemp = Object.assign({}, obj);
            var baseData = target.innerText.split(':')[0].trim();
            var baseValue = target.innerText.split(':')[1].trim();

            obj.firstName = null;
            obj.lastName = null;
            obj.street = null;
            obj.town = null;
            
            if(baseData == 'Zip'){
              obj.zip = parseInt(baseValue);
              objTemp.zip = parseInt(baseValue);
              baseData = 'ZP';
            }
            else if(baseData == 'FirstName'){
              obj.firstName = baseValue;
              objTemp.firstName = baseValue;
              baseData = 'FN';
            }
            else if(baseData == 'LastName'){
              obj.lastName = baseValue;
              objTemp.lastName = baseValue;
              baseData = 'LN';
            }
            else if(baseData == 'Street'){
              obj.street = baseValue;
              objTemp.street = baseValue;
              baseData = 'ST';
            }
            else if(baseData == 'Town'){
              obj.town = baseValue;
              objTemp.town = baseValue;
              baseData = 'TW';
            }
            this.UserFormService.submitUserForm(obj).subscribe((data) => {
                // this.UserFormService.userFormData = data;
                // this.UserFormService.userFormMainData = objTemp;
                let arrData = data;
                var totalNodes = this.totalNodes.length;
                this.totalNodes.push({id: totalNodes+1, label:baseValue});
                let alreadyFound = false;
                
                for(let j=0;j<arrData.length;j++){
                      let labelName = arrData[j].firstName +' '+arrData[j].lastName;
                      var htmlStr = '<div><span class="ellipses firstName"> FirstName : '+arrData[j].firstName+'</span>'
                        +'<span class="ellipses lastName"> LastName : '+arrData[j].lastName+'</span>'
                        +'<span class="ellipses street"> Street : '+arrData[j].street+'</span>'
                        +'<span class="ellipses town"> Town : '+arrData[j].town+'</span>'
                        +'<span class="ellipses zip"> Zip : '+arrData[j].zip+'</span>'
                        +'</div>';
                      this.totalNodes.push({id: totalNodes+j+2, label:labelName,title:htmlStr});
                      this.totalEdge.push({from: totalNodes+1, to: totalNodes+j+2, label: baseData});
                  
                }
                for(let i=0;i<this.backup.length;i++){
                  if(this.backup[i].firstName == baseValue || this.backup[i].lastName == baseValue || this.backup[i].zip == baseValue || this.backup[i].street == baseValue || this.backup[i].town == baseValue){
                        this.totalEdge[i+1] = {from : totalNodes+1,to:i+2,label:baseData};
                  }
                }
                this.createGraph(this.totalNodes,this.totalEdge);
            });
            //this.data.nodes.update({id: 2, label:'Meenu',title:''});
      }
    }
    addMainObject(){
      let labelName;
        if(this.UserFormService.userFormMainData.firstName!=''){
          labelName = this.UserFormService.userFormMainData.firstName + ' ';
        }
        if(this.UserFormService.userFormMainData.lastName!=''){
          labelName = labelName + this.UserFormService.userFormMainData.lastName;
        }
        else if(this.UserFormService.userFormMainData.zip!=''){
          labelName = this.UserFormService.userFormMainData.zip;
        }
        else if(this.UserFormService.userFormMainData.street!=''){
          labelName = this.UserFormService.userFormMainData.street;
        }
        else if(this.UserFormService.userFormMainData.town!=''){
          labelName = this.UserFormService.userFormMainData.town;
        }
        return labelName;
    }

    public ngOnInit(): void {

            let objArrNodes :any= [];
            let objArrEdges :any= [];
            let arr = this.UserFormService.userFormData;
            this.backup = arr;
            let dataLength = arr.length;
            
            objArrNodes.push({id: 1, label:this.addMainObject()});

            for(let i=0;i<dataLength;i++){
                let edgeLabel = '';
                if(this.UserFormService.userFormMainData.firstName!=''){
                  edgeLabel = 'FN, ';
                }
                if(this.UserFormService.userFormMainData.lastName!=''){
                  edgeLabel = edgeLabel +'LN, ';
                }
                if(this.UserFormService.userFormMainData.zip!=''){
                  edgeLabel = edgeLabel + 'ZP, ';
                }
                if(this.UserFormService.userFormMainData.street!=''){
                  edgeLabel = edgeLabel + 'ST, ';
                }
                if(this.UserFormService.userFormMainData.town!=''){
                  edgeLabel = edgeLabel + 'TW, ';
                }
                edgeLabel = edgeLabel.substr(0,edgeLabel.length-2);
                
                let labelName = arr[i].firstName +' '+arr[i].lastName;
                var htmlStr = '<div><span class="ellipses firstName"> FirstName : '+arr[i].firstName+'</span>'
                +'<span class="ellipses lastName"> LastName : '+arr[i].lastName+'</span>'
                +'<span class="ellipses street"> Street : '+arr[i].street+'</span>'
                +'<span class="ellipses town"> Town : '+arr[i].town+'</span>'
                +'<span class="ellipses zip"> Zip : '+arr[i].zip+'</span>'
                +'</div>';
                objArrNodes.push({id: i+2, label:labelName,title:htmlStr});
                objArrEdges.push({id: i+1,from: 1, to: i+2, label: edgeLabel});
                
            }
            this.createGraph(objArrNodes,objArrEdges);
            this.totalNodes = objArrNodes;
            this.totalEdge = objArrEdges;
    }
    createGraph(objArrNodes:any,objArrEdges:any){
      // create an array with nodes
            var nodes = new DataSet(objArrNodes);

            // create an array with edges
            var edges = new DataSet(objArrEdges);

           // create a network
            var container = document.getElementById('mynetwork');
            this.data = {
              nodes: nodes,
              edges: edges
            };

            var options = {
              interaction:{
                    hover:true
                }
            };
            var network = new Network(container, this.data, options);
    }
    backToForm(){
        this.router.navigate(['/user']);
    }
}