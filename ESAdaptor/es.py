from elasticsearch import Elasticsearch, helpers
import config

# https://towardsdatascience.com/getting-started-with-elasticsearch-in-python-c3598e718380

class ES:
    es_object = None
    params = {}

    def __init__(self, config_file='maclocal.ini'):
        self.params = config.config(config_file, "elasticsearch")

    def connect(self):
        self.es_object = Elasticsearch([self.params])

    def create_behaviors_index(self, trace='test'):
        index_name = 'behaviors_' + trace
        created = False
        # index settings
        settings = {
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "mappings": {
                "properties": {
                    "e_id": {
                        "type": "text"
                    },
                    "n1_id": {
                        "type": "text"
                    },
                    "n2_id": {
                        "type": "text"
                    },
                    "relation": {
                        "type": "text"
                    },
                    "sequence": {
                        "type": "long"
                    },
                    "session": {
                        "type": "long"
                    },
                    "@timestamp": {
                        "type": "date"
                    },
                    "b_id": {
                        "type": "text"
                    },
                    "t_id": {
                        "type": "text"
                    },
                    "t_name": {
                        "type": "text"
                    }
                }
            }
        }
        try:
            if not self.es_object.indices.exists(index_name):
                # Ignore 400 means to ignore "Index Already Exist" error.
                self.es_object.indices.create(index=index_name, ignore=400, body=settings)
                print('Created Index ' + index_name)
            else:
                print('Index ' + index_name + ' already exists')
            created = True
        except Exception as error:
            print(error)
        finally:
            return created

    def create_edges_index(self, trace='test'):
        index_name = 'edges_' + trace
        created = False
        # index settings
        settings = {
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "mappings": {
                "properties": {
                    "e_id": {
                        "type": "text",
                    },
                    "n1_id": {
                        "type": "text"
                    },
                    "n2_id": {
                        "type": "text"
                    },
                    "relation": {
                        "type": "text"
                    },
                    "sequence": {
                        "type": "long"
                    },
                    "session": {
                        "type": "long"
                    },
                    "@timestamp": {
                        "type": "date"
                    },
                    "t_id": {
                        "type": "text"
                    },
                    "t_name": {
                        "type": "text"
                    }
                }
            }
        }
        try:
            if not self.es_object.indices.exists(index_name):
                # Ignore 400 means to ignore "Index Already Exist" error.
                self.es_object.indices.create(index=index_name, ignore=400, body=settings)
                print('Created Index ' + index_name)
            else:
                print('Index ' + index_name + ' already exists')
            created = True
        except Exception as error:
            print(error)
        finally:
            return created
    
    def create_nodes_index(self, trace='test'):
        index_name = 'nodes_' + trace
        created = False
        # index settings
        settings = {
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0
            },
            "mappings": {
                "properties": {
                    "n_id": {
                        "type": "text"
                    },
                    "n1_id": {
                        "type": "text"
                    },
                    "n2_id": {
                        "type": "text"
                    },
                    "n_type": {
                        "type": "text"
                    },
                    "proc": {
                        "properties": {
                            "pid": {
                                "type": "long"
                            },
                            "exe": {
                                "type": "text"
                            },
                            "ppid": {
                                "type": "long"
                            },
                            "args": {
                                "type": "text"
                            },
                        }
                    },
                    "file": {
                        "properties": {
                            "name": {
                                "type": "text"
                            },
                            "version": {
                                "type": "text"
                            }
                        }
                    },
                    "socket": {
                        "properties": {
                            "name": {
                                "type": "text"
                            }
                        }
                    },
                    "t_id": {
                        "type": "text"
                    },
                    "t_name": {
                        "type": "text"
                    }
                }
            }
        }
        try:
            if not self.es_object.indices.exists(index_name):
                # Ignore 400 means to ignore "Index Already Exist" error.
                self.es_object.indices.create(index=index_name, ignore=400, body=settings)
                print('Created Index ' + index_name)
            else:
                print('Index ' + index_name + ' already exists')
            created = True
        except Exception as error:
            print(error)
        finally:
            return created
    
    def send_behaviors(self, data, trace='test'):
        index_name = 'behaviors_' + trace
        actions = [
            {
                "_index": index_name,
                "_source": data[i]
            }
            for i in range(len(data))
        ]
        helpers.bulk(self.es_object, actions)
        print("Finished sending behaviors.")

    def send_edges(self, data, trace='test'):
        index_name = 'edges_' + trace
        actions = [
            {
                "_index": index_name,
                "_source": data[i]
            }
            for i in range(len(data))
        ]
        helpers.bulk(self.es_object, actions)
        print("Finished sending edges.")
    
    def send_nodes(self, data, trace='test'):
        index_name = 'nodes_' + trace
        actions = [
            {
                "_index": index_name,
                "_source": data[i]
            }
            for i in range(len(data))
        ]
        helpers.bulk(self.es_object, actions)
        print("Finished sending nodes.")