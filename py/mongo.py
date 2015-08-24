import pymongo
import datetime
from pymongo import MongoClient


print "Connecting..."
client = MongoClient('mongodb://nagisa:jetTheD0g@localhost:3001/meteor')
db = client.meteor

print "Connected to: ", db.client

transaction = { 'username':'Jet',
                'amount':-1111,
                'type':'offering',
                'createdAt': datetime.datetime.now(),
                'owner': 'gYzdjntuyqWHtGihL'
                }

db.transactions.insert_one(transaction).inserted_id





query = {'username':'Jet'}




print "Exiting..."
client.close()
