import React, { useEffect, useState } from 'react';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

// To add data plugin, we need to add "data" in "requiredPlugins" in kibana.json
import {
  DataPublicPluginStart,
} from '../../../../src/plugins/data/public';

import { NodesFormatChange, EdgesFormatChange, intermediateNode, intermediateEdge } from '../common/changeFields';

import { VisGraph } from './vis_graph';

import { NodesTable } from './nodes_table';
import { EdgesTable } from './edges_table';
import { NodesSimpleTable } from './nodes_simple_table';
import { EdgesSimpleTable } from './edges_simple_table';

import { TraceFilter } from './filters/trace_filter';
import { NodeNameFilter } from './filters/node_name_filter';
import { ConstNodeNameFilter } from './filters/node_name_const_filter';
import { NodeTypeFilter } from './filters/node_type_filter';
import { BehaviorIdFilter } from './filters/behavior_filter';
import { FromAndToFilter } from './filters/from_and_to_filter';
import { FromOrToFilter } from './filters/from_or_to_filter';
import { RelationFilter } from './filters/relation_filter';
import { SequenceStartFilter } from './filters/seq_start_filter';
import { SequenceEndFilter } from './filters/seq_end_filter';
import { TrackLengthInput } from './filters/track_length_input';

import axios from 'axios';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiFlexGrid,
  EuiAccordion,
} from '@elastic/eui';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import { boolean } from 'joi';
import { compare } from 'semver';

interface ProvGraphAppDeps {
    basename: string;
    notifications: CoreStart['notifications'];
    http: CoreStart['http'];
    navigation: NavigationPublicPluginStart;
    data: DataPublicPluginStart; // for using data.search or data.query or data.indexPatterns for searchBar in TopNavMenu
}

