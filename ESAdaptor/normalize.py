import json

relations = {1: "vfork", 2: "clone", 3: "execve", 4: "kill", 5: "pipe", 
    6: "delete", 7: "create", 8: "recv", 9: "send", 10: "mkdir", 
    11: "rmdir", 12: "open", 13: "load", 14: "read", 15: "write", 
    16: "connect", 17: "getpeername", 18: "filepath", 19: "mode", 20: "mtime", 
    21: "linknum", 22: "uid", 23: "count", 24: "nametype", 25: "version",
    26: "dev", 27: "sizebyte", 28: "edgetype_num"}
types = {1: "process", 2: "file", 3: "socket"}

def bh_edge_to_json(edge):
    edge_dic = {}
    edge_dic['e_id'] = str(edge[0])
    edge_dic['n1_id'] = str(edge[1])
    edge_dic['n2_id'] = str(edge[2])
    edge_dic['relation'] = relations[edge[3]]
    edge_dic['sequence'] = edge[4]
    edge_dic['session'] = edge[5]
    edge_dic['@timestamp'] = edge[6]
    edge_dic['b_id'] = str(edge[7])
    edge_dic['t_id'] = str(edge[8])
    edge_dic['t_name'] = edge[9]
    try:
        edge_json = json.dumps(edge_dic)
    except json.decoder.JSONDecodeError as error:
        print(error)
    return edge_json

def edge_to_json(edge):
    edge_dic = {}
    edge_dic['e_id'] = str(edge[0])
    edge_dic['n1_id'] = str(edge[1])
    edge_dic['n2_id'] = str(edge[2])
    edge_dic['relation'] = relations[edge[3]]
    edge_dic['sequence'] = edge[4]
    edge_dic['session'] = edge[5]
    edge_dic['@timestamp'] = edge[6]
    edge_dic['t_id'] = str(edge[7])
    edge_dic['t_name'] = edge[8]
    try:
        edge_json = json.dumps(edge_dic)
    except json.decoder.JSONDecodeError as error:
        print(error)
    return edge_json

def proc_to_json(node, proc):
    proc_dic = {}
    proc_dic['n_id'] = str(node[0])
    proc_dic['n1_id'] = str(node[0])
    proc_dic['n2_id'] = str(node[0])
    proc_dic['n_type'] = types[node[1]]
    proc_dic['proc'] = {}
    proc_dic['proc']['pid'] = proc[1]
    proc_dic['proc']['exe'] = proc[2]
    proc_dic['proc']['ppid'] = proc[3]
    proc_dic['proc']['args'] = proc[4]
    proc_dic['t_id'] = str(node[2])
    proc_dic['t_name'] = node[3]
    try:
        proc_json = json.dumps(proc_dic)
    except json.decoder.JSONDecodeError as error:
        print(error)
    return proc_json

def file_to_json(node, file):
    file_dic = {}
    file_dic['n_id'] = str(node[0])
    file_dic['n1_id'] = str(node[0])
    file_dic['n2_id'] = str(node[0])
    file_dic['n_type'] = types[node[1]]
    file_dic['file'] = {}
    file_dic['file']['name'] = file[1]
    file_dic['file']['version'] = file[2]
    file_dic['t_id'] = str(node[2])
    file_dic['t_name'] = node[3]
    try:
        file_json = json.dumps(file_dic)
    except json.decoder.JSONDecodeError as error:
        print(error)
    return file_json

def socket_to_json(node, socket):
    socket_dic = {}
    socket_dic['n_id'] = str(node[0])
    socket_dic['n1_id'] = str(node[0])
    socket_dic['n2_id'] = str(node[0])
    socket_dic['n_type'] = types[node[1]]
    socket_dic['socket'] = {}
    socket_dic['socket']['name'] = socket[1]
    socket_dic['t_id'] = str(node[2])
    socket_dic['t_name'] = node[3]
    try:
        socket_json = json.dumps(socket_dic)
    except json.decoder.JSONDecodeError as error:
        print(error)
    return socket_json