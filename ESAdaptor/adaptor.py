from pg import PgDB
import normalize
from es import ES
import sys

postgresql = PgDB("local.ini")
postgresql.connect()

if len(sys.argv) != 2:
    print("Please enter the trace name.")
    sys.exit(0)

trace_name = sys.argv[1]

bh_edges = postgresql.get_behavior_edges(trace_name)
bh_edges_list = [normalize.bh_edge_to_json(edge) for edge in bh_edges]

edges = postgresql.get_raw_edges(trace_name)
edges_list = [normalize.edge_to_json(edge) for edge in edges]

nodes = postgresql.get_nodes(trace_name)

procs_list = []
files_list = []
sockets_list = []
for node in nodes:
    if node[1] == 1:
        proc = postgresql.get_proc(node[0])
        procs_list.append(normalize.proc_to_json(node, proc))
    if node[1] == 2:
        file = postgresql.get_file(node[0])
        files_list.append(normalize.file_to_json(node, file))
    if node[1] == 3:
        socket = postgresql.get_socket(node[0])
        sockets_list.append(normalize.socket_to_json(node, socket))

postgresql.disconnect()

es = ES("local.ini")
es.connect()
es.send_behaviors(bh_edges_list, trace_name)
es.send_edges(edges_list, trace_name)
es.send_nodes(procs_list, trace_name)
es.send_nodes(files_list, trace_name)
es.send_nodes(sockets_list, trace_name)
