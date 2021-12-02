## PostgreSQL Installation and Configuration

### For Local Linux

Install PostgreSQL first:
```bash
sudo apt install postgresql postgresql-contrib
```

Modify configuration files:
(The postgresql version may be different)
```bash
echo "host all all all md5" | sudo tee -a /etc/postgresql/12/main/pg_hba.conf
echo "listen_addresses = '*'" | sudo tee -a /etc/postgresql/12/main/postgresql.conf
sudo systemctl restart postgresql
```

Log into PostgreSQL and create database ``log`` and schema ``logs``:
```
psql

CREATE ROLE <role_name> PASSWORD '<password>';
ALTER ROLE <role_name> WITH LOGIN;
CREATE DATABASE log;
GRANT ALL PRIVILEGES ON DATABASE log TO <role_name>;
\c log;
CREATE SCHEMA logs;
GRANT ALL PRIVILEGES ON SCHEMA logs TO <role_name>;
\q
```

### For Local MacOS

Install PostgreSQL first:
```bash
brew install postgresql
psql postgres
brew info postgres
brew services restart postgresql
```

Modify configuration files:
```bash
echo "host all all all md5" | tee -a /usr/local/var/postgres/pg_hba.conf
echo "listen_addresses = '*'" | tee -a /usr/local/var/postgres/postgresql.conf
brew services restart postgresql
```

Log into PostgreSQL and create database ``log`` and schema ``logs``:
```
psql postgres

CREATE ROLE <role_name> PASSWORD '<password>';
ALTER ROLE <role_name> WITH LOGIN;
CREATE DATABASE log;
GRANT ALL PRIVILEGES ON DATABASE log TO <role_name>;
\c log;
CREATE SCHEMA logs;
GRANT ALL PRIVILEGES ON SCHEMA logs TO <role_name>;
\q
```

### For Remote Linux Server

The superuser of the server does these steps to create a PostgreSQL user with the same name as the linux user ``<linux_user>``：
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl status postgresql 
sudo -u postgres createuser --superuser <linux_user>
sudo -u postgres createdb <linux_user>
echo "host all all all md5" | sudo tee -a /etc/postgresql/12/main/pg_hba.conf
echo "listen_addresses = '*'" | sudo tee -a /etc/postgresql/12/main/postgresql.conf
sudo systemctl restart postgresql
# sudo ufw allow 5432
```

Log into PostgreSQL as ``<linux_user>`` and alter the password of PostgreSQL user ``<linux_user>``：
```
su <linux_user>
psql

ALTER USER <linux_user> WITH PASSWORD '<user_password>';
\q
```

Then you can remotely log into PostgreSQL as user ``<linux_user>``：
```bash
psql -U <linux_user> -d <linux_user> -h <ip_address>
```

After logging into PostgreSQL database, create a new user and grant priviledges to it so that ``<role_name>`` can connect to the database：
```
CREATE ROLE <role_name> PASSWORD '<password>';
ALTER ROLE <role_name> WITH LOGIN;
CREATE DATABASE log;
GRANT ALL PRIVILEGES ON DATABASE log TO <role_name>;
\c log;
CREATE SCHEMA logs;
GRANT ALL PRIVILEGES ON SCHEMA logs TO <role_name>;
\q
```