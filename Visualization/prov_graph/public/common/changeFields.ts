

export interface intermediateNode {
    id: string,
    name: string,
    type: string,
    args: string,
    pid: number,
    ppid: number,
}

export interface intermediateEdge {
    id: string,
    from: string,
    to: string,
    relation: string,
    sequence: number,
    timestamp: string,
    behavior: number,
}

export function NodesFormatChange (nodes: any[]): intermediateNode[] {
    var iNodes = nodes.map(node => ({
        id: node._source.n_id,
        name: node._source.proc ? node._source.proc.exe : node._source.file ? node._source.file.name : node._source.socket.name,
        type: node._source.n_type,
        args: node._source.proc ? node._source.proc.args : undefined,
        pid: node._source.proc ? node._source.proc.pid : undefined,
        ppid: node._source.proc ? node._source.proc.ppid : undefined,
    }));
    return iNodes;
}

export function EdgesFormatChange (edges: any[]): intermediateEdge[] {
    var iEdges = edges.map(edge => ({
        id: edge._source.e_id,
        from: edge._source.n1_id,
        to: edge._source.n2_id,
        relation: edge._source.relation,
        sequence: edge._source.sequence,
        timestamp: edge._source['@timestamp'],
        behavior: edge._source.b_id,
    }));
    return iEdges;
}