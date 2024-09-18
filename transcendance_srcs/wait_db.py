import time
import os
import psycopg2
from django.db import connections
from django.db.utils import OperationalError

def wait_for_db():
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendance_srcs.settings')
	db_conn = None
	while not db_conn:
		try:
			db_conn = connections['default']
			db_conn.ensure_connection()
			db_conn.	
		except OperationalError:
			print("Database unavailable, waiting 1 second...")
			time.sleep(1)

if __name__ == '__main__':
	wait_for_db()