import { Component , OnInit, OnDestroy } from '@angular/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis';
import { UserFormService } from '../user/user-form.service';
declare var $:any;
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
    constructor(private UserFormService:UserFormService){
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
            let arr  = this.UserFormService.userFormData;
            let dataLength = this.UserFormService.userFormData.length;
            
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
                  edgeLabel = edgeLabel + 'St, ';
                }
                if(this.UserFormService.userFormMainData.town!=''){
                  edgeLabel = edgeLabel + 'TW, ';
                }
                edgeLabel = edgeLabel.substr(0,edgeLabel.length-2);
                
                let labelName = this.UserFormService.userFormData[i].firstName +' '+this.UserFormService.userFormData[i].lastName;
                var htmlStr = '<div><span class="ellipses"> FirstName : '+this.UserFormService.userFormData[i].firstName+'</span>'
                +'<span class="ellipses"> LastName : '+this.UserFormService.userFormData[i].lastName+'</span>'
                +'<span class="ellipses"> Street : '+this.UserFormService.userFormData[i].street+'</span>'
                +'<span class="ellipses"> Town : '+this.UserFormService.userFormData[i].town+'</span>'
                +'<span class="ellipses"> Zip : '+this.UserFormService.userFormData[i].zip+'</span>'
                +'</div>';
                objArrNodes.push({id: i+2, label:labelName,title:htmlStr});
                objArrEdges.push({from: 1, to: i+2, label: edgeLabel});
            }

            // create an array with nodes
            var nodes = new DataSet(objArrNodes);

            // create an array with edges
            var edges = new DataSet(objArrEdges);

           // create a network
            var container = document.getElementById('mynetwork');
            var data = {
              nodes: nodes,
              edges: edges
            };
            //var options = {};
            var options = {interaction:{hover:true}};
            var network = new Network(container, data, options);
            network.on("click", function (params) {
             // let obj = objArrNodes[params.nodes[0]-1];
              // let obj = arr[params.nodes[0]-2];
              // nodes.update({id: params.nodes[0],title:obj});
              // console.log(obj);
            });
            // network.on("hoverNode", function(params) {
            //   $('#mynetwork').qtip({
            //     content: 'Node with ID: ' + params.node,
            //       show: {
            //         event: event.type // original event
            //       },
            //       position: {
            //         my: 'top left',
            //         target: 'mouse',
            //         adjust: {
            //           x: 10, y: 10
            //         }
            //       }
            //     });
            // });
    }
}