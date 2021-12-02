import React, { useRef, useState, useEffect } from 'react';
import { Node, Edge, Options, Network } from 'vis-network';
import { DataSet } from 'vis-data';

interface IVisGraph {
    nodes: any[],
    edges: any[],
    clickedNodesSetF: (text: any) => void,
    connectedNodesSetF: (text: any[]) => void,
    clickedEdgesSetF: (text: any[]) => void,
    isInitialize: boolean,
    isInitializeSetF: (text: boolean) => void;
    isClear: boolean,
    isClearSetF: (text: boolean) => void;
}

export const VisGraph: React.FC<IVisGraph> = (props) => {
    
    const processColor = {
        border: "rgba(224,64,112,0.4)", // pink
        background: "rgba(224,64,112,0.4)",
        highlight: {
            border: "rgba(224,32,96,1)", // dark pink #e02060
            background: "rgba(224,64,112,1)", // #e04070
        },
        hover: {
            border: "rgba(224,32,96,1)", // dark pink
            background: "rgba(224,64,112,1)",
        },
    };
    const fileColor = {
        border: "rgba(0,153,51,0.4)", // green
        background: "rgba(0,153,51,0.4)", 
        highlight: {
            border: "rgba(0,102,51,1)", // dark green #006633
            background: "rgba(0,153,51,1)", // #009933
        },
        hover: {
            border: "rgba(0,102,51,1)", // dark green
            background: "rgba(0,153,51,1)",
        }
    };
    const socketColor = {
        border: "rgba(255,153,0,0.4)", // orange
        background: "rgba(255,153,0,0.4)", 
        highlight: {
            border: "rgba(204,102,0,1)", // dark green #CC6600
            background: "rgba(255,153,0,1)", // #FF9900
        },
        hover: {
            border: "rgba(204,102,0,1)", // dark green
            background: "rgba(255,153,0,1)",
        },
    };

    const font = {
        color: "#606060", // medium dark grey
        size: 14,
        face: 'arial',
    };

    const options: Options = {
        autoResize: true,
        nodes: {
            font: font,
            scaling: {
                min: 10,
                max: 30,
            },
        },
        groups: {
            process: {
                color: processColor,
                shape: "dot", 
            },
            file: {
                color: fileColor,
                shape: "square",
            },
            socket: {
                color: socketColor,
                shape: "triangle",
            },
        },
        edges: {
            arrows: { 
                to: true,
            }, 
            font: font, 
            width: 1, 
            hoverWidth: 2, 
            selectionWidth: 2,
        },
        layout: {
            randomSeed: 1,
            // improvedLayout: true,
        },
        physics: true,
        interaction: {
            // tooltipDelay: 200,
            hover: true, // important
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
        },
    };

    function idToColor (id: number): any {
        let colorString: string;
        let colorStringOpaque: string;
        if (id != undefined) {
            let idString = Math.abs(id).toString(10);
            colorString = 'rgba(1' + idString.substring(0,2) + ',1' + idString.substring(2,4) + ',1' + idString.substring(4,6) + ',0.6)';
            colorStringOpaque = 'rgba(1' + idString.substring(0,2) + ',1' + idString.substring(2,4) + ',1' + idString.substring(4,6) + ',1)';
        }
        else {
            colorString = "#b0b0b0";
            colorStringOpaque = "#606060";
        }
        return {
            color: colorString, 
            highlight: colorStringOpaque, 
            hover: colorStringOpaque,
        };
    }

    const [savedNodes, savedNodesSet]= useState<Node[]>([]);
    const [savedEdges, savedEdgesSet]= useState<Edge[]>([]);

    const [nodes, nodesSet] = useState<Node[]>([]);
    const [edges, edgesSet] = useState<Edge[]>([]);
    
    const pRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<Network | null>(null);

    // Once all nodes have been updated, update the saved nodes for graph rendering
    useEffect(() => {
        let nodesArray: Node[] = props.nodes.map(node => ({
            id: node.id,
            group: node.type,
            label: node.name,
            description: node.args,
        }));
        if (nodesArray.length != 0) {
            savedNodesSet(nodesArray);
        }
    }, [props.nodes]);

    // Once all edges have been updated, update the edges for graph rendering
    useEffect(() => {
        let edgesArray : Edge[] = props.edges.map(edge => ({
            from: edge.from,
            to: edge.to,
            label: edge.sequence + ": " + edge.relation,
            description: edge.behavior,
            color: idToColor(edge.behavior),
        }));
        if (edgesArray.length != 0) {
            savedEdgesSet(edgesArray);
        }
    }, [props.edges]);
    
    // Reinitialize the graph
    useEffect(() => {
        if (props.isInitialize) {
            if (savedNodes.length != 0 && savedNodes.length * savedEdges.length < 400000 ) {
                console.log("Initializing the graph...");
                let nodesIdInEdges = new Set<string>();
                for (let i =0; i < savedEdges.length; i++){
                    let fromId: any = savedEdges[i].from;
                    let toId: any = savedEdges[i].to;
                    nodesIdInEdges.add(fromId);
                    nodesIdInEdges.add(toId);
                }
                let nodesDataset = new DataSet<any>(savedNodes);
                let nodesMap = nodesDataset.get({ returnType: "Object" });
                let nodesInEdges: any[] = [];
                for (var nodeId of nodesIdInEdges){
                    if (nodesMap[nodeId] != undefined){ // in case the node has been filtered in Nodes Filter
                        nodesInEdges.push(nodesMap[nodeId]);
                    }
                }
                nodesSet(nodesInEdges);
                edgesSet(savedEdges);
                let warningText;
                if (pRef.current?.getElementsByClassName("p")){
                    if (pRef.current.getElementsByClassName("p").length > 0){
                        warningText = pRef.current.getElementsByClassName("p")[0];
                        warningText.innerHTML = "Is initializing...";
                    }
                    else {
                        warningText = document.createElement("p");
                        warningText.id = "warningText"
                        warningText.innerText = "There are too many nodes and edges to display! Please filter first.";
                        if (pRef.current) pRef.current.appendChild(warningText);
                    }
                }
            } 
            else if (savedNodes.length * savedEdges.length >= 400000 ) {
                console.log("#nodes: ", savedNodes.length);
                console.log("#edges: ", savedEdges.length);
                console.log("There are too many nodes and edges to display! Please filter first.");
                let warningText;
                if (pRef.current?.getElementsByClassName("p")){
                    if (pRef.current.getElementsByClassName("p").length > 0){
                        warningText = pRef.current.getElementsByClassName("p")[0];
                        warningText.innerHTML = "There are too many nodes and edges to display! Please filter first.";
                    }
                    else {
                        warningText = document.createElement("p");
                        warningText.id = "warningText"
                        warningText.innerText = "There are too many nodes and edges to display! Please filter first.";
                        if (pRef.current) pRef.current.appendChild(warningText);
                    }
                }
            }
            props.isInitializeSetF(false);
        }
    }, [props.isInitialize]);
    
    // Clear the graph
    useEffect(() => {
        if (props.isClear) {
            nodesSet([]);
            console.log("Clearing the graph...")
            props.isClearSetF(false);
        }
    }, [props.isClear]);

    // show the information of clicked node and connected nodes
    function showProperties (params: any) {

        // show clicked nodes and connected nodes
        let nodesDataset = new DataSet<any>(nodes);
        let nodesMap = nodesDataset.get({ returnType: "Object" });
        if (networkRef.current && params.nodes.length > 0) {
            let connectedNodesId = networkRef.current.getConnectedNodes(params.nodes[0]);
            let connectedNodes = [];
            for (let i = 0; i < connectedNodesId.length; i++ ) {
                let connectedNodeId: any = connectedNodesId[i];
                if (nodesMap[connectedNodeId] != undefined){
                    connectedNodes.push(nodesMap[connectedNodeId]);
                }
            }
            props.connectedNodesSetF(connectedNodes);
            
            let clickedNodeId = params.nodes[0];
            let clickedNodes = [];
            if (nodesMap[clickedNodeId] != undefined) {
                clickedNodes.push(nodesMap[clickedNodeId]);
                props.clickedNodesSetF(clickedNodes);
            }
        }

        // show clicked edge (only one)
        let edgesDataset = new DataSet<any>(edges);
        let edgesMap = edgesDataset.get({ returnType: "Object" });
        // if (networkRef.current && params.nodes.length == 0 && params.edges.length == 1) {
        if (networkRef.current && params.edges.length > 0) {
            let clickedEdges = [];
            for (let i = 0; i < params.edges.length; i++ ) {
                let clickedEdgeId: any = params.edges[i];
                if (edgesMap[clickedEdgeId] != undefined){
                    clickedEdges.push(edgesMap[clickedEdgeId]);
                }
            }
            props.clickedEdgesSetF(clickedEdges);
        }
    }
    
    // Update the graph visualization
    useEffect(() => {
        networkRef.current = pRef.current && new Network(pRef.current, { nodes, edges }, options);
        if (networkRef.current) {
            networkRef.current.on("stabilizationIterationsDone", function () {
                if (networkRef.current) networkRef.current.setOptions( { physics: false } );
            });
            networkRef.current.on("click", showProperties);
        }
        console.log("Start drawing the graph...");
    }, [nodes, edges]);

    const containerStyle = {
        width: '100%',
        height: '1000px',
        margin: '0 auto',
        border: '1px solid #d0d8e8', // very light grey, silimar to kibana's border design
    }
    
    return (
        <div style={containerStyle} ref={pRef} />
    );
}