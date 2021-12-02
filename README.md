# mcomp_project_open

This project builds a framework for provenance data summarization and visualization.

## Architecture
![Architecture](./Architecture.pdf)

## Log Collector and Processer
This part utilizes an adapted Sherlock to collect and process Linux audit logs and save the structured logs to the database.

## Knowledge Base
The database design and how to configure the database are in ``Database`` folder.

## Search and Visualization
``ESAdaptor`` provides an adaptor to fetch structured logs from the database and send them to Elasticsearch.

``Visualization`` includes the visualization design and plugin used in this project.

There are also some visualization examples in ``Evaluation`` folder.