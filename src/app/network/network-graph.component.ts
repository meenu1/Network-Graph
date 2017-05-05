import { Component , OnInit, OnDestroy,HostListener } from '@angular/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { UserFormService } from '../user/user-form.service';
import { Router } from '@angular/router';

@Component({
  selector: 'network-graph',
  templateUrl: './network-graph.component.html',
  styleUrls : ['./network-graph.component.css']
})
export class NetworkGraphComponent implements OnInit{
    public nodes: Node;
    public edges: Edge;
    public network : Network;
    private data : any;
    private backup :any = [];
    private totalNodes :any;
    private totalEdge :any;
    private graphSelection :Boolean = false;
    private selectedFilter :any = [];
    private showLoader : Boolean = false;
    private noResultFound : boolean = false;
    private duplicateNodesChecking = new Set();
    constructor(private UserFormService:UserFormService,private router:Router){
    }
    @HostListener('click') onclick(){

      let target = <HTMLElement>event.target;
      if(target.parentElement.parentElement.className === "vis-tooltip"){

            var baseData = target.innerText.split(':')[0].trim();
            var baseValue = target.innerText.split(':')[1].trim();
            var idElm = <HTMLElement>(target.parentElement.lastElementChild);
            let id = parseInt(idElm.innerText.trim());

            var substr  = baseData.substring(0,1);
            baseData = substr.toLowerCase() + baseData.substring(1);
      
            if(!this.graphSelection){
              
                  let dataObject = this.getValues(baseData,baseValue,id);
                  this.showLoader = true;
                  this.selectedFilter.push({'baseData':baseData,'baseValue':baseValue,'id':id,'baseDataShort':dataObject.baseDataShort});
                  this.getConnectionNetworkData(dataObject);

            }else if(this.graphSelection){
                 
                  this.graphSelectionFiltering(baseData,baseValue,id);
            }
      }
    }
    graphSelectionFiltering(baseData:string,baseValue:any,id:number){
            let found = false;
            let isDuplicate = false;
            
            if(this.selectedFilter.length>0){
                for(let i=0;i<this.selectedFilter.length;i++){
                    
                    if(this.selectedFilter[i].id == id ){
                        isDuplicate = true;
                    }
                    if(this.selectedFilter[i].baseData == baseData){
                      if(isDuplicate){
                          this.selectedFilter[i] = {'baseData':baseData,'baseValue':baseValue};
                      }else{
                          this.selectedFilter[i] = {'baseData':baseData,'baseValue':baseValue,'id':id};
                      }
                      found = true;
                    }
                }
            }
            if(!found){
              if(isDuplicate){
                  this.selectedFilter.push({'baseData':baseData,'baseValue':baseValue});
              }else{
                  this.selectedFilter.push({'baseData':baseData,'baseValue':baseValue,'id':id});
              }
            }
    }
    getConnectionNetworkData(dataObject:any){
       dataObject.objct.typeOfData = this.UserFormService.typeOfData;
       let jsonTemp = {
          "score":this.UserFormService.score,
          "size":this.UserFormService.size,
          "person":dataObject.objct
       };
       this.UserFormService.submitUserForm(jsonTemp).subscribe((data) => {
               this.showLoader = false;
               if(data.length>0){
                  let arrData = data;
                  var totalNodes = this.totalNodes.length;
                  var totalEdges = this.totalEdge.length;
                  //create root node
                  this.totalNodes.push({id: totalNodes+1, label:dataObject.baseValue});
                  let alreadyFound = false;

                  if(this.selectedFilter.length>0){
                    for(let j=0;j<this.totalNodes.length;j++){
                      if(this.totalNodes[j].data != undefined){
                          let edgeLabel = '';
                          for(let i=0;i<this.selectedFilter.length;i++){
                            
                            if(this.totalNodes[j].data[this.selectedFilter[i].baseData] == this.selectedFilter[i].baseValue){
                                edgeLabel = edgeLabel + this.selectedFilter[i].baseDataShort + ', ';
                            }
                          }
                          if(edgeLabel != ''){
                              edgeLabel = edgeLabel.substr(0,edgeLabel.length-2);
                              this.totalEdge.push({from : totalNodes+1,to:this.totalNodes[j].id,label: edgeLabel});
                          }
                    }
                    }
                  }
                  let index = 0;
                  totalEdges = this.totalEdge.length;
                  for(let j=0;j<arrData.length;j++){
                       
                        if(!this.duplicateNodesChecking.has(arrData[j].customer_no)){
                     
                            let labelName = arrData[j].firstName +' '+arrData[j].lastName;
                            var htmlStr = '<div><span class="ellipses firstName"> FirstName : '+arrData[j].firstName+'</span>'
                              +'<span class="ellipses lastName"> LastName : '+arrData[j].lastName+'</span>'
                              +'<span class="ellipses street"> Street : '+arrData[j].street+'</span>'
                              +'<span class="ellipses town"> Town : '+arrData[j].town+'</span>'
                              +'<span class="ellipses zip"> Zip : '+arrData[j].zip+'</span>'
                              +'<span style="display:none;">'+(totalNodes+j+2)+'</span>'
                              +'</div>';
                            this.totalNodes.push({id: totalNodes+j+2-index, label:labelName,title:htmlStr,data:arrData[j]});
                            this.totalEdge.push({from: totalNodes+1, to: totalNodes+j+2-index, label: dataObject.baseDataShort});
                        } else{
                            index++;
                        }  
                  }
                  totalEdges = this.totalEdge.length;

                  this.createGraph(this.totalNodes,this.totalEdge);
                  if(!this.graphSelection){
                    this.selectedFilter = [];
                  }
                  this.graphSelection = true;
                  let containerElem = <HTMLElement>document.querySelector('.container');
                  containerElem.style.marginRight='0px';
                  containerElem.style.marginLeft='0px';
                  
               }else{
                 this.noResultFound = true;
                 let preserveThis = this;
                 setTimeout(function(){
                    preserveThis.noResultFound = false;
                 },5000);
                 
               }
            });
    }
    getValues(baseData:string,baseValue:any,id:number){
            let obj = {
              'firstName': '',
              'lastName':'',
              'street': '',
              'zip' : 0,
              'town': ''
            };
            
            let baseDataShort = '';
            obj.firstName = null;
            obj.lastName = null;
            obj.street = null;
            obj.town = null;
            
            if(baseData == 'zip'){
              obj.zip = parseInt(baseValue);
              baseDataShort = 'ZP';
            }
            else if(baseData == 'firstName'){
              obj.firstName = baseValue;
              baseDataShort = 'FN';
            }
            else if(baseData == 'lastName'){
              obj.lastName = baseValue;
              baseDataShort = 'LN';
            }
            else if(baseData == 'street'){
              obj.street = baseValue;
              baseDataShort = 'ST';
            }
            else if(baseData == 'town'){
              obj.town = baseValue;
              baseDataShort = 'TW';
            }
            return {'objct' : obj,'baseData':baseData,'baseDataShort':baseDataShort,'baseValue':baseValue,'id':id};
    }
    onSubmitFilter(){
        let dataObject:any = {};
        this.showLoader = true;
        dataObject.objct = {};
        dataObject.objct.firstName = null;
        dataObject.objct.lastName = null;
        dataObject.objct.street = null;
        dataObject.objct.town = null;
        dataObject.objct.zip = 0;
         
        let baseDataShortTemp = '';
        let baseValueTemp = '';
        for(let i=0;i<this.selectedFilter.length;i++){
              dataObject.objct[this.selectedFilter[i].baseData] = this.selectedFilter[i].baseValue;
              let baseDataShort = '';
              baseValueTemp = baseValueTemp + this.selectedFilter[i].baseValue + ',';
              if(this.selectedFilter[i].baseData == 'zip'){
                baseDataShortTemp = baseDataShortTemp + 'ZP, ';
                baseDataShort = "ZP";
              }
              else if(this.selectedFilter[i].baseData == 'firstName'){
                baseDataShortTemp = baseDataShortTemp+'FN, ';
                baseDataShort = "FN";
              }
              else if(this.selectedFilter[i].baseData == 'lastName'){
                baseDataShortTemp = baseDataShortTemp+'LN, ';
                baseDataShort = "LN";
              }
              else if(this.selectedFilter[i].baseData == 'street'){
                baseDataShortTemp = baseDataShortTemp+'ST, ';
                baseDataShort = "ST";
              }
              else if(this.selectedFilter[i].baseData == 'town'){
                baseDataShortTemp = baseDataShortTemp+'TW, ';
                baseDataShort = "TW";
              }
              this.selectedFilter[i].baseDataShort = baseDataShort;
        }
        baseDataShortTemp = baseDataShortTemp.substr(0,baseDataShortTemp.length-2);
        dataObject.objct = dataObject.objct;
        dataObject.baseDataShort = baseDataShortTemp;
        dataObject.baseValue = baseValueTemp.substr(0,baseValueTemp.length-1);
        this.getConnectionNetworkData(dataObject);
    }
    addMainObject(){
        let labelName = "";
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
                +'<span style="display:none;">'+(i+2)+'</span>'
                +'</div>';
                this.duplicateNodesChecking.add(arr[i].customer_no);
                objArrNodes.push({id: i+2, label:labelName,title:htmlStr,data:arr[i]});
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
                },
                layout: {
                  improvedLayout:true,
                  hierarchical: {
                    enabled:false,
                    levelSeparation: 150,
                    nodeSpacing: 100,
                    treeSpacing: 200,
                    blockShifting: true,
                    edgeMinimization: true,
                    parentCentralization: true,
                    direction: 'UD',        // UD, DU, LR, RL
                    sortMethod: 'hubsize'   // hubsize, directed
                  }
                },
                physics: {
                  
                    maxVelocity: 146,
                    solver: 'forceAtlas2Based',
                    timestep: 0.35,
                    stabilization: {
                        enabled: true,
                        iterations: 1000,
                        updateInterval: 25
                    }

                }
            };
            var network = new Network(container, this.data, options);
            network.on("stabilizationIterationsDone", function () {
                network.setOptions( { physics: false } );
            });
    }
    backToForm(){
        this.router.navigate(['/user']);
    }
    removeSelectedItem(index:number){
      this.selectedFilter.splice(index,1);
    }
}