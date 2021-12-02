# mcomp_project_open

This project builds a framework for provenance data summarization and visualization.

## Architecture
![Architecture](https://github.com/yyyayo/mcomp_project_open/blob/main/Architecture.pdf?raw=true)

## Log Collector and Processer
This part utilizes an [adapted Sherlock](https://github.com/yyyayo/mcomp_project_open/tree/main/Sherlock) to collect and process Linux audit logs and save the structured logs to the database.

## Knowledge Base
The database design and how to configure the database are in [Database](https://github.com/yyyayo/mcomp_project_open/tree/main/Database) folder.

## Search and Visualization
[ESAdaptor](https://github.com/yyyayo/mcomp_project_open/tree/main/ESAdaptor) provides an adaptor to fetch structured logs from the database and send them to Elasticsearch.

[Visualization](https://github.com/yyyayo/mcomp_project_open/tree/main/Visualization) includes the visualization design and plugin used in this project.

There are also some visualization examples in [Evaluation](https://github.com/yyyayo/mcomp_project_open/tree/main/Evaluation) folder.