export const ProvGraphApp = ({ basename, notifications, http, navigation, data }: ProvGraphAppDeps) => {

    // for filters
    const [traceName, traceNameSet] = useState<string>("");
    const [nodeName, nodeNameSet] = useState<string>("");
    const [constNodeName, constNodeNameSet] = useState<string>(""); // which should not be affected by the graph growing function
    const [nodeType, nodeTypeSet] = useState<string>("");
    const [behaviorId, behaviorIdSet] = useState<string>("");
    const [fromAndTo, fromAndToSet] = useState<string>("");
    const [fromOrTo, fromOrToSet] = useState<string>("");
    const [relation, relationSet] = useState<string>("");
    const [sequenceStart, sequenceStartSet] = useState<string>("");
    const [sequenceEnd, sequenceEndSet] = useState<string>("");

    // for graph generating
    const [isGraphInitialize, isGraphInitializeSet] = useState<boolean>(false);
    const [isGraphClear, isGraphClearSet] = useState<boolean>(false);

    // the requested results
    const [nodes, nodesSet] = useState<intermediateNode[]>([]);
    const [edges, edgesSet] = useState<intermediateEdge[]>([]);

    // the current clicked or connected nodes and edges, for displaying the nodes and edges information
    const [clickedNodes, clickedNodesSet] = useState<any[]>([]);
    const [connectedNodes, connectedNodesSet] = useState<any[]>([]);
    const [clickedEdges, clickedEdgesSet] = useState<any[]>([]);

    // all nodes and edges that haved been clicked or connected, for growing the graph. Use Set to avoid duplication
    const [clickedNodesAll, clickedNodesAllSet] = useState<Set<string>>(new Set());
    const [connectedNodesAll, connectedNodesAllSet] = useState<Set<string>>(new Set());

    // for backtracking and forward tracking
    const [trackLength, trackLengthSet] = useState<string>("");

    // Actual request for nodes
    const onClickRequestNodes = () => {
        let getNodesRequestBody = {
            "traceName": traceName,
            "nodeName": nodeName,
            "constNodeName": constNodeName,
            "nodeType": nodeType,
          }
        axios({
            method: "post",
            url: "/api/prov_graph/get_nodes_data",
            data: getNodesRequestBody,
            headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
        })
        .then(function (response) {
            nodesSet(NodesFormatChange(response.data.reply));
        });

        // clear the growed nodes
        clickedNodesAllSet(new Set());
        connectedNodesAllSet(new Set());
    };

    // Actual request for edges
    const onClickRequestEdges = () => {
        let getEdgesRequestBody = {
            "traceName": traceName,
            "behaviorId": behaviorId,
            "fromAndTo": fromAndTo,
            "fromOrTo": fromOrTo,
            "relation": relation,
            "sequenceStart": sequenceStart,
            "sequenceEnd": sequenceEnd,
          }
          axios({
            method: "post",
            url: "/api/prov_graph/get_edges_data",
            data: getEdgesRequestBody,
            headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
          })
            .then(function (response) {
              edgesSet(EdgesFormatChange(response.data.reply));
        });

        // clear the growed nodes
        clickedNodesAllSet(new Set());
        connectedNodesAllSet(new Set());
    };

    const onClickGraphInitial = () => {
        isGraphInitializeSet(true);
    };

    const onClickGraphClear = () => {
        isGraphClearSet(true);
    };

    function makeNodesString (nodesSet: Set<string>): string{
        let nodesString: string = "";
        if (nodesSet.size > 0){
            let count = 0;
            for (let item of nodesSet.values()){
                if (item[0] == "-") item = "\\" + item;
                if (count == 0){
                    nodesString = "(" + item + ")";
                    count = 1;
                }
                else {
                    nodesString = nodesString + " or (" + item + ")";
                }
            }
        }
        return nodesString;
    }

    function compareEdgeDesc(a: intermediateEdge , b: intermediateEdge ): number {
        return (a.sequence > b.sequence) ? -1 : (a.sequence < b.sequence) ? 1 : 0;
    }
    function compareEdgeAsc(a: intermediateEdge , b: intermediateEdge ): number {
        return (a.sequence < b.sequence) ? -1 : (a.sequence > b.sequence) ? 1 : 0;
    }

    const onClickBacktrack = async () => {
        if (clickedNodes[0] != undefined){
            let rootNode: string;
            if (clickedNodes[0].id[0] == "-") rootNode = "\\" + clickedNodes[0].id;
            else rootNode = clickedNodes[0].id;

            let maxSequence: number = 0;

            // next three requests must be performed one by one, so we use "await"
            // find the max sequence first
            let getMaxSequenceBody = {
                "traceName": traceName,
                "to": rootNode,
                "sequenceStart": sequenceStart,
                "sequenceEnd": sequenceEnd,
              }
              await axios({
                method: "post",
                url: "/api/prov_graph/get_max_sequence",
                data: getMaxSequenceBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
              })
                .then(function (response) {
                    maxSequence = response.data.reply.aggregations.max_sequence.value;
                //   edgesSet(EdgesFormatChange(response.data.reply));
            });
            console.log(maxSequence);

            if (maxSequence == null) maxSequence = 0;
            let edgesTemp: intermediateEdge[] = [];
            let minSequence = maxSequence - parseInt(trackLength);
            console.log(minSequence);
            // then process edges one by one
            let getEdgesRequestBody = {
                "traceName": traceName,
                "behaviorId": behaviorId,
                "fromAndTo": fromAndTo,
                "fromOrTo": fromOrTo,
                "relation": relation,
                "sequenceStart": minSequence.toString(),
                "sequenceEnd": maxSequence.toString(),
              }
              await axios({
                method: "post",
                url: "/api/prov_graph/get_edges_data",
                data: getEdgesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
              })
                .then(function (response) {
                    edgesTemp = EdgesFormatChange(response.data.reply);
            });

            // sort the edges as a descending order first
            edgesTemp.sort(compareEdgeDesc);
            console.log("After sorted: ", edgesTemp);
            let trackedNodesID: Set<string> = new Set();
            trackedNodesID.add(clickedNodes[0].id);
            let edgesTracked: intermediateEdge[] = [];
            for (let edge of edgesTemp){
                if (trackedNodesID.has(edge.to)) {
                    trackedNodesID.add(edge.from);
                    edgesTracked.push(edge);
                }
            }
            console.log("edgesTracked: ", edgesTracked);
            edgesSet(edgesTracked);

            // ignore the node filter except constNodeName
            let getNodesRequestBody = {
                "traceName": traceName,
                "nodeName": nodeName,
                "constNodeName": constNodeName,
                "nodeType": nodeType,
                "connectedNodes": makeNodesString(trackedNodesID),
              }
              await axios({
                method: "post",
                url: "/api/prov_graph/get_growed_nodes_data",
                data: getNodesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
            })
            .then(function (response) {
                nodesSet(NodesFormatChange(response.data.reply));
            });

            // clear the growed nodes
            clickedNodesAllSet(new Set());
            connectedNodesAllSet(new Set());
        }
    }

    const onClickForwardTrack = async () => {
        if (clickedNodes[0] != undefined){
            let rootNode: string;
            if (clickedNodes[0].id[0] == "-") rootNode = "\\" + clickedNodes[0].id;
            else rootNode = clickedNodes[0].id;

            let minSequence: number = 0;

            // next three requests must be performed one by one, so we use "await"
            // find the max sequence first
            let getMinSequenceBody = {
                "traceName": traceName,
                "from": rootNode,
                "sequenceStart": sequenceStart,
                "sequenceEnd": sequenceEnd,
              }
              await axios({
                method: "post",
                url: "/api/prov_graph/get_min_sequence",
                data: getMinSequenceBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
              })
                .then(function (response) {
                    minSequence = response.data.reply.aggregations.min_sequence.value;
                //   edgesSet(EdgesFormatChange(response.data.reply));
            });
            console.log(minSequence);

            if (minSequence == null) minSequence = -parseInt(trackLength);
            let edgesTemp: intermediateEdge[] = [];
            let maxSequence =  minSequence + parseInt(trackLength);
            console.log(maxSequence);
            // then process edges one by one
            let getEdgesRequestBody = {
                "traceName": traceName,
                "behaviorId": behaviorId,
                "fromAndTo": fromAndTo,
                "fromOrTo": fromOrTo,
                "relation": relation,
                "sequenceStart": minSequence.toString(),
                "sequenceEnd": maxSequence.toString(),
              }
              await axios({
                method: "post",
                url: "/api/prov_graph/get_edges_data",
                data: getEdgesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
              })
                .then(function (response) {
                    edgesTemp = EdgesFormatChange(response.data.reply);
            });

            // sort the edges as a descending order first
            edgesTemp.sort(compareEdgeAsc);
            console.log("After sorted: ", edgesTemp);
            let trackedNodesID: Set<string> = new Set();
            trackedNodesID.add(clickedNodes[0].id);
            let edgesTracked: intermediateEdge[] = [];
            for (let edge of edgesTemp){
                if (trackedNodesID.has(edge.from)) {
                    trackedNodesID.add(edge.to);
                    edgesTracked.push(edge);
                }
            }
            console.log("edgesTracked: ", edgesTracked);
            edgesSet(edgesTracked);

            // ignore the node filter except constNodeName
            let getNodesRequestBody = {
                "traceName": traceName,
                "nodeName": nodeName,
                "constNodeName": constNodeName,
                "nodeType": nodeType,
                "connectedNodes": makeNodesString(trackedNodesID),
              }
              await axios({
                method: "post",
                url: "/api/prov_graph/get_growed_nodes_data",
                data: getNodesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
            })
            .then(function (response) {
                nodesSet(NodesFormatChange(response.data.reply));
            });

            // clear the growed nodes
            clickedNodesAllSet(new Set());
            connectedNodesAllSet(new Set());
        }
    }

    const onClickGraphGrow = async () => {
        // when graph grow button clicked, requesting the nodes and edges

        let _clickedNodesAll = clickedNodesAll;
        let _connectedNodesAll = connectedNodesAll;
        
        if (clickedNodes[0] != undefined) {
            // add the current clicked node to the nodes list
            _clickedNodesAll.add(clickedNodes[0].id);
            
            // add the nodes that are connected to the current clicked node by requesting connected edges(which may be not in the graph)
            let nodeId: string = clickedNodes[0].id;
            if (clickedNodes[0].id[0] == "-") nodeId = "\\" + nodeId;
            let getEdgesRequestBody = {
                "traceName": traceName,
                "behaviorId": "",
                "fromAndTo": "",
                "fromOrTo": nodeId,
                "relation": "",
                "sequenceStart": "",
                "sequenceEnd": "",
            }
            await axios({
                method: "post",
                url: "/api/prov_graph/get_edges_data",
                data: getEdgesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
            })
                .then(function (response) {
                let edges = EdgesFormatChange(response.data.reply);
                for (let item of edges){
                    _connectedNodesAll.add(item.from);
                    _connectedNodesAll.add(item.to);
                }
            });
        }

        console.log("clickedNodesAll", _clickedNodesAll);
        console.log("connectedNodesAll", _connectedNodesAll);
        clickedNodesAllSet(_clickedNodesAll);
        connectedNodesAllSet(_connectedNodesAll);

        if (connectedNodesAll.size > 0){
            let getNodesRequestBody = {
                "traceName": traceName,
                "nodeName": nodeName,
                "constNodeName": constNodeName,
                "nodeType": nodeType,
                "connectedNodes": makeNodesString(_connectedNodesAll),
              }
            axios({
                method: "post",
                url: "/api/prov_graph/get_growed_nodes_data",
                data: getNodesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
            })
            .then(function (response) {
                nodesSet(NodesFormatChange(response.data.reply));
            });
        }

        if (clickedNodesAll.size > 0){
            let getEdgesRequestBody = {
                "traceName": traceName,
                "behaviorId": behaviorId,
                "fromAndTo": fromAndTo,
                "fromOrTo": fromOrTo,
                "relation": relation,
                "sequenceStart": sequenceStart,
                "sequenceEnd": sequenceEnd,
                "clickedNodes": makeNodesString(_clickedNodesAll),
            }
            axios({
                method: "post",
                url: "/api/prov_graph/get_growed_edges_data",
                data: getEdgesRequestBody,
                headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
            })
                .then(function (response) {
                edgesSet(EdgesFormatChange(response.data.reply));
            });
        }
    }

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <EuiPage>
            <EuiPageBody>
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="pGraph.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>
              <EuiPageContent>

                <EuiFlexItem>
                    <TraceFilter  traceNameSetF={traceNameSet}></TraceFilter>
                </EuiFlexItem>
                <EuiSpacer size="l" />

                <EuiAccordion id='nodesFilter' buttonContent="Nodes Filter" initialIsOpen={true}>
                    <EuiSpacer size="l" />
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <NodeNameFilter  nodeNameSetF={nodeNameSet}></NodeNameFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <ConstNodeNameFilter  nodeNameSetF={constNodeNameSet}></ConstNodeNameFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <NodeTypeFilter  nodeTypeSetF={nodeTypeSet}></NodeTypeFilter>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                size="m"
                                fill
                                onClick={onClickRequestNodes}>
                                Request Nodes
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <NodesTable 
                            nodes={nodes} 
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiAccordion>

                <EuiSpacer size="xxl" />

                <EuiAccordion id='edgesFilter' buttonContent="Edges Filter" initialIsOpen={true}>
                    <EuiSpacer size="l" />
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <BehaviorIdFilter  behaviorIdSetF={behaviorIdSet}></BehaviorIdFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <FromOrToFilter  fromToSetF={fromOrToSet}></FromOrToFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <FromAndToFilter  fromToSetF={fromAndToSet}></FromAndToFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <RelationFilter  relationSetF={relationSet}></RelationFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <SequenceStartFilter  sequenceStartSetF={sequenceStartSet}></SequenceStartFilter>
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <SequenceEndFilter  sequenceEndSetF={sequenceEndSet}></SequenceEndFilter>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                size="m"
                                fill
                                onClick={onClickRequestEdges}>
                                Request Edges
                            </EuiButton>
                        </EuiFlexItem> 
                    </EuiFlexGroup>
                    <EuiFlexGroup>                   
                        <EuiFlexItem>
                            <EdgesTable 
                            edges={edges} 
                            />
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiAccordion>
                
                <EuiSpacer size="xxl" />
                
                <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                      <EuiButton
                      size="m"
                      fill
                      onClick={onClickGraphInitial}>
                      Initialize Graph
                      </EuiButton>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButton
                      size="m"
                      fill
                      onClick={onClickGraphClear}>
                      Clear Graph
                      </EuiButton>
                    </EuiFlexItem>
                </EuiFlexGroup>
                
                <EuiSpacer size="xl" />
                
                <EuiFlexGroup>
                  <EuiFlexItem grow={7}>
                    <VisGraph 
                        nodes={nodes} 
                        edges={edges}
                        clickedNodesSetF={clickedNodesSet}
                        connectedNodesSetF={connectedNodesSet}
                        clickedEdgesSetF={clickedEdgesSet}
                        isInitialize={isGraphInitialize} 
                        isInitializeSetF={isGraphInitializeSet}
                        isClear={isGraphClear}
                        isClearSetF={isGraphClearSet}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem grow={3}>
                    <EuiFlexGrid columns={1}>
                        <EuiAccordion id='clickedNodes' buttonContent="Clicked Node" initialIsOpen={true}>
                            <EuiFlexItem>
                                <NodesSimpleTable
                                nodes={clickedNodes} 
                                />
                            </EuiFlexItem>
                            <EuiSpacer size="l" />
                            <EuiFlexItem>
                                <TrackLengthInput  trackLengthSetF={trackLengthSet}></TrackLengthInput>
                            </EuiFlexItem>
                            <EuiSpacer size="l" />
                            <EuiFlexItem grow={false}>
                                <EuiButton
                                    size="m"
                                    fill
                                    onClick={onClickBacktrack}>
                                    Backtrack
                                </EuiButton>
                            </EuiFlexItem>
                            <EuiSpacer size="l" />
                            <EuiFlexItem grow={false}>
                                <EuiButton
                                    size="m"
                                    fill
                                    onClick={onClickForwardTrack}>
                                    Forward Track
                                </EuiButton>
                            </EuiFlexItem>
                            <EuiSpacer size="l" />
                            <EuiFlexItem grow={false}>
                                <EuiButton
                                    size="m"
                                    fill
                                    onClick={onClickGraphGrow}>
                                    Grow Graph
                                </EuiButton>
                            </EuiFlexItem>
                            <EuiSpacer size="l" />
                            <EuiFlexItem>
                            <EuiText grow={false}>
                                <p>To see the expanded/backtracking/forward tracking graph, click the Initialize Graph button after clicking above buttons.</p>
                            </EuiText>
                            </EuiFlexItem>
                        </EuiAccordion>
                        <EuiSpacer size="l" />
                        <EuiAccordion id='connectedNodes' buttonContent="Connected Nodes" initialIsOpen={true}>
                            <EuiFlexItem>
                                <NodesSimpleTable
                                nodes={connectedNodes} 
                                />
                            </EuiFlexItem>
                        </EuiAccordion>
                        <EuiSpacer size="l" />
                        <EuiAccordion id='clickedEdges' buttonContent="Clicked/Connected Edges" initialIsOpen={true}>
                            <EuiFlexItem>
                                <EdgesSimpleTable
                                edges={clickedEdges} 
                                />
                            </EuiFlexItem>
                        </EuiAccordion>
                    </EuiFlexGrid>
                  </EuiFlexItem>
                </EuiFlexGroup>

              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};
