import psycopg2
import config

# https://www.postgresqltutorial.com/postgresql-python/connect/
# https://www.postgresqltutorial.com/postgresql-python/query/

class PgDB:
    conn = None
    params = {}
    
    def __init__(self, config_file='local.ini'):
        self.params = config.config(config_file, "postgresql")

    def connect(self):
        try:
            print('Connecting to the PostgreSQL database...')
            self.conn = psycopg2.connect(**self.params)
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return self.conn
    
    def get_trace(self, trace='trace_name'):
        try:
            cur = self.conn.cursor()
            sql = "SELECT t_id, name, description FROM logs.traces WHERE name = '" + trace + "';"
            cur.execute(sql)
            row = cur.fetchone()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return row

    def get_behavior_edges(self, trace='trace_name'):
        try:
            cur = self.conn.cursor()
            (t_id, _, _ ) = self.get_trace(trace)
            sql = "SELECT logs.behaviors.e_id, n1_hash, n2_hash, relation, sequence, session, timestamp, b_id, logs.behaviors.t_id, name "                       \
                "FROM logs.behaviors INNER JOIN (SELECT e_id, n1_hash, n2_hash, relation, sequence, session, timestamp, logs.edges.t_id, name "                \
                "FROM logs.edges INNER JOIN (SELECT * FROM logs.traces WHERE name = '" + trace + "') AS temp ON logs.edges.t_id = temp.t_id ORDER BY sequence) "    \
                "AS temp_a ON logs.behaviors.e_id = temp_a.e_id;"
            cur.execute(sql)
            rows = cur.fetchall()
            print("The number of edges in behaviors: ", cur.rowcount)
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return rows
    
    def get_raw_edges(self, trace='trace_name'):
        try:
            cur = self.conn.cursor()
            sql = "SELECT e_id, n1_hash, n2_hash, relation, sequence, session, timestamp, logs.edges.t_id, name "        \
                "FROM logs.edges INNER JOIN (SELECT * FROM logs.traces WHERE name = '" + trace + "') AS temp ON logs.edges.t_id = temp.t_id ORDER BY sequence;"
            cur.execute(sql)
            rows = cur.fetchall()
            print("The number of edges: ", cur.rowcount)
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return rows
    
    def get_nodes(self, trace='trace_name'):
        try:
            cur = self.conn.cursor()
            sql = "SELECT n_id, n_type, logs.nodes.t_id, name "        \
                "FROM logs.nodes INNER JOIN (SELECT * FROM logs.traces WHERE name = '" + trace + "') AS temp ON logs.nodes.t_id = temp.t_id;"
            cur.execute(sql)
            rows = cur.fetchall()
            print("The number of nodes: ", cur.rowcount)
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return rows
    
    def get_proc(self, n_id):
        try:
            cur = self.conn.cursor()
            sql = "SELECT n_id, pid, exe, ppid, args FROM logs.procs WHERE n_id = " + str(n_id) + ";"
            cur.execute(sql)
            row = cur.fetchone()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return row
    
    def get_file(self, n_id):
        try:
            cur = self.conn.cursor()
            sql = "SELECT n_id, name, version FROM logs.files WHERE n_id = " + str(n_id) + ";"
            cur.execute(sql)
            row = cur.fetchone()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return row

    def get_socket(self, n_id):
        try:
            cur = self.conn.cursor()
            sql = "SELECT n_id, name FROM logs.sockets WHERE n_id = " + str(n_id) + ";"
            cur.execute(sql)
            row = cur.fetchone()
            cur.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        return row
    
    def disconnect(self):
        if self.conn is not None:
            self.conn.close()
            print('Database connection closed.')
